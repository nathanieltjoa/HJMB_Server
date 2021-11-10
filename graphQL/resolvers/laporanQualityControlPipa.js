const { HLaporanQualityControlPipa, DLaporanQualityControlPipa, Karyawan, Jabatan, PembagianAnggota,sequelize } = require('../../models');
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
                            as: 'hLaporanQC',
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
                    element.tidakCapaiTarget = element.dataValues.totalReject;
                }))
                return getKaryawan;
            }catch(err){
                throw err
            }
        },
        getLaporansVerifikasiQualityControlPipa: async (_,args,{user}) =>{
            var {status,page, limit} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans;
                var laporanBaru = [];
                var laporan = {};
                var cekKaryawan;
                var namaKaryawan;
                page -= 1;
                var offset = page ? page * limit: 0;
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
                        laporans = await DLaporanQualityControlPipa.findAndCountAll({
                            include: [{
                                model: HLaporanQualityControlPipa,
                                as: 'hLaporanQC',
                                where: {idPelapor: {[Op.eq]: cekLaporan.idKaryawan}}
                            }],
                            limit: limit,
                            offset: offset,
                            order: [['createdAt','DESC'], ['jamLaporan','ASC']]
                        });
                    }else{
                        laporans = await DLaporanQualityControlPipa.findAndCountAll({
                            include: [{
                                model: HLaporanQualityControlPipa,
                                as: 'hLaporanQC',
                                where: {idPelapor: {[Op.eq]: cekLaporan.idKaryawan}}
                            }],
                            where: {status: {[Op.eq]: status}},
                            limit: limit,
                            offset: offset,
                            order: [['createdAt','DESC'], ['jamLaporan','ASC']]
                        });
                    }
                    laporan.count = laporans.count;
                    await Promise.all(laporans.rows.map(async element =>
                    { 
                        counterHLaporan = await HLaporanQualityControlPipa.findOne({
                            where: {id: {[Op.eq]: element.HLaporanQualityControlPipaId}}
                        })
                        namaKaryawan = "-";
                        if(counterHLaporan.idKetua !== 0){
                            cekKaryawan = await Karyawan.findOne({
                                where: {id: {[Op.eq]: counterHLaporan.idKetua}}
                            })
                            namaKaryawan = cekKaryawan.nama;
                        }
                        element.namaPelapor = namaKaryawan;
                        element.shift = counterHLaporan.shift;
                        element.tipeMesin = counterHLaporan.tipeMesin
                        laporanBaru.push(element);
                    }))
                }else if(jabatan.tingkatJabatan === 4){
                    if(status === 0){
                        laporans = await DLaporanQualityControlPipa.findAndCountAll({
                            limit: limit,
                            offset: offset,
                            order: [['createdAt','DESC'], ['jamLaporan','ASC']]
                        });
                    }else{
                        laporans = await DLaporanQualityControlPipa.findAndCountAll({
                            where: {status: {[Op.eq]: status}},
                            limit: limit,
                            offset: offset,
                            order: [['createdAt','DESC'], ['jamLaporan','ASC']]
                        });
                    }
                    laporan.count = laporans.count;
                    await Promise.all(laporans.rows.map(async (element) =>
                    { 
                        counterHLaporan = await HLaporanQualityControlPipa.findOne({
                            where: {id: {[Op.eq]: element.HLaporanQualityControlPipaId}}
                        })
                        cekKaryawan = await Karyawan.findOne({
                            where: {id: {[Op.eq]: counterHLaporan.idPelapor}}
                        })
                        namaKaryawan = cekKaryawan.nama;
                        element.namaPelapor = namaKaryawan;
                        element.shift = counterHLaporan.shift;
                        element.tipeMesin = counterHLaporan.tipeMesin
                        laporanBaru.push(element);
                    }))
                }
                laporan.rows = laporanBaru;
                return laporan;
            }catch(err){
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
                        limit: limit,
                        offset: offset,
                        order: [['createdAt','DESC']]
                    })
                }else{
                    laporans = await HLaporanQualityControlPipa.findAndCountAll({
                        limit: limit,
                        offset: offset,
                        where: {status: {[Op.eq]: status}},
                        order: [['createdAt','DESC']]
                    })
                }
                var laporan = {};
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
                laporan.rows = laporanBaru;
                return laporan;
            }catch(err){
                throw err
            }
        },
        getDLaporanQualityControlPipa: async (_,args,{user}) =>{
            var {HLaporanQualityControlPipaId} = args
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans = await DLaporanQualityControlPipa.findAll({
                    where: {HLaporanQualityControlPipaId: {[Op.eq]: HLaporanQualityControlPipaId}},
                    order: [['jamLaporan', 'ASC']]
                });
                return laporans;
            }catch(err){
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
            var {shift, tipeMesin, jamLaporan, file, keterangan, diameter, panjang, berat} = args;
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')

                //cek dia Ketua
                var cekLaporan = await PembagianAnggota.findOne({
                    where: {idKaryawan: {[Op.eq]: user.userJWT.id}}
                })

                if(cekLaporan.ketua === false){
                    throw new UserInputError('Error',  {errors: `Akun Anda Tidak Memiliki Hak Untuk Buat Laporan`} )
                }
                var pad = "000"

                var tglLaporan = dayjs(new Date()).format('DD-MM-YYYY');
                var idPelapor = user.userJWT.id;
                var counterTgl = dayjs(new Date()).format('DDMMYYYY');
                var id = "H" + counterTgl;
                var idDLaporan = "D" + counterTgl;
                console.log("Sebelum: ")
                console.log(jamLaporan)
                jamLaporan = jamLaporan.slice(0,19);
                var jamLaporanKu = dayjs(jamLaporan).format('HH:mm')
                console.log("Sesudah: ");
                console.log(jamLaporanKu);
                var status = 1;
                var keteranganBanding = "";
                var laporan = null;
                var pernahBanding = false;
                var cekLaporan = await HLaporanQualityControlPipa.findOne({
                    where: { 
                        id: {[Op.startsWith]: id},
                        shift: {[Op.eq]: shift},
                        tipeMesin: {[Op.eq]: tipeMesin},
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
                        id, shift, tipeMesin, idPelapor, idKetua: 0, tglLaporan, merk: "", panjang: 0,
                        ketebalan: 0, diameterLuar: 0, diameterDalam: 0, totalReject: 0, totalProduksi: 0, 
                        status: 1
                    },{ transaction: t});
                }else{
                    id = cekLaporan.id;
                    var cekDLaporan = await DLaporanQualityControlPipa.findOne({
                        where: {
                            jamLaporan: {[Op.eq]: jamLaporanKu}
                        }
                    })
                    if(cekDLaporan !== null){
                        throw new UserInputError('Tidak Bisa Menambah Laporan Lagi',  {errors: `Sudah Ada Laporan Masuk Untuk ${tipeMesin} Untuk Waktu Ini ${tglLaporan} ${jamLaporanKu}`} )
                    }
                }

                
                cekLaporan = await DLaporanQualityControlPipa.count({
                    where: {
                        id: {[Op.startsWith]: idDLaporan}
                    }
                })
                idDLaporan += pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();

                if(file === null){
                    laporan = await DLaporanQualityControlPipa.create({
                        id: idDLaporan,HLaporanQualityControlPipaId: id, jamLaporan: jamLaporanKu, 
                        diameter, panjang, berat, keterangan, status, pernahBanding, keteranganBanding, foto: '-'
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
                                        diameter, panjang, berat, keterangan, status, pernahBanding, keteranganBanding, foto
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
                await t.commit();
                return laporan;
            }catch(err){
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
                await HLaporanQualityControlPipa.update({idKetua: user.userJWT.id},{
                    where: {id: {[Op.eq]: laporans.HLaporanQualityControlPipaId}}
                })
                if(status === 3){
                    return await DLaporanQualityControlPipa.update({status: status, pernahBanding: true, keteranganBanding: keteranganBanding},{
                        where: {id: {[Op.eq]: id}}
                    });
                }else{
                    return await DLaporanQualityControlPipa.update({status: status},{
                        where: {id: {[Op.eq]: id}}
                    });
                }
            }catch(err){
                throw err
            }
        },
        updateDLaporanQualityControlPipa: async (_,args,{user})=>{
            var {id, diameter, panjang, berat, keterangan} = args;
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

                return await DLaporanQualityControlPipa.update({diameter: diameter, panjang: panjang
                    , berat: berat, keterangan: keterangan, status: 1},{
                    where: {id: {[Op.eq]: id}}
                });
            }catch(err){
                throw err
            }
        },
        updateHLaporanQualityControlPipa: async (_,args,{user})=>{
            var {id, merk, ketebalan, panjang, diameterLuar, diameterDalam, totalReject, totalProduksi} = args;
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

                return await HLaporanQualityControlPipa.update({merk: merk, ketebalan: ketebalan, 
                    diameterLuar: diameterLuar, diameterDalam: diameterDalam, panjang: panjang,  
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