const { HLaporanQualityControlPipa, DLaporanQualityControlPipa, Karyawan, Jabatan, PembagianAnggota,
    ULaporanQualityControl, sequelize } = require('../../models');
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
        getLaporanMasterQualityControl:  async (_,args,{user}) =>{
            var {karyawan, orderBy, bulan, status, banding, page, limit} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans;
                var offset = page ? page * limit: 0;


                var orderKu =[];
                var whereHKu = [];
                if(bulan !== null){
                    if(bulan.toString() !== "Invalid Date"){
                        var date = new Date(bulan);
                        var y = date.getFullYear(), m = date.getMonth();
                        var firstDay = dayjs(new Date(y, m, 1)).format('YYYY-MM-DD');
                        var lastDay = dayjs(new Date(y, m + 1, 0)).format('YYYY-MM-DD');
                        whereHKu.push({
                            createdAt: {
                                [Op.between]: [firstDay, lastDay]
                            }
                        })
                    }
                }
                if(status !== 0){
                    whereHKu.push({
                        status: {[Op.eq]: status}
                    })
                }
                if(banding !== 0){
                    var pernahBanding = banding === 1? true: false;
                    whereHKu.push({
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
                laporans = await HLaporanQualityControlPipa.findAndCountAll({
                    include: [
                        {
                            model: Karyawan,
                            as: 'karyawan',
                        },
                        {
                            model: Karyawan,
                            as: 'ketua',
                        },
                    ],
                    limit: limit,
                    offset: offset,
                    order: orderKu,
                    where: whereHKu,
                });
                laporan.count = laporans.count
                await Promise.all(laporans.rows.map(async element =>
                    { 
                        cekLaporan = await DLaporanQualityControlPipa.count({
                            where: {
                                HLaporanQualityControlPipaId: {[Op.eq]: element.id},
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
        getSummaryQualityControlPipa: async (_,__,{user}) =>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                
                var date = new Date();
                var y = date.getFullYear(), m = date.getMonth();
                var firstDay = dayjs(new Date(y, m, 1)).format('YYYY-MM-DD');
                var lastDay = dayjs(new Date(y, m + 1, 0)).format('YYYY-MM-DD');
                var getKaryawan = await HLaporanQualityControlPipa.findAll({
                    attributes: [
                        'idPelapor',
                        [sequelize.fn('sum', sequelize.col('totalProduksi')), 'jumlahProduksi'],
                        [sequelize.fn('sum', sequelize.col('totalReject')), 'jumlahReject'],
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
                    cekProduksi = await DLaporanQualityControlPipa.count({
                        include: [{
                            model: HLaporanQualityControlPipa,
                            as: 'hLaporan',
                            attributes: [],
                            where: {
                                idPelapor: {[Op.eq]: element.idPelapor},
                                createdAt: {
                                    [Op.between]: [firstDay, lastDay]
                                }
                            }
                        }],
                        where: {
                            pernahBanding: {[Op.eq]: true}
                        }
                    })
                    element.jumlahBanding = cekProduksi;
                    element.jumlahProduksi = element.dataValues.jumlahProduksi;
                    element.tidakCapaiTarget = element.dataValues.jumlahReject;
                }))
                return getKaryawan;
            }catch(err){
                console.log(err);
                throw err
            }
        },
        getLaporansVerifikasiQualityControlPipa: async (_,args,{user}) =>{
            var {status,page, limit} = args;
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
                    if(cekLaporan === null){
                        return null;
                    }
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
                        laporans = await DLaporanQualityControlPipa.findAndCountAll({
                            include: [{
                                model: HLaporanQualityControlPipa,
                                as: 'hLaporan',
                                where: {idPelapor: {[Op.eq]: cekLaporan.idKaryawan}},
                                include:[{
                                    model: Karyawan, 
                                    as: 'karyawan'
                                }]
                            }],
                            limit: limit,
                            offset: offset,
                            order: [['createdAt','DESC'], ['jamLaporan','ASC']]
                        });
                    }else{
                        laporans = await DLaporanQualityControlPipa.findAndCountAll({
                            include: [{
                                model: HLaporanQualityControlPipa,
                                as: 'hLaporan',
                                where: {idPelapor: {[Op.eq]: cekLaporan.idKaryawan}},
                                include:[{
                                    model: Karyawan, 
                                    as: 'karyawan'
                                }]
                            }],
                            where: {status: {[Op.eq]: status}},
                            limit: limit,
                            offset: offset,
                            order: [['createdAt','DESC'], ['jamLaporan','ASC']]
                        });
                    }
                }else if(jabatan.tingkatJabatan === 4){
                    if(status === 0){
                        laporans = await DLaporanQualityControlPipa.findAndCountAll({
                            include: [{
                                model: HLaporanQualityControlPipa,
                                as: 'hLaporan',
                                include:[{
                                    model: Karyawan, 
                                    as: 'karyawan'
                                }]
                            }],
                            limit: limit,
                            offset: offset,
                            order: [['createdAt','DESC'], ['jamLaporan','ASC']]
                        });
                    }else{
                        laporans = await DLaporanQualityControlPipa.findAndCountAll({
                            include: [{
                                model: HLaporanQualityControlPipa,
                                as: 'hLaporan',
                                include:[{
                                    model: Karyawan, 
                                    as: 'karyawan'
                                }]
                            }],
                            where: {status: {[Op.eq]: status}},
                            limit: limit,
                            offset: offset,
                            order: [['createdAt','DESC'], ['jamLaporan','ASC']]
                        });
                    }
                }
                return laporans;
            }catch(err){
                console.log(err);
                throw err
            }
        },
        getHLaporansQualityControlPipa: async (_,args,{user}) =>{
            var {status, page, limit} = args
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans;
                var laporanBaru = [];
                page -= 1;
                var offset = page ? page * limit: 0;
                if(status === 0){
                    laporans = await HLaporanQualityControlPipa.findAndCountAll({
                        include: [{
                            model: Karyawan,
                            as: 'karyawan'
                        }],
                        limit: limit,
                        offset: offset,
                        order: [['createdAt','DESC']]
                    })
                }else{
                    laporans = await HLaporanQualityControlPipa.findAndCountAll({
                        include: [{
                            model: Karyawan,
                            as: 'karyawan'
                        }],
                        limit: limit,
                        offset: offset,
                        where: {status: {[Op.eq]: status}},
                        order: [['createdAt','DESC']]
                    })
                }
                return laporans;
            }catch(err){
                console.log(err);
                throw err
            }
        },
        getDLaporanQualityControlPipa: async (_,args,{user}) =>{
            var {HLaporanQualityControlPipaId} = args
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans = await DLaporanQualityControlPipa.findAll({
                    include:[{
                        model: ULaporanQualityControl,
                        as: 'uLaporan'
                    }],
                    where: {HLaporanQualityControlPipaId: {[Op.eq]: HLaporanQualityControlPipaId}},
                    order: [['jamLaporan', 'ASC'], ['uLaporan','namaBagian','ASC']]
                });
                return laporans;
            }catch(err){
                console.log(err)
                throw err
            }
        },
        getDetailLaporanQualityControlPipa: async (_,args,{user}) =>{
            var {id} = args
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans = await ULaporanQualityControl.findAll({
                    where: {DLaporanQualityControlPipaId: {[Op.eq]: id}},
                    order: [['namaBagian', 'ASC']]
                });
                return laporans;
            }catch(err){
                console.log(err)
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
        tambahLaporanQualityControlPipa: async (_,args, {user})=>{
            var {shift, merkPipa, ukuranPipa, jamLaporan, file, keterangan, diameter, panjang, berat, bagianKetebalan} = args;
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')

                //cek dia Ketua
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

                var tglLaporan = dayjs(new Date()).format('DD-MM-YYYY');
                var idPelapor = user.userJWT.id;
                var counterTgl = dayjs(new Date()).format('DDMMYYYY');
                var id = "H" + counterTgl;
                var idDLaporan = "D" + counterTgl;
                var idULaporan = "U" + counterTgl;
                var jamLaporanKu = jamLaporan;
                var status = 1;
                var keteranganBanding = "";
                var laporan = null;
                var pernahBanding = false;
                var cekLaporan = await HLaporanQualityControlPipa.findOne({
                    where: { 
                        id: {[Op.startsWith]: id},
                        shift: {[Op.eq]: shift},
                        merkPipa: {[Op.eq]: merkPipa},
                        ukuranPipa: {[Op.eq]: ukuranPipa},
                    }
                })
                if(cekLaporan === null){
                    cekLaporan = await HLaporanQualityControlPipa.count({
                        where: {
                            id: {[Op.startsWith]: id}
                        }
                    })
                    id += pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();
                    const hLaporan = await HLaporanQualityControlPipa.create({
                        id, shift, merkPipa, ukuranPipa, idPelapor, idKetua: 0, panjang: 0,
                        ketebalan: 0, diameterLuar: 0, diameterDalam: 0, totalReject: 0, totalProduksi: 0, 
                        status: 1
                    },{ transaction: t});
                }else{
                    id = cekLaporan.id;
                    var cekDLaporan = await DLaporanQualityControlPipa.findOne({
                        where: {
                            HLaporanQualityControlPipaId: {[Op.eq]: id},
                            jamLaporan: {[Op.eq]: jamLaporanKu}
                        }
                    })
                    if(cekDLaporan !== null){
                        throw new UserInputError('Tidak Bisa Menambah Laporan Lagi',  {errors: `Sudah Ada Laporan Masuk Untuk ${merkPipa} ${ukuranPipa} Untuk Waktu Ini ${tglLaporan} ${jamLaporanKu}`} )
                    }
                }
                var rataKetebalan = 0;
                await Promise.all(bagianKetebalan.map(async element => {
                    rataKetebalan += element.totalBahan;
                }));
                rataKetebalan = rataKetebalan / 8;
                
                cekLaporan = await DLaporanQualityControlPipa.count({
                    where: {
                        id: {[Op.startsWith]: idDLaporan}
                    }
                })
                idDLaporan += pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();

                if(file === null){
                    laporan = await DLaporanQualityControlPipa.create({
                        id: idDLaporan,HLaporanQualityControlPipaId: id, jamLaporan: jamLaporanKu, 
                        diameter, panjang, berat, ketebalan: rataKetebalan,keterangan, status, pernahBanding, keteranganBanding, foto: '-'
                    },{transaction: t});
                }else{
                    const { createReadStream, filename, mimetype, encoding } = await file;

                    const { ext } = path.parse(filename);
                    var namaFile = idDLaporan + ext;

                    const storeUpload = async ({ stream, filename, mimetype, encoding }) => {
                        const pathName = path.join(__dirname, `../../public/laporan/Quality Control Pipa/${namaFile}`)
                    
                        return new Promise( (resolve, reject) =>
                            stream
                                .pipe(fs.createWriteStream(pathName))
                                .on("finish",async () => { 
                                    var foto = `http://localhost:4000/laporan/Quality Control Pipa/${namaFile}`
                                    laporan = await DLaporanQualityControlPipa.create({
                                        id: idDLaporan,HLaporanQualityControlPipaId: id, jamLaporan: jamLaporanKu, 
                                        diameter, panjang, berat, ketebalan: rataKetebalan, keterangan, status, pernahBanding, keteranganBanding, foto
                                    },{transaction: t});
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

                    const upload = await processUpload(file);
                }
                cekLaporan = await ULaporanQualityControl.count({
                    where: {
                        id: {[Op.startsWith]: idULaporan}
                    }
                })
                var counterId = cekLaporan;
                var counterIdULaporan;
                await Promise.all(bagianKetebalan.map(async element => {
                    counterId = counterId + 1;
                    counterIdULaporan = idULaporan + pad.substring(0, pad.length - counterId.toString().length) + counterId.toString();
                    await ULaporanQualityControl.create({
                        id: counterIdULaporan, DLaporanQualityControlPipaId: idDLaporan, namaBagian: element.namaBahan, nilai: element.totalBahan
                    },{transaction: t})
                }));
                await t.commit();
                return laporan;
            }catch(err){
                console.log(err)
                await t.rollback();
                throw err
            }
        },
        updateStatusLaporanQualityControlPipa: async (_,args,{user})=>{
            var {id, status, keteranganBanding} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans = await DLaporanQualityControlPipa.findOne({
                    where: {id: {[Op.eq]: id}}
                })
                var idHLaporan = laporans.HLaporanQualityControlPipaId;
                if(status === 3){
                    await HLaporanQualityControlPipa.update({idKetua: user.userJWT.id},{
                        where: {id: {[Op.eq]: idHLaporan}}
                    })
                    return await DLaporanQualityControlPipa.update({status: status, pernahBanding: true, keteranganBanding: keteranganBanding},{
                        where: {id: {[Op.eq]: id}}
                    });
                }else{
                    laporans = await DLaporanQualityControlPipa.findAll({
                        where: {HLaporanQualityControlPipaId: {[Op.eq]: idHLaporan}}
                    })
                    var rataKetebalan = 0;
                    var counter = 0;
                    await Promise.all(laporans.map(async element => {
                        if(element.status === 2){
                            counter += 1;
                            rataKetebalan = rataKetebalan + element.ketebalan; 
                        }else if(element.id === id){
                            counter += 1;
                            rataKetebalan = rataKetebalan + element.ketebalan; 
                        }
                    }))
                    rataKetebalan = rataKetebalan / counter;
                    await HLaporanQualityControlPipa.update({idKetua: user.userJWT.id, ketebalan: rataKetebalan},{
                        where: {id: {[Op.eq]: idHLaporan}}
                    })
                    return await DLaporanQualityControlPipa.update({status: status},{
                        where: {id: {[Op.eq]: id}}
                    });
                }
            }catch(err){
                throw err
            }
        },
        updateDLaporanQualityControlPipa: async (_,args,{user})=>{
            var {id, diameter, panjang, berat, keterangan, bagianKetebalan} = args;
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                
                var laporans = await DLaporanQualityControlPipa.findOne({
                    where: {
                        id: {[Op.eq]: id}
                    }
                })
                var cekLaporan = await HLaporanQualityControlPipa.findOne({
                    where: {
                        id: {[Op.eq]: laporans.HLaporanQualityControlPipaId},
                        idPelapor: {[Op.eq]: user.userJWT.id}
                    }
                })
                if(cekLaporan === null){
                    throw new UserInputError('Error',  {errors: `Akun Anda Tidak Memiliki Hak Untuk Laporan Ini`} )
                }
                var rataKetebalan = 0;
                await Promise.all(bagianKetebalan.map( async element => {
                    rataKetebalan += element.totalBahan;
                    await ULaporanQualityControl.update({
                        namaBagian: element.namaBahan,
                        nilai: element.totalBahan,
                    },{
                        where: {id: {[Op.eq]: element.id}},
                        transaction: t
                    })
                }))
                rataKetebalan = rataKetebalan / 8;
                var laporan = await DLaporanQualityControlPipa.update({diameter: diameter, panjang: panjang
                    , berat: berat, ketebalan: rataKetebalan, keterangan: keterangan, status: 1},{
                    where: {id: {[Op.eq]: id}}
                })

                t.commit()
                return laporan;
            }catch(err){
                console.log(err)
                t.rollback()
                throw err
            }
        },
        updateHLaporanQualityControlPipa: async (_,args,{user})=>{
            var {id, panjang, diameterLuar, diameterDalam, totalReject, totalProduksi} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')

                var cekLaporan = await HLaporanQualityControlPipa.findOne({
                    where: {
                        id: {[Op.eq]: id},
                        idPelapor: {[Op.eq]: user.userJWT.id}
                    }
                })
                if(cekLaporan === null){
                    throw new UserInputError('Error',  {errors: `Akun Anda Tidak Memiliki Hak Untuk Laporan Ini`} )
                }

                return await HLaporanQualityControlPipa.update({ diameterLuar: diameterLuar, 
                    diameterDalam: diameterDalam, panjang: panjang,  
                    status: 2, totalReject: totalReject, totalProduksi: totalProduksi},{
                    where: {id: {[Op.eq]: id}}
                });
            }catch(err){
                throw err
            }
        },
        //Direktur

        //Staf Keuangan

        //Ketua Divisi

        //Anggota Divisi

    }
}