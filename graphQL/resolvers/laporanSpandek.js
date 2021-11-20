const {HLaporanSpandek, DLaporanSpandek, HLaporanHollow, DLaporanHollow, Karyawan, Jabatan, PembagianAnggota,sequelize } = require('../../models');
const {Op} = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { UserInputError, AuthenticationError} = require('apollo-server-express');
const {JWT_SECRET} = require('../../config/env.json')
const dayjs = require('dayjs');
const Sequelize = require('sequelize');
const path = require('path');
const fs = require('fs');
const { parse } = require('path');
const { off } = require('process');

module.exports={
    Query: {
        //general
        getLaporanMasterSpandek: async (_,args,{user}) =>{
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
    
                        whereHKu={
                            idPelapor: {[Op.eq]: cekLaporan.idKaryawan}
                        }
                    }else{
                        whereHKu={
                            idPelapor: {[Op.eq]: karyawan}
                        }
                    }
                }
                laporans = await DLaporanSpandek.findAndCountAll({
                    include: [{
                        model: HLaporanSpandek,
                        as: 'hLaporanSpandek',
                        where: whereHKu,
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
                    }],
                    limit: limit,
                    offset: offset,
                    order: orderKu,
                    where: whereDKu
                });
                return laporans;
            }catch(err){
                console.log(err);
                throw err
            }
        },
        getLaporanMasterHollow: async (_,args,{user}) =>{
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
    
                        whereHKu={
                            idPelapor: {[Op.eq]: cekLaporan.idKaryawan}
                        }
                    }else{
                        whereHKu={
                            idPelapor: {[Op.eq]: karyawan}
                        }
                    }
                }
                laporans = await DLaporanHollow.findAndCountAll({
                    include: [{
                        model: HLaporanHollow,
                        as: 'hLaporanHollow',
                        where: whereHKu,
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
                    }],
                    limit: limit,
                    offset: offset,
                    order: orderKu,
                    where: whereDKu
                });
                return laporans;
            }catch(err){
                console.log(err);
                throw err
            }
        },
        getSummarySpandek: async (_,__,{user}) =>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                
                var date = new Date();
                var y = date.getFullYear(), m = date.getMonth();
                var firstDay = dayjs(new Date(y, m, 1)).format('YYYY-MM-DD');
                var lastDay = dayjs(new Date(y, m + 1, 0)).format('YYYY-MM-DD');
                var getKaryawan = await HLaporanSpandek.findAll({
                    attributes: [
                        'idPelapor',
                        [sequelize.fn('sum', sequelize.col('totalPanjang')), 'jumlahProduksi'],
                        [sequelize.fn('sum', sequelize.col('totalBS')), 'jumlahBS'],
                    ],
                    include:{
                        model: Karyawan,
                        as: 'karyawan',
                        attributes: ['nama']
                    },
                    order: sequelize.literal('jumlahProduksi DESC'),
                    group: ['idPelapor']
                })
                var cekProduksi;
                await Promise.all(getKaryawan.map(async element => {
                    cekProduksi = await DLaporanSpandek.count({
                        include: [{
                            model: HLaporanSpandek,
                            as: 'hLaporanSpandek',
                            attributes: [],
                            where: {
                                idPelapor: {[Op.eq]: element.idPelapor},
                            }
                        }],
                        where: {
                            pernahBanding: {[Op.eq]: true}
                        }
                    })
                    element.jumlahBanding = cekProduksi;
                    element.jumlahProduksiFloat = element.dataValues.jumlahProduksi;
                    element.jumlahBSFloat = element.dataValues.jumlahBS;
                }))
                return getKaryawan;
            }catch(err){
                console.log(err);
                throw err
            }
        },
        getSummaryHollow: async (_,__,{user}) =>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                
                var date = new Date();
                var y = date.getFullYear(), m = date.getMonth();
                var firstDay = dayjs(new Date(y, m, 1)).format('YYYY-MM-DD');
                var lastDay = dayjs(new Date(y, m + 1, 0)).format('YYYY-MM-DD');
                var getKaryawan = await HLaporanHollow.findAll({
                    attributes: [
                        'idPelapor',
                        [sequelize.fn('sum', sequelize.col('totalJumlah')), 'jumlahProduksi'],
                        [sequelize.fn('sum', sequelize.col('totalBS')), 'jumlahBS'],
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
                    cekProduksi = await DLaporanHollow.count({
                        include: [{
                            model: HLaporanHollow,
                            as: 'hLaporanHollow',
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
                    element.jumlahBS = element.dataValues.jumlahBS;
                }))
                return getKaryawan;
            }catch(err){
                console.log(err);
                throw err
            }
        },
        getLaporansVerifikasiSpandek: async (_,args,{user}) =>{
            var {status, jenisProduk, page, limit} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans;
                var laporanBaru = [];
                var laporan = {};
                var cekKaryawan;
                var namaKaryawan;
                var jabatan = await Jabatan.findOne({
                    where: { id: {[Op.eq]: user.userJWT.idJabatan}}
                })

                page -= 1;
                var offset = page ? page * limit: 0;
                var whereKu = {};
                if(status !== 0){
                    whereKu = {
                        status: {[Op.eq]: status}
                    }
                }
                
                if(jabatan.tingkatJabatan === 5){
                    if(jenisProduk === "Semuanya"){
                        laporans = await DLaporanSpandek.findAndCountAll({
                            include: [{
                                model: HLaporanSpandek,
                                as: 'hLaporanSpandek',
                                where: {
                                    idPelapor: {[Op.eq]: user.userJWT.id}
                                }
                            }]
                            ,where: whereKu
                            ,limit: limit
                            ,offset: offset
                            ,order: [['createdAt','DESC']]
                        });
                    }else{
                        laporans = await DLaporanSpandek.findAndCountAll({
                            include: [{
                                model: HLaporanSpandek,
                                as: 'hLaporanSpandek',
                                where: {
                                    idPelapor: {[Op.eq]: user.userJWT.id},
                                    jenisProduk: {[Op.eq]: jenisProduk}
                                }
                            }]
                            ,where: whereKu
                            ,limit: limit
                            ,offset: offset
                            ,order: [['createdAt','DESC']]
                        });
                    }
                    laporan.count = laporans.count;
                    await Promise.all(laporans.rows.map(async element =>
                    { 
                        counterHLaporan = await HLaporanSpandek.findOne({
                            where: {id: {[Op.eq]: element.HLaporanSpandekId}}
                        })
                        namaKaryawan = "-";
                        if(counterHLaporan.idKetua !== 0){
                            cekKaryawan = await Karyawan.findOne({
                                where: {id: {[Op.eq]: counterHLaporan.idKetua}}
                            })
                            namaKaryawan = cekKaryawan.nama;
                        }
                        element.namaPelapor = namaKaryawan;
                        element.jenisProduk = counterHLaporan.jenisProduk;
                        element.shift = counterHLaporan.shift;
                        laporanBaru.push(element);
                    }))
                    laporan.rows = laporanBaru;
                }else if(jabatan.tingkatJabatan === 4){
                    if(jenisProduk === "Semuanya"){
                        laporans = await DLaporanSpandek.findAndCountAll({
                            where: whereKu
                            ,limit: limit
                            ,offset: offset
                            ,order: [['createdAt','DESC']]
                        });
                    }else{
                        laporans = await DLaporanSpandek.findAndCountAll({
                            include: [{
                                model: HLaporanSpandek,
                                as: 'hLaporanSpandek',
                                where: {
                                    jenisProduk: {[Op.eq]: jenisProduk}
                                }
                            }]
                            ,where: whereKu
                            ,limit: limit
                            ,offset: offset
                            ,order: [['createdAt','DESC']]
                        });
                    }
                    laporan.count = laporans.count;
                    await Promise.all(laporans.rows.map(async (element) =>
                    { 
                        counterHLaporan = await HLaporanSpandek.findOne({
                            where: {id: {[Op.eq]: element.HLaporanSpandekId}}
                        })
                        cekKaryawan = await Karyawan.findOne({
                            where: {id: {[Op.eq]: counterHLaporan.idPelapor}}
                        })
                        namaKaryawan = cekKaryawan.nama;
                        element.namaPelapor = namaKaryawan;
                        element.jenisProduk = counterHLaporan.jenisProduk;
                        element.shift = counterHLaporan.shift;
                        laporanBaru.push(element);
                    }))
                    laporan.rows = laporanBaru;
                }
                return laporan;
            }catch(err){
                console.log(err);
                throw err
            }
        },
        getLaporansVerifikasiHollow: async (_,args,{user}) =>{
            var {status, page, limit} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans;
                var laporanBaru = [];
                var laporan = {};
                var cekKaryawan;
                var namaKaryawan;
                var jabatan = await Jabatan.findOne({
                    where: { id: {[Op.eq]: user.userJWT.idJabatan}}
                })
                page -= 1;
                var offset = page ? page * limit: 0;
                
                if(jabatan.tingkatJabatan === 5){
                    if(status === 0){
                        laporans = await DLaporanHollow.findAndCountAll({
                            include: [{
                                model: HLaporanHollow,
                                as: 'hLaporanHollow',
                                where: {
                                    idPelapor: {[Op.eq]: user.userJWT.id}
                                }
                            }],
                            limit: limit,
                            offset: offset,
                            order: [['createdAt','DESC']]
                        })
                    }else{
                        laporans = await DLaporanHollow.findAndCountAll({
                            include: [{
                                model: HLaporanHollow,
                                as: 'hLaporanHollow',
                                where: {
                                    idPelapor: {[Op.eq]: user.userJWT.id}
                                }
                            }],
                            where: {
                                status: {[Op.eq]: status}
                            },
                            limit: limit,
                            offset: offset,
                            order: [['createdAt','DESC']]
                        })
                    }
                    laporan.count = laporans.count;
                    await Promise.all(laporans.rows.map(async element =>
                    { 
                        counterHLaporan = await HLaporanHollow.findOne({
                            where: {id: {[Op.eq]: element.HLaporanHollowId}}
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
                        laporanBaru.push(element);
                    }))
                }else if(jabatan.tingkatJabatan === 4){
                    if(status === 0){
                        laporans = await DLaporanHollow.findAndCountAll({
                            limit: limit,
                            offset: offset,
                            order: [['createdAt','DESC']]
                        })
                    }else{
                        laporans = await DLaporanHollow.findAndCountAll({
                            where: {status: {[Op.eq]: status}},
                            limit: limit,
                            offset: offset,
                            order: [['createdAt','DESC']]
                        })
                    }
                    laporan.count = laporans.count;
                    await Promise.all(laporans.rows.map(async (element) =>
                    { 
                        counterHLaporan = await HLaporanHollow.findOne({
                            where: {id: {[Op.eq]: element.HLaporanHollowId}}
                        })
                        cekKaryawan = await Karyawan.findOne({
                            where: {id: {[Op.eq]: counterHLaporan.idPelapor}}
                        })
                        namaKaryawan = cekKaryawan.nama;
                        element.namaPelapor = namaKaryawan;
                        element.shift = counterHLaporan.shift;
                        laporanBaru.push(element);
                    }))
                }
                laporan.rows = laporanBaru;
                return laporan;
            }catch(err){
                console.log(err);
                throw err;
            }
        },
        getHLaporansSpandek: async (_,args,{user}) =>{
            var {jenisProduk, page, limit} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                page -= 1;
                var offset = page ? page * limit: 0;
                var laporans;
                if(jenisProduk === "Semuanya"){
                    laporans = await HLaporanSpandek.findAndCountAll({
                        limit: limit,
                        offset: offset,
                        order: [['createdAt','DESC']]
                    })
                }else{
                    laporans = await HLaporanSpandek.findAndCountAll({
                        where: {jenisProduk: {[Op.eq]: jenisProduk}},
                        limit: limit,
                        offset: offset,
                        order: [['createdAt','DESC']]
                    })
                }
                var laporanBaru = [];
                var cekKaryawan;
                var laporan = {};
                laporan.count = laporans.count;
                await Promise.all(laporans.rows.map(async element =>{
                    cekKaryawan = await Karyawan.findOne({
                        where: {id: {[Op.eq]: element.idPelapor}}
                    })
                    element.namaPelapor = cekKaryawan.nama;
                    laporanBaru.push(element);
                }))
                laporan.rows = laporanBaru;
                return laporans;
            }catch(err){
                console.log(err);
                throw err
            }
        },
        getHLaporansHollow: async (_,args,{user}) =>{
            var {page, limit} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporan;
                page -= 1;
                var offset = page ? page * limit: 0;
                var laporans = await HLaporanHollow.findAndCountAll({
                    limit: limit,
                    offset: offset,
                    order: [['createdAt','DESC']]
                });
                var laporanBaru = [];
                var cekKaryawan;
                var laporan = {};
                laporan.count = laporans.count;
                await Promise.all(laporans.rows.map(async element =>{
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
        getDLaporansSpandek: async (_,args,{user}) =>{
            var {id} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans = await DLaporanSpandek.findAll({
                    where: {HLaporanSpandekId: {[Op.eq]: id}},
                    order: [['createdAt','DESC']]
                });
                return laporans;
            }catch(err){
                console.log(err);
                throw err
            }
        },
        getDLaporansHollow: async (_,args,{user}) =>{
            var {id} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans = await DLaporanHollow.findAll({
                    where: {HLaporanHollowId: {[Op.eq]: id}},
                    order: [['createdAt','DESC']]
                });
                return laporans;
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
        tambahLaporanSpandek: async (_,args, {user})=>{
            var { jenisProduk, shift, namaPemesan, warna, ukuran, berat, gelombang, panjang, BS, noCoil, file, keterangan } = args;
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var pad = "000";
                var idPelapor = user.userJWT.id;
                var counterTgl = dayjs(new Date()).format('DDMMYYYY');
                var id = "H" + counterTgl;
                var idDLaporan = "D" + counterTgl;
                var status = 1;
                var keteranganBanding = "";
                var laporan = null;
                var pernahBanding = false;
                var cekLaporan = await HLaporanSpandek.findOne({
                    where: { 
                        id: {[Op.startsWith]: id},
                        jenisProduk: {[Op.eq]: jenisProduk},
                        shift: {[Op.eq]: shift}
                    }
                })
                if(cekLaporan !== null){
                    id = cekLaporan.id;
                }else{
                    cekLaporan = await HLaporanSpandek.count({
                        where: {
                            id: {[Op.startsWith]: id}
                        }
                    })
                    id += pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();
                    await HLaporanSpandek.create({
                        id, shift, idPelapor, idKetua: 0, jenisProduk, totalPanjang: 0, totalBS: 0
                        , totalBerat: 0
                    },{ transaction: t});
                }

                cekLaporan = await DLaporanSpandek.count({
                    where: {
                        id: {[Op.startsWith]: idDLaporan}
                    }
                })
                idDLaporan += pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();

                if(file === null){
                    laporan = await DLaporanSpandek.create({
                        id: idDLaporan,HLaporanSpandekId: id, namaPemesan, warna, ukuran, berat, gelombang,
                         panjang, BS, noCoil,keterangan, foto: '-', status, pernahBanding, 
                         keteranganBanding
                    },{transaction: t});
                }else{
                    const { createReadStream, filename, mimetype, encoding } = await file;

                    const { ext } = path.parse(filename);
                    var namaFile = idDLaporan + ext;

                    const storeUpload = async ({ stream, filename, mimetype, encoding }) => {
                        const pathName = path.join(__dirname, `../../public/laporan/Spandek/${namaFile}`)
                    
                        return new Promise( (resolve, reject) =>
                            stream
                                .pipe(fs.createWriteStream(pathName))
                                .on("finish",async () => { 
                                    var foto = `http://localhost:4000/laporan/Spandek/${namaFile}`
                                    laporan = await DLaporanSpandek.create({
                                        id: idDLaporan,HLaporanSpandekId: id, namaPemesan, warna, ukuran, berat, 
                                        gelombang, panjang, BS, noCoil,keterangan, foto, status, pernahBanding, 
                                        keteranganBanding
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
                console.log(err);
                await t.rollback();
                throw err
            }
        },
        tambahLaporanHollow: async (_,args, {user})=>{
            var { shift, ukuran, ketebalan, berat, panjang, noCoil, jumlah, BS, file, keterangan } = args;
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var pad = "000";
                var idPelapor = user.userJWT.id;
                var counterTgl = dayjs(new Date()).format('DDMMYYYY');
                var id = "H" + counterTgl;
                var idDLaporan = "D" + counterTgl;
                var status = 1;
                var keteranganBanding = "";
                var laporan = null;
                var pernahBanding = false;
                var cekLaporan = await HLaporanHollow.findOne({
                    where: { 
                        id: {[Op.startsWith]: id},
                        shift: {[Op.eq]: shift}
                    }
                })
                if(cekLaporan !== null){
                    id = cekLaporan.id;
                }else{
                    cekLaporan = await HLaporanHollow.count({
                        where: {
                            id: {[Op.startsWith]: id}
                        }
                    })
                    id += pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();
                    await HLaporanHollow.create({
                        id, shift, idPelapor, idKetua: 0, totalBerat: 0, totalJumlah : 0, totalBS : 0
                    },{ transaction: t});
                }

                
                cekLaporan = await DLaporanHollow.count({
                    where: {
                        id: {[Op.startsWith]: idDLaporan}
                    }
                })
                idDLaporan += pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();

                if(file === null){
                    laporan = await DLaporanHollow.create({
                        id: idDLaporan,HLaporanHollowId: id, ukuran, ketebalan, berat, panjang,
                        noCoil, jumlah, BS, keterangan, foto: '-', status, pernahBanding, keteranganBanding
                    },{transaction: t});
                }else{
                    const { createReadStream, filename, mimetype, encoding } = await file;
    
                    const { ext } = path.parse(filename);
                    var namaFile = idDLaporan + ext;
    
                    const storeUpload = async ({ stream, filename, mimetype, encoding }) => {
                        const pathName = path.join(__dirname, `../../public/laporan/Hollow/${namaFile}`)
                    
                        return new Promise( (resolve, reject) =>
                            stream
                                .pipe(fs.createWriteStream(pathName))
                                .on("finish",async () => { 
                                    var foto = `http://localhost:4000/laporan/Hollow/${namaFile}`
                                    laporan = await DLaporanHollow.create({
                                        id: idDLaporan,HLaporanHollowId: id, ukuran, ketebalan, berat, panjang, 
                                        noCoil, jumlah, BS, keterangan, foto, status, pernahBanding, keteranganBanding
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
                console.log(err);
                await t.rollback();
                throw err
            }
        },
        updateDLaporanSpandek: async (_,args,{user})=>{
            var {id, namaPemesan, warna, ukuran, berat, gelombang, panjang, BS, noCoil, keterangan} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans = await DLaporanSpandek.findOne({
                    where: {
                        id: {[Op.eq]: id}
                    }
                })
                var cekLaporan = await HLaporanSpandek.findOne({
                    where: {
                        id: {[Op.eq]: laporans.HLaporanSpandekId},
                        idPelapor: {[Op.eq]: user.userJWT.id}
                    }
                })
                if(cekLaporan === null){
                    throw new UserInputError('Error',  {errors: `Akun Anda Tidak Memiliki Hak Untuk Laporan Ini`} )
                }
                return await DLaporanSpandek.update({namaPemesan: namaPemesan, warna: warna
                    , ukuran: ukuran, berat: berat, gelombang: gelombang, panjang: panjang, BS: BS, noCoil: noCoil,keterangan: keterangan, 
                    status: 1},{
                    where: {id: {[Op.eq]: id}}
                });
            }catch(err){
                console.log(err);
                throw err
            }
        },
        updateDLaporanHollow: async (_,args,{user})=>{
            var {id, ukuran, ketebalan, berat, panjang, noCoil, jumlah, BS, keterangan} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans = await DLaporanHollow.findOne({
                    where: {
                        id: {[Op.eq]: id}
                    }
                })
                var cekLaporan = await HLaporanHollow.findOne({
                    where: {
                        id: {[Op.eq]: laporans.HLaporanHollowId},
                        idPelapor: {[Op.eq]: user.userJWT.id}
                    }
                })
                if(cekLaporan === null){
                    throw new UserInputError('Error',  {errors: `Akun Anda Tidak Memiliki Hak Untuk Laporan Ini`} )
                }
                return await DLaporanHollow.update({ukuran: ukuran, ketebalan: ketebalan, berat: berat, panjang: panjang
                    , noCoil: noCoil, jumlah: jumlah, BS: BS,keterangan: keterangan, status: 1},{
                    where: {id: {[Op.eq]: id}}
                });
            }catch(err){
                console.log(err);
                throw err
            }
        },
        updateStatusLaporanSpandek: async (_,args,{user})=>{
            var {id, status, keteranganBanding} = args;
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans = await DLaporanSpandek.findOne({
                    where: {id: {[Op.eq]: id}}
                })
                var hLaporan = await HLaporanSpandek.findOne({
                    where: {id: {[Op.eq]: laporans.HLaporanSpandekId}}
                })
                if(status === 3){
                    await HLaporanSpandek.update({
                        idKetua: user.userJWT.id,
                    },{
                        where: {id: {[Op.eq]: laporans.HLaporanSpandekId}},
                        transaction: t
                    })
                    await DLaporanSpandek.update({status: status, pernahBanding: true, keteranganBanding: keteranganBanding},{
                        where: {id: {[Op.eq]: id}},
                        transaction: t
                    });
                }else{
                    var counterPanjang = parseFloat(hLaporan.totalPanjang) + parseFloat(laporans.panjang);
                    var counterBS = parseFloat(hLaporan.totalBS) + parseFloat(laporans.BS);
                    var counterBerat = parseFloat(hLaporan.totalBerat) + parseFloat(laporans.berat);
                    await HLaporanSpandek.update({
                        idKetua: user.userJWT.id,
                        totalPanjang: counterPanjang,
                        totalBS: counterBS,
                        totalBerat: counterBerat,
                    },{
                        where: {id: {[Op.eq]: laporans.HLaporanSpandekId}},
                        transaction: t
                    })
                    await DLaporanSpandek.update({status: status},{
                        where: {id: {[Op.eq]: id}},
                        transaction: t
                    });
                }
                t.commit()
            }catch(err){
                console.log(err);
                t.rollback()
                throw err
            }
        },
        updateStatusLaporanHollow: async (_,args,{user})=>{
            var {id, status, keteranganBanding} = args;
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans = await DLaporanHollow.findOne({
                    where: {id: {[Op.eq]: id}}
                })
                var hLaporan = await HLaporanHollow.findOne({
                    where: {id: {[Op.eq]: laporans.HLaporanHollowId}}
                })
                var laporan;
                if(status === 3){
                    await HLaporanHollow.update({
                        idKetua: user.userJWT.id,
                    },{
                        where: {id: {[Op.eq]: laporans.HLaporanHollowId}},
                        transaction: t
                    })
                    laporan = await DLaporanHollow.update({status: status, pernahBanding: true, keteranganBanding: keteranganBanding},{
                        where: {id: {[Op.eq]: id}},
                        transaction: t
                    });
                }else{
                    var counterJumlah = parseFloat(hLaporan.totalJumlah) + parseFloat(laporans.jumlah);
                    var counterBS = parseFloat(hLaporan.totalBS) + parseFloat(laporans.BS);
                    var counterBerat = parseFloat(hLaporan.totalBerat) + parseFloat(laporans.berat);
                    await HLaporanHollow.update({
                        idKetua: user.userJWT.id,
                        totalJumlah: counterJumlah,
                        totalBS: counterBS,
                        totalBerat: counterBerat,
                    },{
                        where: {id: {[Op.eq]: laporans.HLaporanHollowId}},
                        transaction: t
                    })
                    laporan = await DLaporanHollow.update({status: status},{
                        where: {id: {[Op.eq]: id}},
                        transaction: t
                    });
                }
                t.commit()
                return laporan;
            }catch(err){
                console.log(err);
                t.rollback()
                throw err
            }
        },
        //Direktur

        //Staf Keuangan

        //Ketua Divisi

        //Anggota Divisi

    }
}