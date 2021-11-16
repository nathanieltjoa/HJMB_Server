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
                }
                laporans = await DLaporanMixerPipa.findAndCountAll({
                    include: [
                        {
                            model: Karyawan,
                            as: 'karyawan',
                        },
                        {
                            model: Karyawan,
                            as: 'ketua',
                        },{
                            model: HLaporanMixerPipa,
                            as: 'hLaporan',
                            where: whereHKu
                        }
                    ],
                    limit: limit,
                    offset: offset,
                    order: orderKu,
                    where: whereDKu
                });
                return laporans;
            }catch(err){
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
                throw err
            }
        },
        getLaporans: async (_,args,{user}) =>{
            var {status, page, limit} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans;
                var laporanBaru = [];
                page -= 1;
                var laporan = {};
                var offset = page ? page * limit: 0;
                var cekKaryawan;
                var namaKaryawan;
                var jabatan = await Jabatan.findOne({
                    where: { id: {[Op.eq]: user.userJWT.idJabatan}}
                })
                if(jabatan.tingkatJabatan === 5){
                    var cekLaporan = await PembagianAnggota.findOne({
                        where: {idKaryawan: {[Op.eq]: user.userJWT.id}}
                    })
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
                    if(status === 0){
                        laporans = await DLaporanMixerPipa.findAndCountAll({
                            include:[{
                                model: HLaporanMixerPipa,
                                as: 'hLaporan',
                                where: {
                                    idPelapor: {[Op.eq]: cekLaporan.idKaryawan}
                                }
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
                                }
                            }],
                            where: { 
                                status: {[Op.eq]: status},
                            },
                            limit: limit,
                            offset: offset,
                            order: [['createdAt','DESC']]
                        })
                    }
                    laporan.count = laporans.count;
                    await Promise.all(laporans.rows.map(async (element) =>
                    { 
                        namaKaryawan = "-";
                        if(element.idKetua !== 0){
                            //Cek apakah divisi dari anggota yang request sudah sesuai apa belum
                            cekKaryawan = await Karyawan.findOne({
                                where: {id: {[Op.eq]: element.idKetua}}
                            })
                            namaKaryawan = cekKaryawan.nama;
                        }
                        element.namaPelapor = namaKaryawan;
                        laporanBaru.push(element);
                    }))
                }else if(jabatan.tingkatJabatan === 4){
                    if(status === 0){
                        laporans = await DLaporanMixerPipa.findAndCountAll({
                            include:[{
                                model: HLaporanMixerPipa,
                                as: 'hLaporan',
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
                            }],
                            where: { status: {[Op.eq]: status}},
                            limit: limit,
                            offset: offset,
                            order: [['createdAt','DESC']]
                        })
                    }
                    laporan.count = laporans.count;
                    await Promise.all(laporans.rows.map(async (element) =>
                    { 
                        //Cek apakah divisi dari anggota yang request sudah sesuai apa belum
                        cekKaryawan = await Karyawan.findOne({
                            where: {id: {[Op.eq]: element.idPelapor}}
                        })
                        element.namaPelapor = cekKaryawan.nama;
                        laporanBaru.push(element);
                    }))
                }
                laporan.rows = laporanBaru;
                return laporans;
            }catch(err){
                throw err
            }
        }
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
            var {tipeMesin, jenisMixer, bahanBaku, totalHasil, targetMixer, file, keterangan} = args;
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                
                var cekLaporan = await PembagianAnggota.findOne({
                    where: {idKaryawan: {[Op.eq]: user.userJWT.id}}
                })

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
                        id, jenisMixer, tipeMesin, idPelapor: user.userJWT.id, idKetua: 0 , totalMix: 0
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
                        id: counterIdULaporan, DLaporanMixerPipa: idDLaporan, namaBahan: element.namaBahan, totalBahan: element.totalBahan,
                        diHapus: false
                    },{transaction: t})
                }));
                if(file !== null){
                    const storeUpload = async ({ stream, filename, mimetype, encoding }) => {
                        cekLaporan = await FLaporanMixerPipa.count({
                            where: {
                                id: {[Op.startsWith]: idFLaporan},
                            }
                        })
                        counterId = idFLaporan + pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();
                        const { ext } = path.parse(filename);
                        var namaFile = counterId + ext;
                        const pathName = path.join(__dirname, `../../public/laporan/Mixer Pipa/${namaFile}`)
                    
                        return new Promise( (resolve, reject) =>
                            stream
                                .pipe(fs.createWriteStream(pathName))
                                .on("finish",async () => { 
                                    var foto = `http://localhost:4000/laporan/Mixer Pipa/${namaFile}`
                                    laporan = await FLaporanMixerPipa.create({
                                        id: counterId, DLaporanMixerPipaId: idDLaporan, foto
                                    },{transaction: t})
                                    resolve();
                                })
                                .on("error", reject)
                        );
                    };

                    const processUpload = async (upload) => {
                        const { createReadStream, filename, mimetype, encoding } = await upload;
                        const stream = createReadStream();
                        const file = await storeUpload({ stream, filename, mimetype, encoding });
                    };

                    await Promise.all(file.map(async element => {
                        const upload = await processUpload(element);
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
            var {id, bahanBaku, totalHasil, keterangan} = args;
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
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
                    status: 1, 
                    totalHasil,
                    keterangan,
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
                    await DLaporanMixerPipa.update({status: status},{
                        where: {id: {[Op.eq]: id}},
                        transaction: t
                    });
                    await HLaporanMixerPipa.update({idKetua: user.userJWT.id, pernahBanding: true, keteranganBanding: keteranganBanding},{
                        where: {id: {[Op.eq]: cekLaporan.HLaporanMixerPipaId}},
                        transaction: t
                    })
                }else{
                    var idHLaporan = cekLaporan.HLaporanMixerPipaId;
                    var totalHasil = cekLaporan.totalHasil;
                    cekLaporan = await HLaporanMixerPipa.findOne({
                        where: {
                            id: {[Op.eq]: idHLaporan}
                        }
                    })
                    await HLaporanMixerPipa.update({ idKetua: user.userJWT.id, totalMix: (cekLaporan.totalMix + totalHasil)},{
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