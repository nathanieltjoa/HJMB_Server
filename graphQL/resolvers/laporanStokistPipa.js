const {HLaporanStokistPipa, DLaporanStokistPipa, HLaporanKetuaStokistPipa, DLaporanKetuaStokistPipa, 
    LaporanStok, LaporanKeluarMasukPipa, Karyawan, Jabatan, sequelize } = require('../../models');
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
        getLaporanMasterStokistPipa: async (_,args,{user}) =>{
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
                laporans = await HLaporanStokistPipa.findAndCountAll({
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
                    where: whereHKu
                });
                laporan.count = laporans.count
                await Promise.all(laporans.rows.map(async element =>
                    { 
                        cekLaporan = await DLaporanStokistPipa.findOne({
                            attributes: [
                                [sequelize.fn('sum', sequelize.col('totalBaik')), 'jumlahBaik'],
                                [sequelize.fn('sum', sequelize.col('totalBS')), 'jumlahBS'],
                              ]
                            ,where: {
                                HLaporanStokistPipaId: {[Op.eq]: element.id},
                            },
                            group: ['id']
                        })
                        element.jumlahBaik = cekLaporan.dataValues.jumlahBaik;
                        element.jumlahBS = cekLaporan.dataValues.jumlahBS;
                        laporanBaru.push(element);
                    }))
                laporan.rows = laporanBaru;
                return laporan;
            }catch(err){
                throw err
            }
        },
        getSummaryStokistPipa: async (_,__,{user}) =>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                
                var date = new Date();
                var y = date.getFullYear(), m = date.getMonth();
                var firstDay = dayjs(new Date(y, m, 1)).format('YYYY-MM-DD');
                var lastDay = dayjs(new Date(y, m + 1, 0)).format('YYYY-MM-DD');
                var getKaryawan = await HLaporanStokistPipa.findAll({
                    attributes: [
                        'idPelapor',
                        [sequelize.fn('count', sequelize.col('pernahBanding')), 'jumlahBanding'],
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
                    group: ['idPelapor']
                })
                await Promise.all(getKaryawan.map(async element => {
                    element.jumlahBanding = element.dataValues.jumlahBanding;
                }))
                return getKaryawan;
            }catch(err){
                throw err
            }
        },
        getLaporansVerifikasiStokistPipa: async (_,args,{user}) =>{
            var {status, page, limit} = args;
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
                        laporans = await HLaporanStokistPipa.findAndCountAll({
                            where: {
                                idPelapor: {[Op.eq]: cekLaporan.idKaryawan},
                            },
                            limit: limit
                            ,offset: offset
                            ,order: [['createdAt','DESC']]
                        });
                    }else{
                        laporans = await HLaporanStokistPipa.findAndCountAll({
                            where: {
                                idPelapor: {[Op.eq]: cekLaporan.idKaryawan},
                                status: {[Op.eq]: status}
                            },
                            limit: limit
                            ,offset: offset
                            ,order: [['createdAt','DESC']]
                        });
                    }
                    laporan.count = laporans.count;
                    await Promise.all(laporans.rows.map(async element =>
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
                        laporans = await HLaporanStokistPipa.findAndCountAll({
                            limit: limit
                            ,offset: offset
                            ,order: [['createdAt','DESC']]
                        });
                    }else{
                        laporans = await HLaporanStokistPipa.findAndCountAll({
                            where: {status: {[Op.eq]: status}},
                            limit: limit
                            ,offset: offset
                            ,order: [['createdAt','DESC']]
                        });
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
                return laporan;
            }catch(err){
                throw err
            }
        },
        getDLaporanStokistPipa: async (_,args,{user}) =>{
            var {id} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                return await DLaporanStokistPipa.findAll({
                    where: {HLaporanStokistPipaId: {[Op.eq]: id}},
                    include: [{
                        model: LaporanStok,
                        as: 'laporanStokStokistPipa',
                    }],
                });
            }catch(err){
                throw err
            }
        },
        getLaporanMasukStokistPipa: async (_,args,{user}) =>{
            var {jenisLaporan, page, limit} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans;
                page -= 1;
                var offset = page ? page * limit: 0;
                if(jenisLaporan === "0"){
                    laporans = await LaporanKeluarMasukPipa.findAndCountAll({
                        include: [{
                            model: LaporanStok,
                            as: 'laporanStokKeluarMasukPipa',
                        }]
                        ,limit: limit
                        ,offset: offset
                        ,order: [['createdAt','DESC']]
                    });
                }else{
                    laporans = await LaporanKeluarMasukPipa.findAndCountAll({
                        where: {jenisLaporan: {[Op.eq]: jenisLaporan}},
                        include: [{
                            model: LaporanStok,
                            as: 'laporanStokKeluarMasukPipa',
                        }]
                        ,limit: limit
                        ,offset: offset
                        ,order: [['createdAt','DESC']]
                    });
                }
                return laporans;
            }catch(err){
                throw err
            }
        },
        getStokBarang: async (_,args,{user}) =>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                return await LaporanStok.findAll({
                    where: {status: {[Op.eq]: 0}}
                });
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
        tambahLaporanAnggotaStokistPipa: async (_,args, {user})=>{
            var {shift, stokistPipa, file, keterangan} = args;
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var pad = "000"


                var tgl = new Date();
                var tglLaporan = dayjs(tgl).format('DDMMYYYY');
                var counterTgl = dayjs(tgl).format('YYYY-MM-DD')
                var idPelapor = user.userJWT.id;
                var id = "H" + tglLaporan;
                var baseId = id;
                var idDLaporan = "D" + tglLaporan;
                var idKetua = 0;
                var status = 1;
                var keteranganBanding = "";
                var laporan = null;
                var pernahBanding = false;
                var diHapus = false;

                
                cekLaporan = await HLaporanStokistPipa.count({
                    where: {
                        id: {[Op.startsWith]: id}
                    }
                })
                id += pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();

                if(file === null){
                    var cekLaporan = await HLaporanStokistPipa.findOne({
                        where: { 
                            id: {[Op.startsWith]: baseId},
                            shift: {[Op.eq]: shift}
                        }
                    })
                    if(cekLaporan === null) {
                        const hLaporan = await HLaporanStokistPipa.create({
                            id, idPelapor, idKetua, shift, foto: "-", keterangan, status, 
                            pernahBanding, keteranganBanding
                        },{ transaction: t});
                    }else{
                        id = cekLaporan.id;
                    }
                    cekLaporan = await DLaporanStokistPipa.count({
                        where: {
                            id: {[Op.startsWith]: idDLaporan}
                        }
                    })
                    var counterId = cekLaporan;
                    var counterIdDLaporan;
                    await Promise.all(stokistPipa.map(async element => {
                        cekLaporan = await LaporanStok.findOne({
                            where: {
                                jenisBarang: {[Op.eq]: "Pipa"},
                                merkBarang: {[Op.eq]: element.merkPipa},
                                tipeBarang: {[Op.eq]: element.jenisPipa},
                                ukuranBarang: {[Op.eq]: element.ukuranPipa},
                            }
                        })
                        if(cekLaporan === null){
                            cekLaporan = await LaporanStok.create({
                                jenisBarang: 'Pipa', merkBarang: element.merkPipa, 
                                tipeBarang: element.jenisPipa, ukuranBarang: element.ukuranPipa
                                , satuanBarang: "Batang", jumlahBarang: 0, status: 0
                            },{transaction: t})
                        }
                        counterId = counterId + 1;
                        counterIdDLaporan = idDLaporan + pad.substring(0, pad.length - counterId.toString().length) + counterId.toString();
                        await DLaporanStokistPipa.create({
                            id: counterIdDLaporan, HLaporanStokistPipaId: id, LaporanStokId: cekLaporan.id 
                            ,jumlahPipa: element.jumlahPipa, diHapus, panjangPipa: 0, beratPipa: 0,
                            totalBaik: 0, totalBS: 0
                        },{transaction: t})
                    }));
                }else{
                    const { createReadStream, filename, mimetype, encoding } = await file;

                    const { ext } = path.parse(filename);
                    var namaFile = id + ext;

                    const storeUpload = async ({ stream, filename, mimetype, encoding }) => {
                        const pathName = path.join(__dirname, `../../public/laporan/Stokist Pipa/${namaFile}`)
                    
                        return new Promise( (resolve, reject) =>
                            stream
                                .pipe(fs.createWriteStream(pathName))
                                .on("finish",async () => {
                                    var foto = `http://localhost:4000/laporan/Stokist Pipa/${namaFile}`
                                    var cekLaporan = await HLaporanStokistPipa.findOne({
                                        where: { 
                                            id: {[Op.startsWith]: baseId},
                                            shift: {[Op.eq]: shift}
                                        }
                                    })
                                    if(cekLaporan === null) {
                                        const hLaporan = await HLaporanStokistPipa.create({
                                            id, idPelapor, idKetua, shift, foto, keterangan, status, 
                                            pernahBanding, keteranganBanding
                                        },{ transaction: t});
                                    }else{
                                        id = cekLaporan.id;
                                    }
                                    cekLaporan = await DLaporanStokistPipa.count({
                                        where: {
                                            id: {[Op.startsWith]: idDLaporan}
                                        }
                                    })
                                    var counterId = cekLaporan;
                                    var counterIdDLaporan;
                                    await Promise.all(stokistPipa.map(async element => {
                                        cekLaporan = await LaporanStok.findOne({
                                            where: {
                                                jenisBarang: {[Op.eq]: "Pipa"},
                                                merkBarang: {[Op.eq]: element.merkPipa},
                                                tipeBarang: {[Op.eq]: element.jenisPipa},
                                                ukuranBarang: {[Op.eq]: element.ukuranPipa},
                                            }
                                        })
                                        if(cekLaporan === null){
                                            cekLaporan = await LaporanStok.create({
                                                jenisBarang: 'Pipa', merkBarang: element.merkPipa, 
                                                tipeBarang: element.jenisPipa, ukuranBarang: element.ukuranPipa
                                                , satuanBarang: "Batang", jumlahBarang: 0, status: 0
                                            },{transaction: t})
                                        }
                                        counterId = counterId + 1;
                                        counterIdDLaporan = idDLaporan + pad.substring(0, pad.length - counterId.toString().length) + counterId.toString();
                                        await DLaporanStokistPipa.create({
                                            id: counterIdDLaporan, HLaporanStokistPipaId: id, LaporanStokId: cekLaporan.id 
                                            ,jumlahPipa: element.jumlahPipa, diHapus, panjangPipa: 0, beratPipa: 0,
                                            totalBaik: 0, totalBS: 0
                                        },{transaction: t})
                                    }));
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
                t.commit();
                return laporan;
            }catch(err){
                t.rollback();
                throw err
            }
        },
        updateStatusLaporanStokistPipa: async (_,args,{user})=>{
            var {id, status, keteranganBanding, stokistPipaEdit} = args;
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                if(status === 3){
                    var laporan = await HLaporanStokistPipa.update({
                        status: status, 
                        pernahBanding: true, 
                        keteranganBanding: keteranganBanding, 
                        idKetua: user.userJWT.id 
                    },{
                        where: {id: {[Op.eq]: id}},
                        transaction: t
                    }); 
                    t.commit()
                    return laporan;
                }else{
                    var cekLaporan;
                    cekLaporan = await HLaporanStokistPipa.findOne({
                        where: {id: {[Op.eq]: id}}
                    })
                    var shift = cekLaporan.shift;
                    await Promise.all(stokistPipaEdit.map(async element => {
                        await DLaporanStokistPipa.update({
                            panjangPipa: element.panjangPipa,
                            beratPipa: element.beratPipa,
                            totalBaik: element.totalBaik,
                            totalBS: element.totalBS
                        },{
                            where: {id: {[Op.eq]: element.id}},
                            transaction: t
                        })

                        cekLaporan = await LaporanStok.findOne({
                            where: {
                                id: {[Op.eq]: element.LaporanStokId}
                            }
                        })
                        await LaporanStok.update({
                            jumlahBarang: (parseInt(cekLaporan.jumlahBarang) + element.totalBaik)
                        },{
                            where: {id: {[Op.eq]: element.LaporanStokId}},
                            transaction: t
                        })

                        
                        var LaporanStokId = element.LaporanStokId;
                        var idLaporanKMPipa = element.id.replace('D', 'L');
                        cekLaporan = await LaporanKeluarMasukPipa.count({
                            where: {id: {[Op.startsWith]: idLaporanKMPipa}}
                        })
                        cekLaporan += 1;
                        idLaporanKMPipa = idLaporanKMPipa + pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();
                        await LaporanKeluarMasukPipa.create({
                            id: idLaporanKMPipa, LaporanStokId, terimaLaporan: "Shift "+shift,
                            jenisLaporan: 'masuk', jumlahLaporan: element.totalBaik
                        },{transaction: t})
                    }))
                    var laporan = await HLaporanStokistPipa.update({
                        status: status,
                        idKetua: user.userJWT.id
                    },{
                        where: {id: {[Op.eq]: id}},
                        transaction: t
                    });
                    t.commit()
                    return laporan;
                }
            }catch(err){
                t.rollback()
                throw err
            }
        },
        updateDLaporanStokistPipa: async (_,args,{user})=>{
            var {id, stokistPipaEdit, keterangan} = args;
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans = await DLaporanStokistPipa.findOne({
                    where: {
                        id: {[Op.eq]: id}
                    }
                })
                var cekLaporan = await HLaporanStokistPipa.findOne({
                    where: {
                        id: {[Op.eq]: laporans.HLaporanKetuaStokistPipaId},
                        idPelapor: {[Op.eq]: user.userJWT.id}
                    }
                })
                if(cekLaporan === null){
                    throw new UserInputError('Error',  {errors: `Akun Anda Tidak Memiliki Hak Untuk Laporan Ini`} )
                }
                var pad = "000"
                var counterId = id.replace('H','D').slice(0,9);
                var cekLaporan = await DLaporanStokistPipa.count({
                    where: {
                        id: {[Op.startsWith]: counterId}
                    }
                })
                var counterIdDLaporan;
                var cekPipa;
                await Promise.all(stokistPipaEdit.map(async (element) => {
                    if(element.baru === true){
                        cekPipa = await LaporanStok.findOne({
                            where: {
                                jenisBarang: {[Op.eq]: "Pipa"},
                                merkBarang: {[Op.eq]: element.merkBarang},
                                tipeBarang: {[Op.eq]: element.tipeBarang},
                                ukuranBarang: {[Op.eq]: element.ukuranBarang},
                            }
                        })
                        cekLaporan += 1;
                        counterIdDLaporan = counterId + pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();
                        await DLaporanStokistPipa.create({
                            id: counterIdDLaporan, HLaporanStokistPipaId: id, LaporanStokId: cekPipa.id, 
                            jumlahPipa: element.jumlahPipa, diHapus : false
                        },{transaction: t})
                    }
                    else if(element.action === 'hapus'){
                        await DLaporanStokistPipa.update({
                            diHapus: true,
                        },{
                            where: {id: {[Op.eq]: element.id}},
                            transaction: t
                        })
                    }else if(element.action === 'edit'){
                        cekPipa = await LaporanStok.findOne({
                            where: {
                                jenisBarang: {[Op.eq]: "Pipa"},
                                merkBarang: {[Op.eq]: element.merkBarang},
                                tipeBarang: {[Op.eq]: element.tipeBarang},
                                ukuranBarang: {[Op.eq]: element.ukuranBarang},
                            }
                        })
                        await DLaporanStokistPipa.update({
                            LaporanStokId: cekPipa.id,
                            jumlahPipa: element.jumlahPipa,
                        },{
                            where: {id: {[Op.eq]: element.id}},
                            transaction: t
                        })
                    }
                }))
                var laporan = await HLaporanStokistPipa.update({
                    status: 1,
                    keterangan: keterangan,
                },{
                    where: {id: {[Op.eq]: id}},
                    transaction: t
                })
                t.commit();
                return laporan;
            }catch(err){
                t.rollback();
                throw err
            }
        },
        tambahLaporanKetuaStokistPipa: async (_,args, {user})=>{
            var {shift, merkPipa, jenisPipa, ukuranPipa, warnaPipa, panjangPipa, beratPipa, totalBaik
                , totalBS, keterangan} = args;
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var pad = "000";
                var tgl = new Date();
                var tglLaporan = dayjs(tgl).format('DDMMYYYY');
                var counterTgl = dayjs(tgl).format('YYYY-MM-DD')
                var idPelapor = user.userJWT.id;
                var id = "H" + tglLaporan;
                var idDLaporan = "D" + tglLaporan;
                var laporan = null;
                var ctrUkuranPipa = ukuranPipa.split(',');
                var mesin;
                mesin = (parseFloat(ctrUkuranPipa[0]) <= 2?"Mesin 5.1": "Mesin 6.5")

                var cekLaporan = await HLaporanKetuaStokistPipa.findOne({
                    where: { 
                        createdAt: {[Op.startsWith]: counterTgl},
                        shift: {[Op.eq]: shift},
                        mesin: {[Op.eq]: mesin}
                    }
                })
                if(cekLaporan === null) {
                    cekLaporan = await HLaporanKetuaStokistPipa.count({
                        where: {
                            id: {[Op.startsWith]: id}
                        }
                    })
                    id += pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();
                    const hLaporan = await HLaporanKetuaStokistPipa.create({
                        id, idPelapor, shift, mesin, totalBaik, totalBS
                    },{ transaction: t});
                }else{
                    id = cekLaporan.id;
                    HLaporanKetuaStokistPipa.update({
                        totalBaik: (parseInt(cekLaporan.totalBaik) + totalBaik),
                        totalBS: (parseInt(cekLaporan.totalBS) + totalBS)
                    },{
                        where: {id: {[Op.eq]: id}},
                        transaction: t
                    });
                }

                cekLaporan = await DLaporanKetuaStokistPipa.count({
                    where: {
                        id: {[Op.startsWith]: idDLaporan}
                    }
                })
                var counterId = cekLaporan + 1;
                var counterIdDLaporan;
                counterIdDLaporan = idDLaporan + pad.substring(0, pad.length - counterId.toString().length) + counterId.toString();
                await DLaporanKetuaStokistPipa.create({
                    id: counterIdDLaporan, HLaporanKetuaStokistPipaId: id, merkPipa, jenisPipa, 
                    ukuranPipa: ctrUkuranPipa[1], warnaPipa, panjangPipa, beratPipa, totalBaik, totalBS, keterangan
                },{transaction: t})

                cekLaporan = await LaporanStok.findOne({
                    where: {
                        jenisBarang: {[Op.eq]: "Pipa"},
                        merkBarang: {[Op.eq]: merkPipa},
                        tipeBarang: {[Op.eq]: jenisPipa},
                        ukuranBarang: {[Op.eq]: ukuranPipa},
                    }
                })
                if(cekLaporan === null){
                    cekLaporan = await LaporanStok.create({
                        jenisBarang: 'Pipa', merkBarang: merkPipa, tipeBarang: jenisPipa, ukuranBarang: ctrUkuranPipa[1]
                        , satuanBarang: "Batang", jumlahBarang: totalBaik, status: 0
                    },{transaction: t})
                }else{
                    await LaporanStok.update({
                        jumlahBarang: (parseInt(cekLaporan.jumlahBarang) + totalBaik)
                    },{
                        where: {id: {[Op.eq]: cekLaporan.id}},
                        transaction: t
                    })
                }
                var LaporanStokId = cekLaporan.id;
                var idLaporanKMPipa = idDLaporan.replace('D', 'L');
                cekLaporan = await LaporanKeluarMasukPipa.count({
                    where: {id: {[Op.startsWith]: idLaporanKMPipa}}
                })
                cekLaporan += 1;
                idLaporanKMPipa = idLaporanKMPipa + pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();
                await LaporanKeluarMasukPipa.create({
                    id: idLaporanKMPipa, LaporanStokId, terimaLaporan: "Shift "+shift,
                    jenisLaporan: 'masuk', jumlahLaporan: totalBaik
                },{transaction: t})

                t.commit();
                return laporan;
            }catch(err){
                t.rollback();
                throw err
            }
        },
        //Direktur

        //Staf Keuangan

        //Ketua Divisi

        //Anggota Divisi

    }
}