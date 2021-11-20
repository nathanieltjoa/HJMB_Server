const { LaporanMixerPipa, Karyawan, Jabatan, PembagianAnggota, HLaporanMixerPipa, DLaporanMixerPipa, FLaporanMixerPipa, ULaporanMixerPipa,sequelize } = require('../../models');
const {Op} = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { UserInputError, AuthenticationError} = require('apollo-server-express');
const {JWT_SECRET} = require('../../config/env.json')
const dayjs = require('dayjs');
const Sequelize = require('sequelize');
const path = require('path');
const fs = require('fs');

module.exports={
    Query: {
        //general
        getLaporanMasterMixerPipa:  async (_,args,{user}) =>{
            var {karyawan, orderBy, bulan, status, banding, page, limit} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans;
                var offset = page ? page * limit: 0;


                var orderKu =[];
                var whereDKu = [];
                var whereHKu = [];
                if(bulan !== null){
                    if(bulan.toString() !== "Invalid Date"){
                        var date = new Date(bulan);
                        var y = date.getFullYear(), m = date.getMonth();
                        var firstDay = dayjs(new Date(y, m, 1)).format('YYYY-MM-DD');
                        var lastDay = dayjs(new Date(y, m + 1, 0)).format('YYYY-MM-DD');
                        whereDKu.push({
                            createdAt: {
                                [Op.between]: [firstDay, lastDay]
                            }
                        })
                    }
                }
                if(status !== 0){
                    whereDKu.push({
                        status: {[Op.eq]: status}
                    })
                }
                if(banding !== 0){
                    var pernahBanding = banding === 1? true: false;
                    whereDKu.push({
                        pernahBanding: {[Op.eq]: pernahBanding}
                    })
                }
                if(orderBy === "Laporan Terbaru"){
                    orderKu= [
                        ["createdAt", "DESC"]
                    ]
                }else if(orderBy === "Laporan Terlama"){
                    orderKu= [
                        ["createdAt", "ASC"]
                    ]
                }
                if(karyawan !== null){
                    var cekLaporan = await PembagianAnggota.findOne({
                        where: {idKaryawan: {[Op.eq]: karyawan}}
                    })
                    if(cekLaporan !== null){
                        var cekKaryawan = await Karyawan.findOne({
                            where: {id: {[Op.eq]: karyawan}}
                        })
                        cekLaporan = await PembagianAnggota.findOne({
                            include: [{
                                model: Karyawan,
                                as: 'karyawan',
                                where: {JabatanId: {[Op.eq]: cekKaryawan.JabatanId}}
                            }],
                            where: {
                                groupKaryawan: {[Op.eq]: cekLaporan.groupKaryawan},
                                ketua: {[Op.eq]: true}
                            }
                        })
                        whereHKu.push({
                            idPelapor: {[Op.eq]: cekLaporan.idKaryawan}
                        })
                    }else{
                        whereHKu.push({
                            idPelapor: {[Op.eq]: karyawan}
                        })
                    }
                }
                var laporan ={};
                var laporanBaru = [];
                var cekLaporan;
                laporans = await HLaporanMixerPipa.findAndCountAll({
                    include: [
                        {
                            model: Karyawan,
                            as: 'karyawan',
                        },
                        {
                            model: Karyawan,
                            as: 'ketua',
                        },{
                            model: DLaporanMixerPipa,
                            as: 'dLaporanMixerPipa',
                            where: whereDKu
                        }
                    ],
                    limit: limit,
                    offset: offset,
                    order: orderKu,
                    where: whereHKu,
                    subQuery: false,
                });
                laporan.count = laporans.count
                await Promise.all(laporans.rows.map(async element =>
                    { 
                        cekLaporan = await DLaporanMixerPipa.count({
                            where: {
                                HLaporanMixerPipaId: {[Op.eq]: element.id},
                                pernahBanding: {[Op.eq]: true}
                            }
                        })
                        element.jumlahBanding = cekLaporan;
                        laporanBaru.push(element);
                    }))
                laporan.rows = laporanBaru;
                return laporan;
            }catch(err){
                console.log(err);
                throw err
            }
        },
        getSummaryMixerPipa: async (_,__,{user}) =>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                
                var date = new Date();
                var y = date.getFullYear(), m = date.getMonth();
                var firstDay = dayjs(new Date(y, m, 1)).format('YYYY-MM-DD');
                var lastDay = dayjs(new Date(y, m + 1, 0)).format('YYYY-MM-DD');
                var getKaryawan = await HLaporanMixerPipa.findAll({
                    attributes: [
                        'idPelapor',
                        [sequelize.fn('sum', sequelize.col('totalMix')), 'jumlahProduksi'],
                    ],
                    include:{
                        model: Karyawan,
                        as: 'karyawan',
                        attributes: ['nama']
                    },
                    where: {
                        createdAt: {
                            [Op.between]: [firstDay, lastDay]
                        }
                    },
                    order: sequelize.literal('jumlahProduksi DESC'),
                    group: ['idPelapor']
                })
                var cekProduksi;
                await Promise.all(getKaryawan.map(async element => {
                    cekProduksi = await DLaporanMixerPipa.count({
                        include:[{
                            model: HLaporanMixerPipa,
                            as: 'hLaporan',
                            where: {
                                idPelapor: {[Op.eq]: element.idPelapor}
                            }
                        }],
                        where: {
                            pernahBanding: {[Op.eq]: true},
                            createdAt: {
                                [Op.between]: [firstDay, lastDay]
                            }
                        }
                    })
                    element.jumlahBanding = cekProduksi;
                    element.jumlahProduksi = element.dataValues.jumlahProduksi;
                    cekProduksi = await DLaporanMixerPipa.count({
                        include:[{
                            model: HLaporanMixerPipa,
                            as: 'hLaporan',
                            where: {
                                idPelapor: {[Op.eq]: element.idPelapor}
                            }
                        }],
                        where: {
                            totalHasil: {[Op.lt]: sequelize.col('targetKerja')},
                            createdAt: {
                                [Op.between]: [firstDay, lastDay]
                            }
                        }
                    })
                    element.tidakCapaiTarget = cekProduksi;
                }))
                return getKaryawan;
            }catch(err){
                console.log(err);
                throw err
            }
        },
        getLaporans: async (_,args,{user}) =>{
            var {status, page, limit} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans;
                page -= 1;
                var offset = page ? page * limit: 0;
                var jabatan = await Jabatan.findOne({
                    where: { id: {[Op.eq]: user.userJWT.idJabatan}}
                })
                if(jabatan.tingkatJabatan === 5){
                    var cekLaporan = await PembagianAnggota.findOne({
                        where: {idKaryawan: {[Op.eq]: user.userJWT.id}}
                    })
                    if(cekLaporan !== null){
                        cekLaporan = await PembagianAnggota.findOne({
                            include: [{
                                model: Karyawan,
                                as: 'karyawan',
                                where: {JabatanId: {[Op.eq]: user.userJWT.idJabatan}}
                            }],
                            where: {
                                groupKaryawan: {[Op.eq]: cekLaporan.groupKaryawan},
                                ketua: {[Op.eq]: true}
                            }
                        })
                    }else{
                        cekLaporan.idKaryawan = user.userJWT.id;
                    }
                    if(status === 0){
                        laporans = await DLaporanMixerPipa.findAndCountAll({
                            include:[{
                                model: HLaporanMixerPipa,
                                as: 'hLaporan',
                                where: {
                                    idPelapor: {[Op.eq]: cekLaporan.idKaryawan}
                                },
                                include:[{
                                    model: Karyawan,
                                    as: 'karyawan'
                                }]
                            }],
                            limit: limit,
                            offset: offset,
                            order: [['createdAt','DESC']]
                        })
                    }else{
                        laporans = await DLaporanMixerPipa.findAndCountAll({
                            include:[{
                                model: HLaporanMixerPipa,
                                as: 'hLaporan',
                                where: {
                                    idPelapor: {[Op.eq]: cekLaporan.idKaryawan}
                                },
                                include:[{
                                    model: Karyawan,
                                    as: 'karyawan'
                                }]
                            }],
                            where: { 
                                status: {[Op.eq]: status},
                            },
                            limit: limit,
                            offset: offset,
                            order: [['createdAt','DESC']]
                        })
                    }
                }else if(jabatan.tingkatJabatan === 4){
                    if(status === 0){
                        laporans = await DLaporanMixerPipa.findAndCountAll({
                            include:[{
                                model: HLaporanMixerPipa,
                                as: 'hLaporan',
                                include:[{
                                    model: Karyawan,
                                    as: 'karyawan'
                                }]
                            }],
                            limit: limit,
                            offset: offset,
                            order: [['createdAt','DESC']]
                        })
                    }else{
                        laporans = await DLaporanMixerPipa.findAndCountAll({
                            include:[{
                                model: HLaporanMixerPipa,
                                as: 'hLaporan',
                                include:[{
                                    model: Karyawan,
                                    as: 'karyawan'
                                }]
                            }],
                            where: { status: {[Op.eq]: status}},
                            limit: limit,
                            offset: offset,
                            order: [['createdAt','DESC']]
                        })
                    }
                }
                return laporans;
            }catch(err){
                console.log(err);
                throw err
            }
        },
        getHLaporans: async (_,args,{user}) =>{
            var {status, page, limit} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                page -= 1;
                var offset = page ? page * limit: 0;
                var laporans = await HLaporanMixerPipa.findAndCountAll({
                    include:[{
                        model: Karyawan,
                        as: 'karyawan'
                    }],
                    limit: limit,
                    offset: offset,
                    order: [['createdAt','DESC']]
                })
                return laporans;
            }catch(err){
                console.log(err);
                throw err
            }
        },
        getListDetailMixerPipa: async (_,args,{user}) =>{
            var {id} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                
                var getKaryawan = await DLaporanMixerPipa.findAll({
                    include:[{
                        model: ULaporanMixerPipa,
                        as: 'uLaporan',
                        where: {
                            diHapus: {[Op.eq]: false}
                        }
                    },{
                        model: FLaporanMixerPipa,
                        as: 'fLaporan'
                    }],
                    where: {
                        HLaporanMixerPipaId: {[Op.eq]: id}
                    },
                })
                console.log(getKaryawan);
                return getKaryawan;
            }catch(err){
                console.log(err);
                throw err
            }
        },
        getDetailLaporanMixerPipa: async (_,args,{user}) =>{
            var {id} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                
                var getKaryawan = await DLaporanMixerPipa.findOne({
                    include:[{
                        model: ULaporanMixerPipa,
                        as: 'uLaporan',
                        where: {
                            diHapus: {[Op.eq]: false}
                        }
                    },{
                        model: FLaporanMixerPipa,
                        as: 'fLaporan'
                    }],
                    where: {
                        id: {[Op.eq]: id}
                    },
                })
                console.log(getKaryawan);
                return getKaryawan;
            }catch(err){
                console.log(err);
                throw err
            }
        },
        //HRD
        //Direktur
        //Staf Keuangan
        //Ketua Divisi
        //Anggota Divisi
      },
    Mutation: {
        //General

        //HRD
        tambahLaporan: async (_,args, {user})=>{
            var {tipeMesin, jenisMixer, bahanBaku, totalHasil, targetMixer, formulaA, formulaB, formulaC, crusher,file, keterangan} = args;
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                
                var cekLaporan = await PembagianAnggota.findOne({
                    where: {idKaryawan: {[Op.eq]: user.userJWT.id}}
                })
                if(cekLaporan === null){
                    throw new UserInputError('Error',  {errors: `Belum Ada Pembagian Anggota`} )
                }

                if(cekLaporan.ketua === false){
                    throw new UserInputError('Error',  {errors: `Akun Anda Tidak Memiliki Hak Untuk Buat Laporan`} )
                }
                var pad = "000"
                var counterTgl = dayjs(new Date()).format('DDMMYYYY');
                var id = "H" + counterTgl;
                var idDLaporan = "D" + counterTgl;
                var idFLaporan = "F" + counterTgl;
                var idULaporan = "U" + counterTgl;
                var counterId;
                var idPelapor = user.userJWT.id;
                var idKetua = 0;
                var status = 1;
                var keteranganBanding = "";
                var laporan = null;
                var pernahBanding = false;

                cekLaporan = await HLaporanMixerPipa.findOne({
                    where: {
                        id: {[Op.startsWith]: id},
                        jenisMixer: {[Op.eq]: jenisMixer},
                        tipeMesin: {[Op.eq]: tipeMesin}
                    }
                })
                if(cekLaporan === null){
                    cekLaporan = await HLaporanMixerPipa.count({
                        where: {
                            id: {[Op.startsWith]: id},
                        }
                    })
                    id += pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();
                    
                    laporan = await HLaporanMixerPipa.create({
                        id, jenisMixer, tipeMesin, idPelapor: user.userJWT.id, idKetua: 0 , totalMix: 0,
                        formulaA: 0, formulaB:0, formulaC: 0, crusher: 0
                    },{transaction: t})
                }else{
                    id = cekLaporan.id;
                }

                
                cekLaporan = await DLaporanMixerPipa.count({
                    where: {
                        id: {[Op.startsWith]: idDLaporan},
                    }
                })
                idDLaporan += pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();
                
                laporan = await DLaporanMixerPipa.create({
                    id: idDLaporan, HLaporanMixerPipaId: id, totalHasil, targetKerja: targetMixer, keterangan, status, pernahBanding, keteranganBanding
                    ,formulaA, formulaB, formulaC, crusher
                },{transaction: t})

                
                cekLaporan = await ULaporanMixerPipa.count({
                    where: {
                        id: {[Op.startsWith]: idULaporan}
                    }
                })
                var counterId = cekLaporan;
                var counterIdULaporan;
                await Promise.all(bahanBaku.map(async element => {
                    counterId = counterId + 1;
                    counterIdULaporan = idULaporan + pad.substring(0, pad.length - counterId.toString().length) + counterId.toString();
                    await ULaporanMixerPipa.create({
                        id: counterIdULaporan, DLaporanMixerPipaId: idDLaporan, namaBahan: element.namaBahan, totalBahan: element.totalBahan,
                        diHapus: false
                    },{transaction: t})
                }));
                if(file !== null){
                    var listId = [];
                    const storeUpload = async ({ stream, filename, mimetype, encoding, counter }) => {
                        counterId = idFLaporan + pad.substring(0, pad.length - counter.toString().length) + counter.toString();
                        const { ext } = path.parse(filename);
                        var namaFile = counterId + ext;
                        listId.push({
                            id: counterId,
                            foto: namaFile
                        })
                        const pathName = path.join(__dirname, `../../public/laporan/Mixer Pipa/${namaFile}`)
                    
                        return await new Promise( (resolve, reject) =>
                            stream
                                .pipe(fs.createWriteStream(pathName))
                                .on("finish",async () => { 
                                    resolve();
                                })
                                .on("error", reject)
                        );
                    };

                    const processUpload = async (upload, counter) => {
                        const { createReadStream, filename, mimetype, encoding } = await upload;
                        const stream = createReadStream();
                        const file = await storeUpload({ stream, filename, mimetype, encoding, counter });
                    };


                    cekLaporan = await FLaporanMixerPipa.count({
                        where: {
                            id: {[Op.startsWith]: idFLaporan},
                        }
                    })
                    await Promise.all(file.map(async element => {
                        cekLaporan += 1;
                        const upload = await processUpload(element, cekLaporan);
                    }))
                    await Promise.all(listId.map(async element => {
                        var foto = `http://localhost:4000/laporan/Mixer Pipa/${element.foto}`
                        laporan = await FLaporanMixerPipa.create({
                            id: element.id, DLaporanMixerPipaId: idDLaporan, foto
                        },{transaction: t})
                    }))
                }
                
                t.commit()
                return laporan;
            }catch(err){
                console.log(err);
                t.rollback()
                throw err
            }
        },
        updateLaporan: async (_,args,{user}) =>{
            var {id, bahanBaku, totalHasil, formulaA, formulaB, formulaC, crusher,keterangan} = args;
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var pad="000";
                var cekLaporan = await DLaporanMixerPipa.findOne({
                    where: {id: {[Op.eq]: id}}
                })

                cekLaporan = await HLaporanMixerPipa.findOne({
                    where: {
                        id: {[Op.eq]: cekLaporan.HLaporanMixerPipaId},
                        idPelapor: {[Op.eq]: user.userJWT.id}
                    }
                })
                if(cekLaporan === null){
                    throw new UserInputError('Error',  {errors: `Akun Anda Tidak Memiliki Hak Untuk Laporan Ini`} )
                }
                var laporan = await DLaporanMixerPipa.update({
                    status: 1, totalHasil, keterangan, formulaA, formulaB, formulaC, crusher
                },{
                    where: {id: {[Op.eq]: id}},
                    transaction: t 
                });
                var counterId = id.replace('D','U').slice(0,9);
                var cekLaporan = await ULaporanMixerPipa.count({
                    where: {
                        id: {[Op.startsWith]: counterId}
                    }
                })
                var counterIdULaporan;
                await Promise.all(bahanBaku.map( async element => {
                    if(element.baru === true){
                        cekLaporan += 1;
                        counterIdULaporan = counterId + pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();
                        await ULaporanMixerPipa.create({
                            id: counterIdULaporan, DLaporanMixerPipaId: id, namaBahan: element.namaBahan,
                            totalBahan: element.totalBahan, diHapus : false
                        },{transaction: t})
                    }
                    else if(element.action === 'hapus'){
                        await ULaporanMixerPipa.update({
                            diHapus: true,
                        },{
                            where: {id: {[Op.eq]: element.id}},
                            transaction: t
                        })
                    }
                    else if(element.action === 'edit'){
                        await ULaporanMixerPipa.update({
                            namaBahan: element.namaBahan,
                            totalBahan: element.totalBahan,
                        },{
                            where: {id: {[Op.eq]: element.id}},
                            transaction: t
                        })
                    }
                }))
                t.commit()
                return laporan;
            }catch(err){
                console.log(err);
                t.rollback()
                throw err
            }
        },
        updateStatusLaporan: async (_,args,{user})=>{
            var {id, status, keteranganBanding} = args;
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporan = null;
                var cekLaporan = await DLaporanMixerPipa.findOne({
                    where: {id: {[Op.eq]: id}}
                });
                if(status === 3){
                    await DLaporanMixerPipa.update({status: status, pernahBanding: true, keteranganBanding: keteranganBanding},{
                        where: {id: {[Op.eq]: id}},
                        transaction: t
                    });
                    await HLaporanMixerPipa.update({idKetua: user.userJWT.id},{
                        where: {id: {[Op.eq]: cekLaporan.HLaporanMixerPipaId}},
                        transaction: t
                    })
                }else{
                    var idHLaporan = cekLaporan.HLaporanMixerPipaId;
                    var totalHasil = cekLaporan.totalHasil;
                    var formulaA = cekLaporan.formulaA;
                    var formulaB = cekLaporan.formulaB;
                    var formulaC = cekLaporan.formulaC;
                    var crusher = cekLaporan.crusher;
                    cekLaporan = await HLaporanMixerPipa.findOne({
                        where: {
                            id: {[Op.eq]: idHLaporan}
                        }
                    })
                    await HLaporanMixerPipa.update({ 
                        idKetua: user.userJWT.id, totalMix: (cekLaporan.totalMix + totalHasil), formulaA: (cekLaporan.formulaA + formulaA),
                        formulaB: (cekLaporan.formulaB + formulaB), formulaC: (cekLaporan.formulaC + formulaC),
                        crusher: (cekLaporan.crusher + crusher)
                    },{
                        where: {id: {[Op.eq]: idHLaporan}},
                        transaction: t
                    })
                    await DLaporanMixerPipa.update({status: status},{
                        where: {id: {[Op.eq]: id}},
                        transaction: t
                    });
                }
                t.commit();
                return laporan;
            }catch(err){
                console.log(err);
                t.rollback()
                throw err
            }
        }
        //Direktur

        //Staf Keuangan

        //Ketua Divisi

        //Anggota Divisi

    }
}