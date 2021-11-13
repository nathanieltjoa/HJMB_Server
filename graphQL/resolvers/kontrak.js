const {IndexGaji, IndexIuran, HKontrakKaryawan, DKontrakGaji, DKontrakIuran, Karyawan, Jabatan, 
    HPembayaranGaji, DPembayaranGaji, HPenilaianHRD, HPenilaianKuisioner, PengaruhNilai, HPinjamUang, DPinjamUang, sequelize} = require('../../models');
const {Op} = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { UserInputError, AuthenticationError} = require('apollo-server-express');
const {JWT_SECRET} = require('../../config/env.json')
const dayjs = require('dayjs');

module.exports={
    Query: {
        getIndexGaji: async (_,args, {user})=>{
            var {status} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var whereKu;
                if(status === true){
                    whereKu = {
                        status: {[Op.eq]: 1}
                    }
                }
                const indexGaji = await IndexGaji.findAll({
                    where: whereKu
                })
                return indexGaji;
            }catch(err){
                throw err
            }
        },
        getIndexIuran: async (_,args, {user})=>{
            var {status} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var whereKu;
                if(status === true){
                    whereKu = {
                        status: {[Op.eq]: 1}
                    }
                }
                const indexIuran = await IndexIuran.findAll({
                    where: whereKu
                })
                return indexIuran;
            }catch(err){
                throw err
            }
        },
        getKontrakKaryawan: async (_,args, {user})=>{
            var {page, limit, orderBy, karyawan, bulan, status,} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var offset = page ? page * limit: 0;

                var orderKu = [];
                var whereHKu = [];
                if(bulan !== null && bulan !== undefined){
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
                if(karyawan !== null && karyawan !== ""){
                    whereHKu.push({
                        idKaryawan: {[Op.eq]: karyawan}
                    })
                }
                if(orderBy === "Kontrak Terdekat"){
                    orderKu = [
                        ['tanggalBerakhir', 'ASC']
                    ]
                }else if(orderBy === "Nama Asc"){
                    orderKu = [
                        [{Karyawan, as: 'karyawan'}, 'nama', 'ASC']
                    ]
                }else if(orderBy === "Nama Desc"){
                    orderKu = [
                        [{Karyawan, as: 'karyawan'}, 'nama', 'DESC']
                    ]
                }
                const listKontrak = await HKontrakKaryawan.findAndCountAll({
                    limit: limit,
                    offset: offset,
                    include: [{
                        model: Karyawan,
                        as: 'karyawan',
                        include: [{
                            model: Jabatan,
                            as: 'jabatan'
                        }]
                    }],
                    order: orderKu,
                    where: whereHKu
                }) 
                return listKontrak;
            }catch(err){
                throw err
            }
        },
        getRequestKontrakKu: async (_,__, {user})=>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')

                const listKontrak = await HKontrakKaryawan.findOne({
                    include: [{
                        model: DKontrakGaji,
                        as: 'dKontrakGaji',
                        include: [{
                            model: IndexGaji,
                            as: 'dKontrakIndexGaji'
                        }]
                    },{
                        model: DKontrakIuran,
                        as: 'dKontrakIuran',
                        include: [{
                            model: IndexIuran,
                            as: 'dKontrakIndexIuran'
                        }]
                    }],
                    where:{
                        idKaryawan: {[Op.eq]: user.userJWT.id},
                        status: {[Op.eq]: 0}
                    }
                }) 
                return listKontrak;
            }catch(err){
                throw err
            }
        },
        getKontrakKu: async (_,__, {user})=>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')

                var tanggal = new Date()
                const listKontrak = await HKontrakKaryawan.findOne({
                    include: [{
                        model: DKontrakGaji,
                        as: 'dKontrakGaji',
                        include: [{
                            model: IndexGaji,
                            as: 'dKontrakIndexGaji'
                        }]
                    },{
                        model: DKontrakIuran,
                        as: 'dKontrakIuran',
                        include: [{
                            model: IndexIuran,
                            as: 'dKontrakIndexIuran'
                        }]
                    }],
                    where:{
                        idKaryawan: {[Op.eq]: user.userJWT.id},
                        status: {[Op.eq]: 1},
                        tanggalBerakhir: {[Op.gte]: tanggal},
                        tanggalMulai: {[Op.lte]: tanggal}
                    }
                }) 
                return listKontrak;
            }catch(err){
                throw err
            }
        },
        getDetailKontrak: async (_,args, {user})=>{
            var {id} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')

                const listKontrak = await HKontrakKaryawan.findOne({
                    include: [{
                        model: DKontrakGaji,
                        as: 'dKontrakGaji',
                        include: [{
                            model: IndexGaji,
                            as: 'dKontrakIndexGaji'
                        }]
                    },{
                        model: DKontrakIuran,
                        as: 'dKontrakIuran',
                        include: [{
                            model: IndexIuran,
                            as: 'dKontrakIndexIuran'
                        }]
                    }],
                    where:{
                        id: {[Op.eq]: id}
                    }
                }) 
                return listKontrak;
            }catch(err){
                throw err
            }
        },
        getPembayaranGaji: async (_,args, {user})=>{
            var {page, limit, karyawan, orderBy, bulan, status,} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var offset = page ? page * limit: 0;

                var orderKu =[];
                var whereHKu = [];
                var whereDKu = [];
                if(bulan !== null && bulan !== undefined){
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
                if(orderBy === "Slip Terbaru"){
                    orderKu= [
                        ["createdAt", "DESC"]
                    ]
                }else if(orderBy === "Slip Terlama"){
                    orderKu= [
                        ["createdAt", "ASC"]
                    ]
                }
                if(karyawan !== null && karyawan !== ""){
                    whereDKu={
                        idKaryawan: {[Op.eq]: karyawan}
                    }
                }
                const listKontrak = await HPembayaranGaji.findAndCountAll({
                    include: [{
                        model: HKontrakKaryawan,
                        as: 'kontrak',
                        where: whereDKu,
                        include: [{
                            model: Karyawan,
                            as: 'karyawan'
                        }]
                    },{
                        model: Karyawan,
                        as: 'karyawan',
                    },{
                        model: Karyawan,
                        as: 'hrd',
                    },{
                        model: Karyawan,
                        as: 'keuangan',
                    }],
                    limit: limit,
                    offset: offset,
                    where: whereHKu,
                    order: orderKu
                }) 
                return listKontrak;
            }catch(err){
                throw err
            }
        },
        getDetailPembayaranGaji: async (_,args, {user})=>{
            var {id} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')

                const listKontrak = await DPembayaranGaji.findAll({
                    where:{
                        HPembayaranGajiId: {[Op.eq]: id}
                    }
                }) 
                return listKontrak;
            }catch(err){
		console.log(err);
                throw err
            }
        },
        getPembayaranGajiKaryawan: async (_,args, {user})=>{
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
                if(orderBy === "Slip Terbaru"){
                    orderKu= [
                        ["createdAt", "DESC"]
                    ]
                }else if(orderBy === "Slip Terlama"){
                    orderKu= [
                        ["createdAt", "ASC"]
                    ]
                }
                const listKontrak = await HPembayaranGaji.findAndCountAll({
                    include: [{
                        model: HKontrakKaryawan,
                        as: 'kontrak',
                        where: {
                            idKaryawan: {[Op.eq]: user.userJWT.id}
                        },
                        include: [{
                            model: Karyawan,
                            as: 'karyawan'
                        }]
                    },{
                        model: Karyawan,
                        as: 'karyawan',
                    },{
                        model: Karyawan,
                        as: 'hrd',
                    },{
                        model: Karyawan,
                        as: 'keuangan',
                    }],
                    limit: limit,
                    offset: offset,
                    where: whereHKu,
                    order: orderKu
                }) 
                return listKontrak;
            }catch(err){
                throw err
            }
        },
    },
    Mutation: {
        registerIndexGaji: async (_,args, {user})=>{
            var {namaGaji, keteranganGaji} = args;
            var errors = {}
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')

                if(namaGaji.trim() === '') errors.namaGaji = 'Nama Gaji tidak boleh kosong'
                if(keteranganGaji.trim() === '') errors.keteranganGaji = 'Keterangan Gaji tidak boleh kosong'
                if(Object.keys(errors).length > 0){
                    throw new UserInputError('Bad Input', { errors })
                }
                const indexGaji = await IndexGaji.create({
                    namaGaji, keteranganGaji, status: 0
                })
                return indexGaji;
            }catch(err){
                throw new UserInputError('Bad Input',{errors})
            }
        },
        updateStatusIndexGaji: async (_,args,{user}) =>{
            var {id, status} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporan = await IndexGaji.update({
                    status
                },{
                    where: {id: {[Op.eq]: id}},
                })
                return laporan;
            }catch(err){
                throw err
            }
        },
        updateIndexGaji: async (_,args,{user}) =>{
            var {id, namaGaji, keteranganGaji} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporan = await IndexGaji.update({
                    namaGaji, keteranganGaji
                },{
                    where: {id: {[Op.eq]: id}},
                })
                return laporan;
            }catch(err){
                throw err
            }
        },
        registerIndexIuran: async (_,args, {user})=>{
            var {namaIuran, keteranganIuran} = args;
            var errors = {}
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')

                if(namaIuran.trim() === '') errors.namaIuran = 'Nama Iuran tidak boleh kosong'
                if(keteranganIuran.trim() === '') errors.keteranganIuran = 'Keterangan Iuran tidak boleh kosong'
                if(Object.keys(errors).length > 0){
                    throw new UserInputError('Bad Input', { errors })
                }
                const indexIuran = await IndexIuran.create({
                    namaIuran, keteranganIuran, status: 0
                })
                return indexIuran;
            }catch(err){
                throw new UserInputError('Bad Input',{errors})
            }
        },
        updateStatusIndexIuran: async (_,args,{user}) =>{
            var {id, status} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporan = await IndexIuran.update({
                    status
                },{
                    where: {id: {[Op.eq]: id}},
                })
                return laporan;
            }catch(err){
                throw err
            }
        },
        updateIndexIuran: async (_,args,{user}) =>{
            var {id, namaIuran, keteranganIuran} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporan = await IndexIuran.update({
                    namaIuran, keteranganIuran
                },{
                    where: {id: {[Op.eq]: id}},
                })
                return laporan;
            }catch(err){
                throw err
            }
        },
        registerKontrakKaryawan: async (_,args, {user})=>{
            var {idKaryawan, jenisKontrak, gaji, iuran, tanggalMulai, tanggalBerakhir} = args;
            var errors = {}
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                
                var totalGaji = 0;
                var totalIuran = 0;
                await Promise.all(gaji.map(async element =>{
                    totalGaji += element.total;
                }))
                await Promise.all(iuran.map(async element =>{
                    totalIuran += element.total
                }))
                var tgl = dayjs(new Date()).format('DDMMYYYY');
                var hKontrakKaryawanId = 'H' + tgl;
                var dKontrakGajiId = 'D' + tgl;
                var dKontrakIuranId = 'D' + tgl;
                tanggalBerakhir = dayjs(tanggalBerakhir).format('YYYY-MM-DD')
                var cekLaporan = await HKontrakKaryawan.findOne({
                    where: {
                        idKaryawan: {[Op.eq]: idKaryawan},
                        tanggalMulai: {
                            [Op.between]: [tanggalMulai, tanggalBerakhir]
                        },
                        status: {[Op.ne]: 2}
                    }
                })
                if(cekLaporan !== null){
                    throw new UserInputError('Karyawan Sedang Menjalani Kontrak Untuk Tanggal Tersebut',  
                    {errors: `Karyawan Sedang Menjalani Kontrak Untuk Tanggal Tersebut`} )
                }
                var pad = "000"
                cekLaporan = await HKontrakKaryawan.count({
                    where: {
                        id: {[Op.startsWith]: hKontrakKaryawanId}
                    }
                })
                hKontrakKaryawanId += pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();
                const laporan = await HKontrakKaryawan.create({
                    id: hKontrakKaryawanId, idKaryawan, idHRD: user.userJWT.id, jenisKontrak, totalGaji, totalIuran, tanggalMulai,
                    tanggalBerakhir, status: 0
                },{transaction: t})
                
                cekLaporan = await DKontrakGaji.count({
                    where: {id: {[Op.startsWith]: dKontrakGajiId}}
                })
                var counterTgl = cekLaporan;
                var ctrId = dKontrakGajiId;
                await Promise.all(gaji.map(async element =>{
                    counterTgl = counterTgl + 1;
                    dKontrakGajiId = ctrId + pad.substring(0, pad.length - counterTgl.toString().length) + counterTgl.toString();
                    await DKontrakGaji.create({
                        id: dKontrakGajiId, HKontrakKaryawanId: hKontrakKaryawanId, IndexGajiId: element.id, 
                        total: element.total
                    },{transaction: t})
                }))
                cekLaporan = await DKontrakIuran.count({
                    where: {id: {[Op.startsWith]: dKontrakIuranId}}
                })

                counterTgl = cekLaporan;
                ctrId = dKontrakIuranId;
                await Promise.all(iuran.map(async element =>{
                    counterTgl = counterTgl + 1;
                    dKontrakIuranId = ctrId + pad.substring(0, pad.length - counterTgl.toString().length) + counterTgl.toString();
                    await DKontrakIuran.create({
                        id: dKontrakIuranId, HKontrakKaryawanId: hKontrakKaryawanId, IndexIuranId: element.id, 
                        total: element.total
                    },{transaction: t})
                }))
                t.commit()
                return laporan;
            }catch(err){
                t.rollback()
                throw err;
            }
        },
        updateStatusKontrak: async (_,args,{user})=>{
            var {status, id} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                if(status === "Terima"){
                    return await HKontrakKaryawan.update({status: 1},{
                        where: {id: {[Op.eq]: id}}
                    });
                }else if(status === "Tolak"){
                    return await HKontrakKaryawan.update({status: 2},{
                        where: {id: {[Op.eq]: id}}
                    });
                }
            }catch(err){
                throw err
            }
        },
        updateStatusKontrakMaster: async (_,args,{user})=>{
            var {status, id} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                if(status === false){
                    return await HKontrakKaryawan.update({status: 3},{
                        where: {id: {[Op.eq]: id}}
                    });
                }
            }catch(err){
                throw err
            }
        },
        registerPembayaranGaji: async (_,args,{user})=>{
            var {idKaryawan, jumlahLembur} = args;
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')

                var cekLaporan = await HPembayaranGaji.findOne({
                    include: [{
                        model: HKontrakKaryawan,
                        as: 'kontrak',
                        where: {
                            idKaryawan: {[Op.eq]: idKaryawan},
                        }
                    }],
                    where:{
                        status: {[Op.eq]: 0}
                    }
                })
                if(cekLaporan !== null){
                    throw new UserInputError('Error',  {errors: `Masih Ada Pembayaran Gaji Karyawan Yang Sedang Berlangsung`} )
                }
                var pad = "000";
                var counterTgl = dayjs(new Date()).format('DDMMYYYY');
                var id = "H" + counterTgl;
                var idDLaporan = "D" + counterTgl;
                var counterIdDLaporan;
                var cekTgl = new Date()

                var cekLaporan = await HPembayaranGaji.count({
                    where: {
                        id: {[Op.startsWith]: id}
                    }
                })
                id += pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();
                var cekHKontrak = await HKontrakKaryawan.findOne({
                    where:{
                        idKaryawan: {[Op.eq]: idKaryawan},
                        status: {[Op.eq]: 1},
                        tanggalMulai: {[Op.lte]: cekTgl},
                        tanggalBerakhir: {[Op.gte]: cekTgl},
                    }
                })

                //lembur
                var baseGajiLembur;
                if(cekHKontrak.jenisKontrak === "Bulanan"){
                    baseGajiLembur = ((cekHKontrak.totalGaji / 25) / 8) * 1.5;
                }else if(cekHKontrak.jenisKontrak === "Mingguan"){
                    baseGajiLembur = 13543
                }
                var gajiLembur = baseGajiLembur * jumlahLembur;

                //penilaian
                cekLaporan = await HPenilaianHRD.findOne({
                    where: { idKaryawan: {[Op.eq]: idKaryawan} },
                    order: [ [ 'createdAt', 'DESC' ]],
                })
                if(cekLaporan === null){
                    throw new UserInputError('Error',  {errors: `Belum Ada Penilaian Yang Tersedia`} )
                }
		        var counterNilai = 0;
                counterNilai += cekLaporan.totalNilai;
                cekLaporan = await HPenilaianKuisioner.findAll({
                    attributes: [[sequelize.fn('DISTINCT', sequelize.col('ListKuisionerId')), 'kuisioner'], 'totalNilai'],
                    where: { idKaryawan: {[Op.eq]: idKaryawan} },
                    order: [ [ 'createdAt', 'DESC' ]],
                })
                await Promise.all(cekLaporan.map( async element => {
                    counterNilai += element.totalNilai;
                }))
                cekLaporan = await PengaruhNilai.findOne({
                    where: {
                        nilaiMin: {[Op.lt]: counterNilai},
                        nilaiMax: {[Op.gt]: counterNilai}
                    }
                })
                var pengurangan = cekLaporan.pengurangan;
                var nilaiUang = cekLaporan.nilaiUang;
                var hasilNilai = cekLaporan.hasilNilai;

                //pajak

                //utang
                cekLaporan = await HPinjamUang.findOne({
                    where: {
                        idKaryawan: {[Op.eq]: idKaryawan},
                        status: {[Op.eq]: 2},
                        lunas: false
                    }
                })
                var totalUtang = 0;
                /*var pembayaranKe;
                if(cekLaporan !== null){
                    cekLaporan = await DPinjamUang.findOne({
                        where: {
                            HPinjamUangId: {[Op.eq]: cekLaporan.id},
                            lunas: {[Op.eq]: false},
                        }
                    })
                    totalUtang += cekLaporan.totalPembayaran;
                    pembayaranKe = cekLaporan.pembayaranKe;
                }*/
                
                var totalGaji = ((cekHKontrak.totalGaji + cekHKontrak.totalIuran) + gajiLembur) - totalUtang;
                if(pengurangan === true){
                    totalGaji -= nilaiUang;
                }else{
                    totalGaji += nilaiUang;
                }

                const hLaporan = await HPembayaranGaji.create({
                    id, HKontrakKaryawanId: cekHKontrak.id, verifikasiKaryawan: 0, idKeuangan: 0, idHRD: user.userJWT.id,
                    totalGaji: totalGaji, tanggalPembayaran: new Date(null), status: 0
                },{ transaction: t});
                

                cekLaporan = await DPembayaranGaji.count({
                    where: {
                        id: {[Op.startsWith]: idDLaporan}
                    }
                })
                var counterId = cekLaporan;
                //penilaian
                var counterNilai = 0;
                counterIdDLaporan = idDLaporan + pad.substring(0, pad.length - counterId.toString().length) + counterId.toString();
                await DPembayaranGaji.create({
                    id: counterIdDLaporan, HPembayaranGajiId: id, pengurangan: pengurangan, nama: "Gaji Penilaian",
                    total: nilaiUang, keterangan: "Nilai Karyawan "+hasilNilai
                },{ transaction: t});
                counterId += 1;


                //lembur
                counterIdDLaporan = idDLaporan + pad.substring(0, pad.length - counterId.toString().length) + counterId.toString();
                await DPembayaranGaji.create({
                    id: counterIdDLaporan, HPembayaranGajiId: id, pengurangan: false, nama: "Gaji Lembur",
                    total: gajiLembur, keterangan: "Base Gaji Lembur Rp "+baseGajiLembur
                },{ transaction: t});
                counterId += 1;

                //pajak

                //utang
                if(totalUtang > 0){
                    counterIdDLaporan = idDLaporan + pad.substring(0, pad.length - counterId.toString().length) + counterId.toString();
                    await DPembayaranGaji.create({
                        id: counterIdDLaporan, HPembayaranGajiId: id, pengurangan: true, nama: "Utang Pinjaman",
                        total: totalUtang, keterangan: "Utang Pembayaran Ke-"+pembayaranKe
                    },{ transaction: t});
                    counterId += 1;
                }
                
                t.commit()
                return hLaporan;
            }catch(err){
                t.rollback()
                throw err
            }
        },
        updateStatusPembayaranGaji: async (_,args,{user})=>{
            var {status, id} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var cekLaporan = await HPembayaranGaji.findOne({
                    where: {
                        id: {[Op.eq]: id},
                        idHRD: {[Op.eq]: user.userJWT.id}
                    }
                })
                if(cekLaporan === null){
                    throw new UserInputError('Error',  {errors: `Akun Anda Tidak Memiliki Hak Untuk Slip Gaji Ini`} )
                }

                if(status === true){
                    var totalGaji = cekLaporan.totalGaji;
                    cekLaporan = await DPembayaranGaji.findAll({
                        where: {
                            HPembayaranGajiId: {[Op.eq]: id}
                        }
                    })
                    cekLaporan.map(element => {
                        totalGaji += element.total
                    })
                    return await HPembayaranGaji.update({status: 1, totalGaji: totalGaji},{
                        where: {id: {[Op.eq]: id}}
                    });
                }else if(status === false){
                    return await HPembayaranGaji.update({status: -1},{
                        where: {id: {[Op.eq]: id}}
                    });
                }
            }catch(err){
                throw err
            }
        },
        updateStatusPembayaranGajiKeuangan: async (_,args,{user})=>{
            var {status, id} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                return await HPembayaranGaji.update({status: 4, idKeuangan: user.userJWT.id, tanggalPembayaran: new Date()},{
                    where: {id: {[Op.eq]: id}}
                });
            }catch(err){
                throw err
            }
        },
        updateStatusPembayaranGajiKaryawan: async (_,args,{user})=>{
            var {status, id} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                return await HPembayaranGaji.update({status: status, verifikasiKaryawan: user.userJWT.id},{
                    where: {id: {[Op.eq]: id}}
                });
            }catch(err){
                throw err
            }
        },
    }
}
