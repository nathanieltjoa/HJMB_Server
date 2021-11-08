const { Permintaan, Jabatan, User, Izin, Karyawan, PermintaanSurat, PermintaanSuratPerintah, sequelize } = require('../../models');
const {Op} = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { UserInputError, AuthenticationError} = require('apollo-server-express');
const {JWT_SECRET} = require('../../config/env.json');
const dayjs = require('dayjs');
const path = require('path');
const fs = require('fs');
const pdf = require('pdf-creator-node');


module.exports={
    Query: {
        //general
        getPermintaans: async (_, args, { user }) =>{
            var { page, limit} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                page -= 1;
                var offset = page ? page * limit: 0;
                //cari data jabatan User
                const jabatan = await Jabatan.findOne({
                    where: { id: {[Op.eq]: user.userJWT.idJabatan}}
                })
                //ambil semua permintaan yang sesuai dengan tingkatan
                const permintaans = await Permintaan.findAndCountAll({
                    include: [{
                        model: Izin,
                        as: 'izin'
                    },{
                        model: Karyawan,
                        as: 'peminta',
                        include: [{
                            model: Jabatan,
                            as: 'jabatan',
                            where: {
                                namaJabatan: {[Op.eq]: jabatan.namaJabatan}
                            }
                        }]
                    }],
                    where: { 
                        status: {
                            [Op.eq]: jabatan.tingkatJabatan === 4? 1 : 2
                        }
                    },
                    limit: limit,
                    offset: offset,
                })
                return permintaans;
            }catch(err){
                throw err
            }
        },
        getListIzinPribadi: async (_, args, { user }) =>{
            var { page, limit, status} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                page -= 1;
                var offset = page ? page * limit: 0;
                //cari data jabatan User
                const jabatan = await Jabatan.findOne({
                    where: { id: {[Op.eq]: user.userJWT.idJabatan}}
                })
                var whereHKu = [];
                if(status !== -1){
                    whereHKu.push({
                        idPeminta: {[Op.eq]: user.userJWT.id},
                        status: {[Op.eq]: status}
                    })
                }else{
                    whereHKu.push({
                        idPeminta: {[Op.eq]: user.userJWT.id}
                    })
                }
                //ambil semua permintaan yang sesuai dengan tingkatan
                const permintaans = await Permintaan.findAndCountAll({
                    include: [{
                        model: Izin,
                        as: 'izin'
                    },{
                        model: Karyawan,
                        as: 'peminta',
                    },{
                        model: Karyawan,
                        as: 'ketua',
                    },{
                        model: Karyawan,
                        as: 'hrd',
                    },],
                    where: whereHKu,
                    limit: limit,
                    offset: offset,
                })
                return permintaans;
            }catch(err){
                throw err
            }
        },
        getPermintaan: async (_,args, { user }) =>{
            var {id} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                //ambil semua permintaan yang sesuai dengan tingkatan
                const permintaan = await Permintaan.findOne({
                    where: { 
                        id: { [Op.eq]: id }
                    }
                })
                const cekKaryawan = await Karyawan.findOne({
                    where: {id: {[Op.eq]: permintaan.idPeminta}}
                })
                permintaan.namaPeminta = cekKaryawan.nama;
                return permintaan;
            }catch(err){
                if(err.name === 'SequelizeUniqueConstraintError'){
                    err.errors.forEach((e) => {
                       (errors[e.path] = `${e.path} sudah ada`) 
                    });
                }else if(err.name === 'SequelizeValidationError'){
                    err.errors.forEach((e)=>(
                        errors[e.path] = e.message
                    ))
                }
                //throw new UserInputError('Bad Input',{errors})
            }
        },
        getPermintaansMaster: async (_,args, { user }) =>{
            var {karyawan, orderBy, bulan, status, page, limit} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                //ambil semua permintaan yang sesuai dengan tingkatan

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
                if(status !== -1){
                    whereHKu.push({
                        status: {[Op.eq]: status}
                    })
                }
                if(orderBy === "Permintaan Terbaru"){
                    orderKu= [
                        ["createdAt", "DESC"]
                    ]
                }else if(orderBy === "Permintaan Terlama"){
                    orderKu= [
                        ["createdAt", "ASC"]
                    ]
                }
                if(karyawan !== null && karyawan !== ""){
                    whereHKu.push({
                        idPeminta: {[Op.eq]: karyawan}
                    })
                }
                laporans = await Permintaan.findAndCountAll({
                    include: [
                        {
                            model: Karyawan,
                            as: 'peminta',
                        },
                        {
                            model: Karyawan,
                            as: 'ketua',
                        },
                        {
                            model: Karyawan,
                            as: 'hrd',
                        },
                        {
                            model: Izin,
                            as: 'izin',
                        },
                    ],
                    limit: limit,
                    offset: offset,
                    order: orderKu,
                    where: whereHKu,
                    subQuery: false,
                });
                return laporans;
            }catch(err){
                throw err
            }
        },
        getListSurat: async (_, args, { user }) =>{
            var { page, limit, status} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                page -= 1;
                var offset = page ? page * limit: 0;

                var whereHKu = [];
                if(status !== -1){
                    whereHKu.push({
                        idKaryawan: {[Op.eq]: user.userJWT.id},
                        status: {[Op.eq]: status}
                    })
                }else{
                    whereHKu.push({
                        idKaryawan: {[Op.eq]: user.userJWT.id}
                    })
                }
                //ambil semua permintaan yang sesuai dengan tingkatan
                const permintaans = await PermintaanSurat.findAndCountAll({
                    include: [{
                        model: Karyawan,
                        as: 'karyawan',
                    },{
                        model: Karyawan,
                        as: 'hrd',
                    },],
                    where: whereHKu,
                    limit: limit,
                    offset: offset,
                })
                return permintaans;
            }catch(err){
                throw err
            }
        },
        getListSuratMaster: async (_,args, { user }) =>{
            var {karyawan, orderBy, bulan, status, page, limit} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                //ambil semua permintaan yang sesuai dengan tingkatan

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
                if(status !== -1){
                    whereHKu.push({
                        status: {[Op.eq]: status}
                    })
                }
                if(orderBy === "Permintaan Terbaru"){
                    orderKu= [
                        ["createdAt", "DESC"]
                    ]
                }else if(orderBy === "Permintaan Terlama"){
                    orderKu= [
                        ["createdAt", "ASC"]
                    ]
                }
                if(karyawan !== null && karyawan !== ""){
                    whereHKu.push({
                        idKaryawan: {[Op.eq]: karyawan}
                    })
                }
                laporans = await PermintaanSurat.findAndCountAll({
                    include: [
                        {
                            model: Karyawan,
                            as: 'karyawan',
                        },
                        {
                            model: Karyawan,
                            as: 'hrd',
                        },
                    ],
                    limit: limit,
                    offset: offset,
                    order: orderKu,
                    where: whereHKu,
                });
                return laporans;
            }catch(err){
                throw err
            }
        },
        getListSuratPerintah: async (_, args, { user }) =>{
            var { page, limit, status} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                page -= 1;
                var offset = page ? page * limit: 0;

                var whereHKu = [];
                if(status !== -1){
                    whereHKu.push({
                        idKaryawan: {[Op.eq]: user.userJWT.id},
                        status: {[Op.eq]: status}
                    })
                }else{
                    whereHKu.push({
                        idKaryawan: {[Op.eq]: user.userJWT.id}
                    })
                }
                //ambil semua permintaan yang sesuai dengan tingkatan
                const permintaans = await PermintaanSuratPerintah.findAndCountAll({
                    include: [{
                        model: Karyawan,
                        as: 'karyawan',
                    },{
                        model: Karyawan,
                        as: 'hrd',
                    },],
                    where: whereHKu,
                    limit: limit,
                    offset: offset,
                })
                return permintaans;
            }catch(err){
                throw err
            }
        },
        getListSuratPerintahMaster: async (_,args, { user }) =>{
            var {karyawan, orderBy, bulan, status, page, limit} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                //ambil semua permintaan yang sesuai dengan tingkatan

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
                if(status !== -1){
                    whereHKu.push({
                        status: {[Op.eq]: status}
                    })
                }
                if(orderBy === "Permintaan Terbaru"){
                    orderKu= [
                        ["createdAt", "DESC"]
                    ]
                }else if(orderBy === "Permintaan Terlama"){
                    orderKu= [
                        ["createdAt", "ASC"]
                    ]
                }
                if(karyawan !== null && karyawan !== ""){
                    whereHKu.push({
                        idKaryawan: {[Op.eq]: karyawan}
                    })
                }
                laporans = await PermintaanSuratPerintah.findAndCountAll({
                    include: [
                        {
                            model: Karyawan,
                            as: 'karyawan',
                        },
                        {
                            model: Karyawan,
                            as: 'hrd',
                        },
                    ],
                    limit: limit,
                    offset: offset,
                    order: orderKu,
                    where: whereHKu,
                });
                return laporans;
            }catch(err){
                throw err
            }
        },
        getListLemburPribadiMaster: async (_, args, { user })=>{
            var {idKaryawan} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var date = new Date();
                var y = date.getFullYear(), m = date.getMonth();
                var firstDay = dayjs(new Date(y, m, 1)).format('YYYY-MM-DD');
                var lastDay = dayjs(new Date(y, m + 1, 0)).format('YYYY-MM-DD');
                const listAbsensi = await Permintaan.findAll({
                    include: [{
                        model: Izin,
                        as: 'izin',
                        where: {
                            namaIzin: {[Op.eq]: "Lembur"}
                        }
                    }],
                    where: {
                        idPeminta: {[Op.eq]: idKaryawan},
                        status: {[Op.or]: [0,3]},
                        tanggalMulai: {
                            [Op.between]: [firstDay, lastDay]
                        }
                    },
                    order: [['tanggalMulai','DESC']]
                })
                return listAbsensi;
            }catch(err){
                console.log(err)
                throw err
            }
        },
    },
    Mutation: {
        //General
        registerPermintaan: async (_,args, {user})=>{
            var { IzinId, tanggalMulai, tanggalBerakhir, keterangan, file, status, idKetua, idHRD} = args;
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var pad ="000";

                var izinKu = await Izin.findOne({
                    where: {id: {[Op.eq]: IzinId}}
                })
                if(izinKu.batasanHari === true){
                    var firstDay = new Date(new Date().getFullYear(), 0, 1);
                    var lastDay = new Date(new Date().getFullYear(), 11, 31);
                    var counterPermintaan = await Permintaan.findOne({
                        attributes: [
                            'idPeminta',
                            [sequelize.fn('sum', sequelize.col('totalHari')), 'totalHari']
                        ],
                        where: {
                            IzinId: {[Op.eq]: IzinId},
                            idPeminta: {[Op.eq]: user.userJWT.id},
                            createdAt: {
                                [Op.between]: [firstDay, lastDay]
                            },
                            status: {[Op.ne]: 0}
                        },
                        group: ['idPeminta']
                    })
                    var counterHari = 0;
                    if(counterPermintaan !== null){
                        counterHari = counterPermintaan.dataValues.totalHari;
                    }
                    var totalHari = ((Math.abs(tanggalBerakhir - tanggalMulai))/ (24 * 60 * 60 * 1000)) + counterHari
                    if(izinKu.totalIzin - totalHari < 0){
                        throw new UserInputError('Izin Anda Tidak Mencukupi Batasan Hari',  {errors: `Izin Anda Tidak Mencukupi Batasan Hari`} )
                    }
                }
                var permintaans;
                var tgl = new Date();
                var tglLaporan = dayjs(tgl).format('DDMMYYYY');
                var counterTgl = dayjs(tgl).format('YYYY-MM-DD')
                var idPelapor = user.userJWT.id;
                var id = "P" + tglLaporan;
                idPeminta = user.userJWT.id;
                if(!dayjs(tanggalBerakhir).isValid()) tanggalBerakhir = dayjs(null)
                if(dayjs(tanggalBerakhir).isValid()) tanggalBerakhir = dayjs(tanggalBerakhir).format('YYYY-MM-DD 00:00:00')
                if(status === undefined ) {
                    const jabatan = await Jabatan.findOne({
                        where: { 
                            id: { [Op.eq]: user.userJWT.idJabatan }
                        }
                    })
                    if(jabatan.tingkatJabatan === 5){
                        status = 1;
                    }else if(jabatan.tingkatJabatan === 4){
                        status = 2;
                    }else if(jabatan.tingkatJabatan < 4){
                        status = 3;
                    }
                }
                if(idKetua === undefined ) idKetua = 0;
                if(idHRD === undefined ) idHRD = 0;

                
                cekLaporan = await Permintaan.count({
                    where: {
                        id: {[Op.startsWith]: id}
                    }
                })
                id += pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();

                if(file === null){
                    permintaans = await Permintaan.create({
                        id, idPeminta, IzinId, tanggalMulai, tanggalBerakhir, totalHari,keterangan, upload: "-", status, idKetua, idHRD, alasan: ''
                    })
                }else{
                    const { createReadStream, filename, mimetype, encoding } = await file;
                    const { ext } = path.parse(filename);
                    var namaFile = id + ext;

                    const storeUpload = async ({ stream, filename, mimetype, encoding }) => {
                        const pathName = path.join(__dirname, `../../public/Izin/${namaFile}`)
                    
                        return new Promise( (resolve, reject) =>
                            stream
                                .pipe(fs.createWriteStream(pathName))
                                .on("finish",async () => {
                                    var upload = `http://localhost:4000/Izin/${namaFile}`
                                    permintaans = await Permintaan.create({
                                        id, idPeminta, IzinId, tanggalMulai, tanggalBerakhir, totalHari,keterangan, upload, status, idKetua, idHRD, alasan: ''
                                    })
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
                return permintaans;
            }catch(err){
                console.log(err);
                t.rollback();
                throw err
            }
        },
        updateStatusPermintaan: async (_,args,{user})=>{
            var {id, status, alasan} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                const jabatan = await Jabatan.findOne({
                    where: { 
                        id: { [Op.eq]: user.userJWT.idJabatan }
                    }
                })
                if(jabatan.tingkatJabatan === 2 || jabatan.tingkatJabatan === 3){
                    await Permintaan.update({status: status, alasan: alasan, idHRD: user.userJWT.id},{
                        where: {id: {[Op.eq]: id}}
                    });
                }else if(jabatan.tingkatJabatan === 4){
                    await Permintaan.update({status: status, alasan: alasan, idKetua: user.userJWT.id},{
                        where: {id: {[Op.eq]: id}}
                    });
                }
                return null;
            }catch(err){
                throw err
            }
        },
        registerPermintaanSurat: async (_,args, {user})=>{
            var { jenisSurat, tanggal, keterangan} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var pad ="000";

                var tgl = new Date();
                var tglLaporan = dayjs(tgl).format('DDMMYYYY');
                var counterTgl = dayjs(tgl).format('YYYY-MM-DD')
                var id = "P" + tglLaporan;
                
                cekLaporan = await PermintaanSurat.count({
                    where: {
                        id: {[Op.startsWith]: id}
                    }
                })
                id += pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();
                const permintaans = await PermintaanSurat.create({
                    id, jenisSurat: jenisSurat, idHRD: 0, idKaryawan: user.userJWT.id, tanggalKerja: tanggal, file:"-",
                    keterangan, keteranganHRD: '',  status: 0
                })
                
                return permintaans;
            }catch(err){
                throw err
            }
        },
        updateStatusSurat: async (_,args,{user})=>{
            var {id, status, keteranganHRD} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')

                var cekLaporan = await PermintaanSurat.findOne({
                    include:[{
                        model: Karyawan,
                        as: 'karyawan',
                        include:[{
                            model: Jabatan,
                            as: 'jabatan'
                        }]
                    }],
                    where: {
                        id: {[Op.eq]: id}
                    }
                })
                var cekKaryawan = await Karyawan.findOne({
                    include:[{
                        model: Jabatan,
                        as: 'jabatan'
                    }],
                    where: {id: {[Op.eq]: user.userJWT.id}}
                })
                const html = await fs.readFileSync(path.join(__dirname, '../../public/html/Surat Keterangan Kerja.html'), 'utf-8');
                const filename = id + '_doc' + '.pdf';
                var laporan = null
                const obj = {
                    namaKaryawan: cekLaporan.karyawan.nama,
                    alamatKaryawan: cekLaporan.karyawan.alamat,
                    jabatanKaryawan: cekLaporan.karyawan.jabatan.jabatanKu + " "+cekLaporan.karyawan.jabatan.namaJabatan,
                    namaHRD: cekKaryawan.nama,
                    alamatHRD: cekKaryawan.alamat,
                    jabatanHRD: cekKaryawan.jabatan.namaJabatan,
                    tanggal: dayjs(cekLaporan.tanggalKerja).format('DD MMMM YYYY'),
                    tanggalSekarang: dayjs(new Date()).format('DD MMMM YYYY')
                }
                const document = {
                    html: html,
                    data: {
                        laporan: obj
                    },
                    path: path.join(__dirname, `../../public/docs/${filename}`)
                }
                var assestPath = path.join(__dirname, `/../../public/`);
                assestPath = assestPath.replace(new RegExp(/\\/g), '/');
                var options = {
                    formate: 'A3',
                    orientation: 'portrait',
                    border: '2mm',
                }
                await pdf.create(document, options)
                    .then( async res => {
                    }).catch(error => {
                    });
                const filepath = `http://localhost:4000/docs/${filename}`;
                laporan = await PermintaanSurat.update({status: status, keteranganHRD: keteranganHRD, idHRD: user.userJWT.id, file: filepath},{
                    where: {id: {[Op.eq]: id}}
                })
                return laporan;
            }catch(err){
                throw err
            }
        },
        registerPermintaanSuratPerintah: async (_,args, {user})=>{
            var { idKaryawan, dinas, tanggalMulai, tanggalAkhir, keterangan} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var pad ="000";

                var tgl = new Date();
                var tglLaporan = dayjs(tgl).format('DDMMYYYY');
                var id = "SPK" + tglLaporan;
                
                cekLaporan = await PermintaanSuratPerintah.count({
                    where: {
                        id: {[Op.startsWith]: id}
                    }
                })
                id += pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();
                const html = await fs.readFileSync(path.join(__dirname, '../../public/html/Surat Perintah Kerja.html'), 'utf-8');
                const filename = id + '_doc' + '.pdf';
                cekKaryawan = await Karyawan.findOne({
                    include:[{
                        model: Jabatan,
                        as: 'jabatan',
                    }],
                    where:{
                        id: {[Op.eq]: idKaryawan}
                    }
                })
                cekHRD = await Karyawan.findOne({
                    include:[{
                        model: Jabatan,
                        as: 'jabatan',
                    }],
                    where:{
                        id: {[Op.eq]: user.userJWT.id}
                    }
                })
                const obj = {
                    namaKaryawan: cekKaryawan.nama,
                    nikKaryawan: cekKaryawan.nik,
                    alamatKaryawan: cekKaryawan.alamat,
                    jabatanKaryawan: cekKaryawan.jabatan.jabatanKu + " "+cekKaryawan.jabatan.namaJabatan,
                    namaHRD: cekHRD.nama,
                    nikHRD: cekHRD.nik,
                    jabatanHRD: cekHRD.jabatan.namaJabatan,
                    noTelpHRD: cekHRD.noTelp,
                    dinas: dinas,
                    tanggalMulai: dayjs(tanggalMulai).format('DD MMMM YYYY'),
                    tanggalAkhir: dayjs(tanggalAkhir).format('DD MMMM YYYY'),
                    tanggalSekarang: dayjs(new Date()).format('DD MMMM YYYY')
                }
                const document = {
                    html: html,
                    data: {
                        laporan: obj
                    },
                    path: path.join(__dirname, `../../public/docs/${filename}`)
                }
                var options = {
                    formate: 'A3',
                    orientation: 'portrait',
                    border: '2mm',
                }
                await pdf.create(document, options)
                    .then( async res => {
                        console.log(res)
                    }).catch(error => {
                        console.log(error)
                    });
                const filepath = `http://localhost:4000/docs/${filename}`;
                const permintaans = await PermintaanSuratPerintah.create({
                    id, idHRD: user.userJWT.id, idKaryawan: idKaryawan, dinas, keterangan, tanggalMulai, tanggalAkhir,
                    status: 0, keteranganKaryawan: '', file: filepath
                })
                return permintaans;
            }catch(err){
                console.log(err);
                throw err
            }
        },
        updateStatusSuratPerintah: async (_,args,{user})=>{
            var {id, status, keterangan} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                laporan = await PermintaanSuratPerintah.update({status: status, keteranganKaryawan: keterangan},{
                    where: {id: {[Op.eq]: id}}
                })
                return laporan;
            }catch(err){
                console.log(err);
                throw err
            }
        },
        updateStatusSuratPerintahMaster: async (_,args,{user})=>{
            var {id, status} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                console.log("masuk");
                laporan = await PermintaanSuratPerintah.update({status: status},{
                    where: {id: {[Op.eq]: id}}
                })
                return laporan;
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

    }
}