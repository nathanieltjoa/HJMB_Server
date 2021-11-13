const { Karyawan, Jabatan, LaporanDataDiri, HPenilaianHRD, HPenilaianKuisioner, PembagianAnggota, 
    HKontrakKaryawan, HPembayaranGaji, PermintaanPromosiJabatan, User, sequelize } = require('../../models');
const {Op} = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { UserInputError, AuthenticationError} = require('apollo-server-express');
const {JWT_SECRET} = require('../../config/env.json')
const dayjs = require('dayjs');
const path = require('path');
const fs = require('fs');

module.exports={
    Query: {
        //general
        getKaryawan: async (_,__, {user})=>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                const karyawan = await Karyawan.findOne({
                    include: [{
                        model: Jabatan,
                        as: 'jabatan'
                    }],
                    where: { id: {[Op.eq]: user.userJWT.id}}
                })
                const jabatan = await Jabatan.findOne({
                    where: { id: {[Op.eq]: user.userJWT.idJabatan}}
                })
                if(jabatan.tingkatJabatan === 4 || jabatan.tingkatJabatan === 2){
                    karyawan.namaJabatan = 'Ketua '
                }else if(jabatan.tingkatJabatan === 3 || jabatan.tingkatJabatan === 5){
                    karyawan.namaJabatan = 'Anggota '
                }else if(jabatan.tingkatJabatan === 6){
                    karyawan.namaJabatan = 'Staf '
                }
                karyawan.namaJabatan += jabatan.namaJabatan;
                return karyawan;
            }catch(err){
                throw err
            }
        },
        getListKaryawan: async (_,args, {user})=>{
            var {divisi} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                const karyawan = await Karyawan.findAll({
                    include: [{
                        model: Jabatan,
                        as: 'jabatan',
                        where: {
                            namaJabatan: {[Op.eq]: divisi}
                        }
                    }],
                })
                return karyawan;
            }catch(err){
                throw err
            }
        },
        getListKaryawanPembayaranGaji: async (_,args, {user})=>{
            var {divisi} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                const karyawans = await Karyawan.findAll({
                    include: [{
                        model: Jabatan,
                        as: 'jabatan',
                        attributes: [],
                        where: {
                            namaJabatan: {[Op.eq]: divisi}
                        }
                    },{
                        model: HKontrakKaryawan,
                        as: 'kontrak',
                        attributes: [],
                        where: {
                            status: {[Op.eq]: 1}
                        },
                    }],
                })
                return karyawans;
            }catch(err){
                throw err
            }
        },
        getListKaryawanKontrak: async (_,args, {user})=>{
            var {divisi} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                const karyawan = await Karyawan.findAll({
                    include: [{
                        model: Jabatan,
                        as: 'jabatan',
                        where: {
                            namaJabatan: {[Op.eq]: divisi}
                        }
                    }],
                })
                return karyawan;
            }catch(err){
                throw err
            }
        },
        getListKaryawanLaporan: async (_,args, {user})=>{
            var {divisi} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                const karyawan = await Karyawan.findAll({
                    include: [{
                        model: Jabatan,
                        as: 'jabatan',
                        where: {
                            namaJabatan: {[Op.eq]: divisi},
                            tingkatJabatan: {[Op.ne]: 4}
                        }
                    }],
                })
                return karyawan;
            }catch(err){
                throw err
            }
        },
        getListKaryawanKuisioner: async (_,args, {user})=>{
            var {divisi, status} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var karyawan;
                if(divisi !== undefined && divisi != ""){
                    karyawan = await Karyawan.findAll({
                        include: [{
                            model: Jabatan,
                            as: 'jabatan',
                            where: {
                                namaJabatan: {[Op.eq]: divisi}
                            }
                        }],
                    }) 
                }else{
                    var jabatan = await Jabatan.findOne({
                        where: { id: {[Op.eq]: user.userJWT.idJabatan}}
                    })
                    if(status === "Diri Sendiri"){
                        karyawan = await Karyawan.findAll({
                            where: {id: {[Op.eq]: user.userJWT.id}}
                        })
                    }else if(jabatan.namaJabatan === "HRD"){
                        var tingkat;
                        var whereKu = {};
                        if(status === "Rekan Sekerja"){
                            tingkat = jabatan.tingkatJabatan;
                            whereKu = {
                                id: {[Op.ne]: user.userJWT.id}
                            }
                        }else if(status === "Bawahan"){
                            tingkat = jabatan.tingkatJabatan + 1;
                        }else if(status === "Atasan"){
                            tingkat = jabatan.tingkatJabatan - 1;
                        }
                        karyawan = await Karyawan.findAll({
                            include: [{
                                model: Jabatan,
                                as: 'jabatan',
                                where: {
                                    tingkatJabatan: {[Op.eq]: tingkat}
                                }
                            }],
                            where: whereKu
                        })
                    }else{
                        var tingkat;
                        var whereKu = {};
                        if(status === "Rekan Sekerja"){
                            tingkat = jabatan.tingkatJabatan;
                            whereKu = {
                                id: {[Op.ne]: user.userJWT.id}
                            }
                        }else if(status === "Bawahan"){
                            tingkat = jabatan.tingkatJabatan + 1;
                        }else if(status === "Atasan"){
                            tingkat = jabatan.tingkatJabatan - 1;
                        }
                        karyawan = await Karyawan.findAll({
                            include: [{
                                model: Jabatan,
                                as: 'jabatan',
                                where: {
                                    tingkatJabatan: {[Op.eq]: tingkat},
                                    namaJabatan: {[Op.eq]: jabatan.namaJabatan}
                                }
                            }],
                            where: whereKu
                        })
                    }
                }
                return karyawan;
            }catch(err){
                throw err
            }
        },
        getListKaryawanMaster: async (_,args, {user})=>{
            var {page, limit} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var offset = page ? page * limit: 0;

                const karyawans = await Karyawan.findAndCountAll({
                    limit: limit,
                    offset: offset,
                    include: [{
                        model: Jabatan,
                        as: 'jabatan',
                        where: {
                            tingkatJabatan: {[Op.gte]: 4}
                        }
                    }],
                    order: [['id','ASC']]
                }) 
                return karyawans;
            }catch(err){
                throw err
            }
        },
        getKaryawanKu: async (_,args, {user})=>{
            var {id} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                const karyawans = await Karyawan.findOne({
                    include: [{
                        model: Jabatan,
                        as: 'jabatan',
                    }],
                    where: {id: {[Op.eq]: id}}
                }) 
                return karyawans;
            }catch(err){
                throw err
            }
        },
        getNilaiKaryawan: async (_,args, {user})=>{
            var {page, limit, karyawan, orderBy, bulan, divisi} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var offset = page ? page * limit: 0;

                var orderKu =[];
                var whereHKu = [];
                var whereDKu = [];
                var whereJKu = [];
                if(bulan !== null && bulan !== undefined){
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
                if(orderBy === "Nilai Tertinggi"){
                    orderKu= [
                        ['hPenilaianHRD',"totalNilai", "DESC"],
                        ['hPenilaianKuisioner',"totalNilai", "DESC"],
                    ]
                }else if(orderBy === "Nilai Terendah"){
                    orderKu= [
                        ['hPenilaianHRD',"totalNilai", "ASC"],
                        ['hPenilaianKuisioner',"totalNilai", "ASC"],
                    ]
                }
                if(divisi !== null && divisi !== ""){
                    whereJKu = {
                        namaJabatan: {[Op.eq]: divisi},
                        tingkatJabatan: {[Op.gte]: 4}
                    }
                }else{
                    whereJKu = {
                        tingkatJabatan: {[Op.gte]: 4}
                    }
                }
                if(karyawan !== null && karyawan !== ""){
                    whereHKu={
                        id: {[Op.eq]: karyawan}
                    }
                }
                const karyawans = await Karyawan.findAndCountAll({
                    include: [
                    {
                        model: HPenilaianHRD,
                        as: 'hPenilaianHRD',
                        where: whereDKu,
                    },{
                        model: HPenilaianKuisioner,
                        as: 'hPenilaianKuisioner',
                        where: whereDKu,
                    },{
                        model: Jabatan,
                        as: 'jabatan',
                        where: whereJKu,
                    },],
                    limit: limit,
                    offset: offset,
                    where: whereHKu,
                    order: orderKu,
                    subQuery: false,
                })
                return karyawans;
            }catch(err){
                throw err
            }
        },
        getListAnggota: async (_,__, {user})=>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')

                var jabatan = await Jabatan.findOne({
                    where: { id: {[Op.eq]: user.userJWT.idJabatan}}
                })

                const karyawans = await Karyawan.findAll({
                    include: [{
                        model: Jabatan,
                        as: 'jabatan',
                        attributes: [],
                        where: {
                            namaJabatan: {[Op.eq]: jabatan.namaJabatan},
                            tingkatJabatan: {[Op.eq]: 5}
                        }
                    },{
                        model: PembagianAnggota,
                        as: 'pembagianAnggotaKaryawan'
                    }],
                })
                const filteredKaryawan = karyawans.filter(karyawan => karyawan.pembagianAnggotaKaryawan.length === 0 || karyawan.pembagianAnggotaKaryawan[0].groupKaryawan === 0);
                return filteredKaryawan;
            }catch(err){
                throw err
            }
        },
        getListAnggotaDivisi: async (_,__, {user})=>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')

                var jabatan = await Jabatan.findOne({
                    where: { id: {[Op.eq]: user.userJWT.idJabatan}}
                })

                const karyawans = await Karyawan.findAll({
                    include: [{
                        model: Jabatan,
                        as: 'jabatan',
                        attributes: [],
                        where: {
                            namaJabatan: {[Op.eq]: jabatan.namaJabatan},
                            tingkatJabatan: {[Op.eq]: 5}
                        }
                    },{
                        model: PembagianAnggota,
                        as: 'pembagianAnggotaKaryawan'
                    }],
                })
                return karyawans;
            }catch(err){
                throw err
            }
        },
        getListPermintaanPromosiKetua: async (_,args, {user})=>{
            var {page, limit, status} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')

                page -= 1;
                var offset = page ? page * limit: 0;
                var whereH = [];
                if(status !== -1){
                    whereH = {
                        idPelapor: {[Op.eq]: user.userJWT.id},
                        status: {[Op.eq]: status}
                    }
                }else{
                    whereH = {
                        idPelapor: {[Op.eq]: user.userJWT.id}
                    }
                }
                const permintaan = await PermintaanPromosiJabatan.findAndCountAll({
                    limit: limit,
                    offset: offset,
                    where: whereH,
                    include: [{
                        model: Karyawan,
                        as: 'karyawan',
                    }],
                    order: [['createdAt', 'DESC']]
                })
                return permintaan;
            }catch(err){
                throw err
            }
        },
        getListPermintaanPromosiMaster: async (_,args, {user})=>{
            var {page, limit, orderBy, status,} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var offset = page ? page * limit: 0;

                var orderKu =[];
                var whereHKu = [];
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
                const listPermintaan = await PermintaanPromosiJabatan.findAndCountAll({
                    include: [{
                        model: Karyawan,
                        as: 'karyawan',
                    },{
                        model: Karyawan,
                        as: 'pelapor'
                    },{
                        model: Karyawan,
                        as: 'penerima',
                    }],
                    limit: limit,
                    offset: offset,
                    where: whereHKu,
                    order: orderKu
                }) 
                return listPermintaan;
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
        registerKaryawan: async (_,args, {user})=>{
            var {id, nama, nik, noTelp, tanggalMasuk, tempatLahir, tanggalLahir, alamat, agama, pendidikan, file, idJabatan} = args;
            var errors = {}
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                //generate username
                if(id.toString().trim() === '') errors.id = 'ID tidak boleh kosong'
                if(nama.trim() === '') errors.nama = 'Nama tidak boleh kosong'
                if(nik.trim() === '') errors.nik = 'NIK tidak boleh kosong'
                if(!dayjs(tanggalMasuk).isValid()) errors.tanggalMasuk = 'Tanggal Masuk tidak boleh kosong'
                if(tempatLahir.trim() === '') errors.tempatLahir = 'Tempat Lahir tidak boleh kosong'
                if(!dayjs(tanggalLahir).isValid()) errors.tanggalLahir = 'Tanggal Lahir tidak boleh kosong'
                if(alamat.trim() === '') errors.alamat = 'Alamat tidak boleh kosong'
                if(agama.trim() === '') errors.agama = 'Agama tidak boleh kosong'
                if(pendidikan.trim() === '') errors.pendidikan = 'Pendidikan tidak boleh kosong'

                var cekLaporan = await Karyawan.findOne({
                    where: {id: {[Op.eq]: id}}
                })
                if(cekLaporan !== null){
                    errors.id = 'ID Sudah Ada';
                }
                if(Object.keys(errors).length > 0){
                    throw new UserInputError('Bad Input', { errors })
                }
                var foto = "";
                if(file === null){
                    foto = "-";
                }else{
                    const { createReadStream, filename, mimetype, encoding } = await file;

                    const { ext } = path.parse(filename);
                    var namaFile = id + ext;

                    const storeUpload = async ({ stream, filename, mimetype, encoding }) => {
                        const pathName = path.join(__dirname, `../../public/profile/${namaFile}`)
                    
                        return new Promise( (resolve, reject) =>
                            stream
                                .pipe(fs.createWriteStream(pathName))
                                .on("finish",async () => {
                                    foto = `http://localhost:4000/profile/${namaFile}`
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
                
                console.log("asd");
                const karyawans = await Karyawan.create({
                    id: id, nama, nik, noTelp, tanggalMasuk, tempatLahir, tanggalLahir, alamat, agama, pendidikan, foto, JabatanId : idJabatan
                },{transaction: t})

                var username = nama.split(' ')[0].toLowerCase();
                const counterUser = await User.findAll({
                    where: {username: {[Op.like]: (username+'%')}},
                })
                username = username + (counterUser.length+1);
                var passwordRaw = username + (Math.floor(Math.random() * 100) + 10);
                var password = await bcrypt.hash(passwordRaw,6)
                const users = await User.create({
                    id: id, username, password, idJabatan
                },{transaction: t})
                users.passwordRaw = passwordRaw;
                
                karyawans.username = username;
                karyawans.passwordRaw = passwordRaw
                t.commit()
                return karyawans;
            }catch(err){
                console.log(err);
                if(err.name === 'SequelizeUniqueConstraintError'){
                    err.errors.forEach((e) => {
                       (errors[e.path] = `${e.path} sudah ada`) 
                    });
                }else if(err.name === 'SequelizeValidationError'){
                    err.errors.forEach((e)=>(
                        errors[e.path] = e.message
                    ))
                }
                t.rollback()
                throw new UserInputError('Bad Input',{errors})
            }
        },
        updateKaryawan: async (_,args, {user})=>{
            var {id, idPermintaan, nama, nik, tanggalMasuk, tempatLahir, tanggalLahir, alamat, agama, pendidikan, file} = args;
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporan = null;
                var foto;
                if(file !== undefined){
                    const { createReadStream, filename, mimetype, encoding } = await file;
    
                    const { ext } = path.parse(filename);
                    var namaFile = id + ext;
    
                    const storeUpload = async ({ stream, filename, mimetype, encoding }) => {
                        const pathName = path.join(__dirname, `../../public/profile/${namaFile}`)
                    
                        return new Promise( (resolve, reject) =>
                            stream
                                .pipe(fs.createWriteStream(pathName))
                                .on("finish",async () => {
                                    foto = `http://localhost:4000/profile/${namaFile}`
                                    laporan = await Karyawan.update({
                                        nama, nik, tanggalMasuk, tempatLahir, tanggalLahir, alamat, agama, pendidikan, foto
                                    },{
                                        where: {id: {[Op.eq]: id}},
                                        transaction: t
                                    })
                                    if(idPermintaan !== null){
                                        await LaporanDataDiri.update({
                                            idHRD: user.userJWT.id,
                                            status: 1,
                                        },{
                                            where: {id: {[Op.eq]: idPermintaan}},
                                            transaction: t 
                                        })
                                    }
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
                }else{
                    laporan = await Karyawan.update({
                        nama, nik, tanggalMasuk, tempatLahir, tanggalLahir, alamat, agama, pendidikan
                    },{
                        where: {id: {[Op.eq]: id}},
                        transaction: t
                    })
                    if(idPermintaan !== null){
                        await LaporanDataDiri.update({
                            idHRD: user.userJWT.id,
                            status: 1,
                        },{
                            where: {id: {[Op.eq]: idPermintaan}},
                            transaction: t 
                        })
                    }
                }
                t.commit();
                return laporan;
            }catch(err){
                t.rollback()
                throw err
            }
        },
        registerPermintaanPromosi: async (_,args, {user})=>{
            var {idKaryawan, promosi, keterangan} = args;
            var errors = {}
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var kenaikan = promosi === "Kenaikan"? true: false;
                const permintaan = await PermintaanPromosiJabatan.create({
                    idPenerima: 0, idPelapor: user.userJWT.id, idKaryawan, kenaikan, keterangan, keteranganDirektur: '', status: 0
                })
                return permintaan;
            }catch(err){
                throw err
            }
        },
        updateStatusPermintaanPromosi: async (_,args,{user}) =>{
            var {id, status, keterangan} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var cekLaporan = await PermintaanPromosiJabatan.findOne({
                    where: {id: {[Op.eq]: id}}
                })
                if(status === 1){
                    if(cekLaporan.kenaikan === false){
                        await PembagianAnggota.update({
                            ketua: false
                        },{
                            where: {idKaryawan: cekLaporan.idKaryawan}
                        })
                    }else{
                        await PembagianAnggota.update({
                            ketua: true 
                        },{
                            where: {idKaryawan: cekLaporan.idKaryawan}
                        })
                    }
                }
                var laporan = await PermintaanPromosiJabatan.update({
                    status, idPenerima: user.userJWT.id, keteranganDirektur: keterangan
                },{
                    where: {id: {[Op.eq]: id}},
                })
                return laporan;
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