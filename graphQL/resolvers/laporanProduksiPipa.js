const { DLaporanProduksiPipa, HLaporanProduksiPipa, Karyawan, Jabatan,
    ULaporanProduksiPipa, PembagianAnggota, sequelize } = require('../../models');
const {Op} = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { UserInputError, AuthenticationError} = require('apollo-server-express');
const {JWT_SECRET} = require('../../config/env.json')
const dayjs = require('dayjs');
const Sequelize = require('sequelize');
const path = require('path');
const fs = require('fs');
const { count } = require('console');
const { off } = require('process');

module.exports={
    Query: {
        //general
        getLaporanMasterProduksiPipa: async (_,args,{user}) =>{
            var {karyawan, orderBy, bulan, status, banding, page, limit} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans;
                var offset = page ? page * limit: 0;


                var orderKu =[];
                var whereHKu = [];
                var whereDKu = [];
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
                    whereHKu={
                        idPelapor: {[Op.eq]: cekLaporan.idKaryawan}
                    }
                }
                laporans = await HLaporanProduksiPipa.findAndCountAll({
                    include: [
                        {
                            model: DLaporanProduksiPipa,
                            as: 'dLaporan',
                            where: whereDKu
                        },
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
                    where: whereHKu
                });
                return laporans;
            }catch(err){
                throw err
            }
        },
        getSummaryProduksiPipa: async (_,__,{user}) =>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                
                var date = new Date();
                var y = date.getFullYear(), m = date.getMonth();
                var firstDay = dayjs(new Date(y, m, 1)).format('YYYY-MM-DD');
                var lastDay = dayjs(new Date(y, m + 1, 0)).format('YYYY-MM-DD');
                var getKaryawan = await HLaporanProduksiPipa.findAll({
                    attributes: [
                        'idPelapor',
                        [sequelize.fn('sum', sequelize.col('hasilProduksi')), 'jumlahProduksi'],
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
                    cekProduksi = await DLaporanProduksiPipa.count({
                        include: [{
                            model: HLaporanProduksiPipa,
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
                    cekProduksi = await DLaporanProduksiPipa.count({
                        include: [{
                            model: HLaporanProduksiPipa,
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
                            totalProduksi: {[Op.lt]: sequelize.col('targetProduksi')}
                        }
                    })
                    element.tidakCapaiTarget = cekProduksi;
                }))
                return getKaryawan;
            }catch(err){
                throw err
            }
        },
        getLaporansVerifikasiProduksiPipa: async (_,args,{user}) =>{
            var {status, page, limit} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans;
                var laporanBaru = [];
                var cekKaryawan;
                var namaKaryawan;
                var laporan = {};
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
                        laporans = await DLaporanProduksiPipa.findAndCountAll({
                            include: [{
                                model: HLaporanProduksiPipa,
                                as: 'hLaporan',
                                where: {idPelapor: {[Op.eq]: cekLaporan.idKaryawan}}
                            }],
                            limit: limit,
                            offset: offset,
                            order: [['createdAt','DESC']]
                        });
                    }else{
                        laporans = await DLaporanProduksiPipa.findAndCountAll({
                            where: {status: {[Op.eq]: status}}
                            , include: [{
                                model: HLaporanProduksiPipa,
                                as: 'hLaporan',
                                where: {idPelapor: {[Op.eq]: cekLaporan.idKaryawan}}
                            }],
                            limit: limit,
                            offset: offset,
                            order: [['createdAt','DESC']]
                        });
                    }
                    laporan.count = laporans.count;
                    await Promise.all(laporans.rows.map(async element =>
                    { 
                        counterHLaporan = await HLaporanProduksiPipa.findOne({
                            where: {id: {[Op.eq]: element.HLaporanProduksiPipaId}}
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
                        laporans = await DLaporanProduksiPipa.findAndCountAll({
                            limit: limit,
                            offset: offset,
                            order: [['createdAt','DESC']]
                        });
                    }else{
                        laporans = await DLaporanProduksiPipa.findAndCountAll({
                            where: {status: {[Op.eq]: status}},
                            limit: limit,
                            offset: offset,
                            order: [['createdAt','DESC']]
                        });
                    }
                    laporan.count = laporans.count;
                    await Promise.all(laporans.rows.map(async (element) =>
                    { 
                        counterHLaporan = await HLaporanProduksiPipa.findOne({
                            where: {id: {[Op.eq]: element.HLaporanProduksiPipaId}}
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
        getULaporanProduksiPipa: async (_,args,{user}) =>{
            var {idDLaporan} = args
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans;
                laporans = await ULaporanProduksiPipa.findAll({
                    where: {DLaporanProduksiPipaId: {[Op.eq]: idDLaporan}},
                    attributes: ['id','namaUraian', 'nilaiUraian']
                })
                return laporans;
            }catch(err){
                throw err
            }
        },
        getHLaporansProduksiPipa: async (_,args,{user}) =>{
            var {status, page, limit} = args
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans;
                var laporanBaru = [];
                page -= 1;
                var offset = page ? page * limit: 0;
                if(status === 0){
                    laporans = await HLaporanProduksiPipa.findAndCountAll({
                        limit: limit,
                        offset: offset,
                        order: [['createdAt','DESC']]
                    })
                }else{
                    laporans = await HLaporanProduksiPipa.findAndCountAll({
                        where: {status: {[Op.eq]: status}},
                        limit: limit,
                        offset: offset,
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
                return laporans;
            }catch(err){
                throw err
            }
        },
        getDLaporanProduksiPipa: async (_,args,{user}) =>{
            var {HLaporanProduksiPipaId} = args
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans = await DLaporanProduksiPipa.findAll({
                    include: [{
                        model: ULaporanProduksiPipa,
                        as: 'uLaporan',
                    }],
                    where: {HLaporanProduksiPipaId: {[Op.eq]: HLaporanProduksiPipaId}},
                    order: [['jamLaporan', 'ASC']]
                });
                return laporans;
            }catch(err){
                throw err
            }
        },
      },
    Mutation: {
        tambahLaporanProduksiPipa: async (_,args, {user})=>{
            var { shift, jenisPipa, tipeMesin, jamLaporan, targetProduksi, file, keterangan, totalProduksi, uraian } = args;
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                console.log('masuk');
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
                var idULaporan = "U" + counterTgl;
                var jamLaporanKu = jamLaporan;
                console.log("Sesudah: ");
                console.log(jamLaporanKu);
                var status = 1;
                var keteranganBanding = "";
                var laporan = null;
                var pernahBanding = false;
                cekLaporan = await HLaporanProduksiPipa.findOne({
                    where: { 
                        id: {[Op.startsWith]: id},
                        shift: {[Op.eq]: shift},
                        tipeMesin: {[Op.eq]: tipeMesin},
                        jenisPipa: {[Op.eq]: jenisPipa},
                    }
                })
                if(cekLaporan === null){
                    cekLaporan = await HLaporanProduksiPipa.count({
                        where: {
                            id: {[Op.startsWith]: id}
                        }
                    })
                    id += pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();
                    const hLaporan = await HLaporanProduksiPipa.create({
                        id, shift, jenisPipa, tipeMesin, warna: "", ukuran: 0, idPelapor, idKetua: 0, dis : 0, pin : 0, 
                        hasilProduksi : 0, jumlahBahan : 0, BS : 0, totalBahan : 0, status
                    },{ transaction: t});
                }else{
                    id = cekLaporan.id;
                    var cekDLaporan = await DLaporanProduksiPipa.findOne({
                        where: {
                            jamLaporan: {[Op.eq]: jamLaporanKu},
                            HLaporanProduksiPipaId: {[Op.eq]: id},
                        }
                    })
                    if(cekDLaporan !== null){
                        throw new UserInputError('Tidak Bisa Menambah Laporan Lagi',  {errors: `Sudah Ada Laporan Masuk Untuk ${tipeMesin} Untuk Waktu Ini ${tglLaporan} ${jamLaporanKu}`} )
                    }
                    var counterHasil = parseInt(cekLaporan.hasilProduksi) + totalProduksi;
                    await HLaporanProduksiPipa.update({hasilProduksi: counterHasil},{
                        where: {id: {[Op.eq]: id}},
                        transaction: t
                    })
                }

                cekLaporan = await DLaporanProduksiPipa.count({
                    where: {
                        id: {[Op.startsWith]: idDLaporan}
                    }
                })
                idDLaporan += pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();

                if(file === null){
                    laporan = await DLaporanProduksiPipa.create({
                        id: idDLaporan,HLaporanProduksiPipaId: id, totalProduksi,targetProduksi, foto: '-', status, pernahBanding, 
                        keteranganBanding, jamLaporan: jamLaporanKu, keterangan
                    },{transaction: t});
                }else{
                    const { createReadStream, filename, mimetype, encoding } = await file;

                    const { ext } = path.parse(filename);
                    var namaFile = idDLaporan + ext;

                    const storeUpload = async ({ stream, filename, mimetype, encoding }) => {
                        const pathName = path.join(__dirname, `../../public/laporan/Produksi Pipa/${namaFile}`)
                    
                        return new Promise( (resolve, reject) =>
                            stream
                                .pipe(fs.createWriteStream(pathName))
                                .on("finish",async () => { 
                                    var foto = `http://localhost:4000/laporan/Produksi Pipa/${namaFile}`
                                    laporan = await DLaporanProduksiPipa.create({
                                        id: idDLaporan,HLaporanProduksiPipaId: id, totalProduksi,targetProduksi, foto, status, pernahBanding, 
                                        keteranganBanding, jamLaporan: jamLaporanKu, keterangan
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
                
                cekLaporan = await ULaporanProduksiPipa.count({
                    where: {
                        id: {[Op.startsWith]: idULaporan}
                    }
                })
                var counterId = cekLaporan;
                var counterIdULaporan;
                await Promise.all(uraian.map(async element => {
                    counterId = counterId + 1;
                    counterIdULaporan = idULaporan + pad.substring(0, pad.length - counterId.toString().length) + counterId.toString();
                    await ULaporanProduksiPipa.create({
                        id: counterIdULaporan, DLaporanProduksiPipaId: idDLaporan, namaUraian: element.namaUraian, nilaiUraian: element.nilaiUraian
                    },{transaction: t})
                }));
                await t.commit();
                return laporan;
            }catch(err){
                await t.rollback();
                throw err
            }
        },
        updateStatusLaporanProduksiPipa: async (_,args,{user})=>{
            var {id, status, keteranganBanding} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans = await DLaporanProduksiPipa.findOne({
                    where: {id: {[Op.eq]: id}}
                })
                var hLaporan = await HLaporanProduksiPipa.findOne({
                    where: {id: {[Op.eq]: laporans.HLaporanProduksiPipaId}}
                })
                if(status === 3){
                    await HLaporanProduksiPipa.update({idKetua: user.userJWT.id},{
                        where: {id: {[Op.eq]: laporans.HLaporanProduksiPipaId}}
                    })
                    return await DLaporanProduksiPipa.update({status: status, pernahBanding: true, keteranganBanding: keteranganBanding},{
                        where: {id: {[Op.eq]: id}}
                    });
                }else{
                    await HLaporanProduksiPipa.update({idKetua: user.userJWT.id, hasilProduksi: hLaporan.hasilProduksi + laporans.totalProduksi},{
                        where: {id: {[Op.eq]: laporans.HLaporanProduksiPipaId}}
                    })
                    return await DLaporanProduksiPipa.update({status: status},{
                        where: {id: {[Op.eq]: id}}
                    });
                }
            }catch(err){
                console.log(err);
                throw err
            }
        },
        updateULaporanProduksiPipa: async (_,args,{user})=>{
            var {id, totalProduksi, uLaporan, keterangan} = args;
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans = await DLaporanProduksiPipa.findOne({
                    where: {
                        id: {[Op.eq]: id}
                    }
                })
                var cekLaporan = await HLaporanProduksiPipa.findOne({
                    where: {
                        id: {[Op.eq]: laporans.HLaporanProduksiPipaId},
                        idPelapor: {[Op.eq]: user.userJWT.id}
                    }
                })
                if(cekLaporan === null){
                    throw new UserInputError('Error',  {errors: `Akun Anda Tidak Memiliki Hak Untuk Laporan Ini`} )
                }
                await Promise.all(uLaporan.map(async element => {
                    await ULaporanProduksiPipa.update({nilaiUraian: element.nilaiUraian},{
                        where: {id: {[Op.eq]: element.id}},
                        transaction: t
                    })
                }))
                laporans = await DLaporanProduksiPipa.update({totalProduksi: totalProduksi, status: 1, keterangan: keterangan},{
                    where: {id: {[Op.eq]: id}},
                    transaction: t
                })
                t.commit()
                return laporans;
            }catch(err){
                t.rollback()
                throw err
            }
        },
        updateHLaporanProduksiPipa: async (_,args,{user})=>{
            var {id, warna, ukuran, dis, pin, jumlahBahan, BS, totalBahan} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                
                var cekLaporan = await HLaporanProduksiPipa.findOne({
                    where: {
                        id: {[Op.eq]: id},
                        idPelapor: {[Op.eq]: user.userJWT.id}
                    }
                })
                if(cekLaporan === null){
                    throw new UserInputError('Error',  {errors: `Akun Anda Tidak Memiliki Hak Untuk Laporan Ini`} )
                }

                var laporans = await HLaporanProduksiPipa.update({warna: warna, ukuran: ukuran, dis: dis, pin: pin, 
                    jumlahBahan: jumlahBahan, BS: BS, totalBahan: totalBahan, status: 2
                },{
                    where: {id: {[Op.eq]: id}}
                });
                return laporans;
            }catch(err){
                throw err
            }
        }
    }
}