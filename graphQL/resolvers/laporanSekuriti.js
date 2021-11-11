const { HLaporanSekuriti, DLaporanDinasSekuriti, DLaporanInventarisSekuriti, DLaporanMutasiSekuriti
    , Karyawan, Jabatan, Gudang, PembagianAnggota,sequelize } = require('../../models');
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
        getLaporanMasterSekuriti: async (_,args,{user}) =>{
            var {gudang, orderBy, bulan, status, banding, page, limit} = args;
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
                            tanggalLaporan: {
                                [Op.between]: [firstDay, lastDay]
                            }
                        })
                    }
                }
                if(orderBy === "Laporan Terbaru"){
                    orderKu= [
                        ["tanggalLaporan", "DESC"]
                    ]
                }else if(orderBy === "Laporan Terlama"){
                    orderKu= [
                        ["tanggalLaporan", "ASC"]
                    ]
                }
                if(gudang !== null){
                    whereHKu.push({
                        GudangId: {[Op.eq]: gudang}
                    })
                }
                laporans = await HLaporanSekuriti.findAndCountAll({
                    include: [{
                        model: Gudang,
                        as: 'gudang',
                    },
                    {
                        model: Karyawan,
                        as: 'penyerah',
                    },
                    {
                        model: Karyawan,
                        as: 'penerima',
                    },
                    {
                        model: Karyawan,
                        as: 'ketua',
                    },],
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
        getHLaporansSekuriti: async (_, args, { user })=>{
            var {page, limit} = args
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporanBaru = [];
                page -= 1;
                var offset = page ? page * limit: 0;
                const laporans = await HLaporanSekuriti.findAndCountAll({
                    limit: limit,
                    offset: offset,
                    order: [ [ 'tanggalLaporan', 'DESC' ]],
                })
                var gudang;
                var laporan = {};
                laporan.count = laporans.count;
                await Promise.all(laporans.rows.map(async element =>{
                    gudang = await Gudang.findOne({
                        where: {id: {[Op.eq]: element.GudangId}}
                    })
                    element.namaGudang = gudang.namaGudang;
                    element.namaKetua = "-";
                    element.namaPenyerah = "-";
                    element.namaPenerima = "-";
                    var karyawan;
                    if(element.idKetua !== 0){
                        karyawan = await Karyawan.findOne({
                            where: {id: {[Op.eq]: element.idKetua}}
                        })
                        element.namaKetua = karyawan.nama;
                    }
                    if(element.idPenyerah !== 0){
                        karyawan = await Karyawan.findOne({
                            where: {id: {[Op.eq]: element.idPenyerah}}
                        })
                        element.namaPenyerah = karyawan.nama;
                    }
                    if(element.idPenerima !== 0){
                        karyawan = await Karyawan.findOne({
                            where: {id: {[Op.eq]: element.idPenerima}}
                        })
                        element.namaPenerima = karyawan.nama;
                    }
                    laporanBaru.push(element);
                }))
                laporan.rows = laporanBaru;
                return laporan;
            }catch(err){
                throw err
            }
        },
        getDLaporanSekuriti: async (_, args, { user })=>{
            var {id} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                const laporans = await HLaporanSekuriti.findOne({
                    where: {id: {[Op.eq]: id}},
                    include: [{
                        model: DLaporanDinasSekuriti,
                        as: 'dLaporanDinasSekuriti',
                    },{
                        model: DLaporanInventarisSekuriti,
                        as: 'dLaporanInventarisSekuriti',
                    },{
                        model: DLaporanMutasiSekuriti,
                        as: 'dLaporanMutasiSekuriti',
                    }],
                })
                const gudang = await Gudang.findOne({
                    where: {id: {[Op.eq]: laporans.GudangId}}
                })
                laporans.namaGudang = gudang.namaGudang;
                laporans.namaKetua = "-";
                laporans.namaPenyerah = "-";
                laporans.namaPenerima = "-";
                var karyawan;
                if(laporans.idKetua !== 0){
                    karyawan = await Karyawan.findOne({
                        where: {id: {[Op.eq]: laporans.idKetua}}
                    })
                    laporans.namaKetua = karyawan.nama;
                }
                if(laporans.idPenyerah !== 0){
                    karyawan = await Karyawan.findOne({
                        where: {id: {[Op.eq]: laporans.idPenyerah}}
                    })
                    laporans.namaPenyerah = karyawan.nama;
                }
                if(laporans.idPenerima !== 0){
                    karyawan = await Karyawan.findOne({
                        where: {id: {[Op.eq]: laporans.idPenerima}}
                    })
                    laporans.namaPenerima = karyawan.nama;
                }
                await Promise.all(laporans.dLaporanDinasSekuriti.map(async element => {
                    karyawan = await Karyawan.findOne({
                        where: {id: {[Op.eq]: element.idPelapor}}
                    })
                    element.namaPelapor = karyawan.nama;
                }))
                await Promise.all(laporans.dLaporanInventarisSekuriti.map( async element => {
                    karyawan = await Karyawan.findOne({
                        where: {id: {[Op.eq]: element.idPelapor}}
                    })
                    element.namaPelapor = karyawan.nama;
                }))
                await Promise.all(laporans.dLaporanMutasiSekuriti.map( async element => {
                    karyawan = await Karyawan.findOne({
                        where: {id: {[Op.eq]: element.idPelapor}}
                    })
                    element.namaPelapor = karyawan.nama;
                }))
                return laporans;
            }catch(err){
                throw err
            }
        },
        getLaporanDinasKu: async (_, __, { user })=>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                
                const TODAY_START = new Date().setHours(0, 0, 0, 0);
                const NOW = new Date();
                const dinas = await DLaporanDinasSekuriti.findOne({
                    where: {
                        idPelapor: {[Op.eq]: user.userJWT.id},
                        createdAt: { 
                            [Op.gt]: TODAY_START,
                            [Op.lt]: NOW
                        },
                    },
                    order: [ [ 'createdAt', 'DESC' ]],
                })
                if(dinas === null){
                    return null
                }
                const cekInventaris = await DLaporanInventarisSekuriti.findOne({
                    where: {HLaporanSekuritiId: {[Op.eq]: dinas.HLaporanSekuritiId}},
                })
                const cekMutasi = await DLaporanMutasiSekuriti.findOne({
                    where: {HLaporanSekuritiId: {[Op.eq]: dinas.HLaporanSekuritiId}},
                })
                var include;
                if(cekInventaris !== null && cekMutasi !== null){
                    include = [{
                        model: DLaporanDinasSekuriti,
                        as: 'dLaporanDinasSekuriti',
                        where: {idPelapor: {[Op.eq]: user.userJWT.id}}
                    },{
                        model: DLaporanInventarisSekuriti,
                        as: 'dLaporanInventarisSekuriti',
                        where: {idPelapor: {[Op.eq]: user.userJWT.id}}
                    },{
                        model: DLaporanMutasiSekuriti,
                        as: 'dLaporanMutasiSekuriti',
                        where: {idPelapor: {[Op.eq]: user.userJWT.id}}
                    }]
                }else if(cekInventaris !== null){
                    include = [{
                        model: DLaporanDinasSekuriti,
                        as: 'dLaporanDinasSekuriti',
                        where: {idPelapor: {[Op.eq]: user.userJWT.id}}
                    },{
                        model: DLaporanInventarisSekuriti,
                        as: 'dLaporanInventarisSekuriti',
                        where: {idPelapor: {[Op.eq]: user.userJWT.id}}
                    }]
                }else if(cekMutasi !== null){
                    include = [{
                        model: DLaporanDinasSekuriti,
                        as: 'dLaporanDinasSekuriti',
                        where: {idPelapor: {[Op.eq]: user.userJWT.id}}
                    },{
                        model: DLaporanMutasiSekuriti,
                        as: 'dLaporanMutasiSekuriti',
                        where: {idPelapor: {[Op.eq]: user.userJWT.id}}
                    }]
                }else{
                    include = [{
                        model: DLaporanDinasSekuriti,
                        as: 'dLaporanDinasSekuriti',
                        where: {idPelapor: {[Op.eq]: user.userJWT.id}}
                    }]
                }
                const laporans = await HLaporanSekuriti.findOne({
                    where: {id: {[Op.eq]: dinas.HLaporanSekuritiId}},
                    include: include,
                })
                const gudang = await Gudang.findOne({
                    where: {id: {[Op.eq]: laporans.GudangId}}
                })
                laporans.namaGudang = gudang.namaGudang;
                return laporans;
            }catch(err){
                throw err
            }
        },
      },
    Mutation: {
        tambahLaporanDinasSekuriti: async (_,args, {user})=>{
            var {counterTgl, GudangId, shift, status, noHT, keterangan} = args;
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var pad = "000";
                var tglLaporan = dayjs(counterTgl).format('YYYY-MM-DD');
                var idPelapor = user.userJWT.id;
                var counterTglId = dayjs(counterTgl).format('DDMMYYYY');
                var id = "H" + counterTglId;
                var idDLaporan = "D" + counterTglId;
                var laporan = null;
                var cekLaporan = await HLaporanSekuriti.findOne({
                    where: { 
                        id: {[Op.startsWith]: id},
                        shift: {[Op.eq]: shift},
                        GudangId: {[Op.eq]: GudangId}
                    }
                })
                if(cekLaporan === null){
                    cekLaporan = await HLaporanSekuriti.count({
                        where: {
                            id: {[Op.startsWith]: id}
                        }
                    })
                    id += pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();
                    await HLaporanSekuriti.create({
                        id, tanggalLaporan: tglLaporan, GudangId, shift, idKetua: 0, idPenyerah: 0, idPenerima: 0
                    },{ transaction: t});
                }else{
                    id = cekLaporan.id;
                }
                if(status === "Check In"){
                    cekLaporan = await DLaporanDinasSekuriti.findOne({
                        where: {
                            HLaporanSekuritiId: {[Op.startsWith]: id},
                            idPelapor: {[Op.eq]: idPelapor}
                        }
                    })
                    if(cekLaporan !== null){
                        throw new UserInputError('Sudah Melakukan Absen Masuk Dinas',  {errors: `Sudah Melakukan Absen Masuk Dinas Tanggal ${tglLaporan}`} )
                    }
                    cekLaporan = await DLaporanDinasSekuriti.count({
                        where: {
                            id: {[Op.startsWith]: idDLaporan}
                        }
                    })
                    idDLaporan += pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();
                    laporan = await DLaporanDinasSekuriti.create({
                        id: idDLaporan, HLaporanSekuritiId: id, idPelapor, jamMasuk: dayjs(new Date()).format('HH:mm')
                        , jamKeluar: "", noHT, keterangan: "Masuk: "+ keterangan
                    },{transaction: t});
                }else if(status === "Check Out"){
                    cekLaporan = await DLaporanDinasSekuriti.findOne({
                        where: {
                            HLaporanSekuritiId: {[Op.startsWith]: id},
                            idPelapor: {[Op.eq]: idPelapor}
                        }
                    })
                    if(cekLaporan === null){
                        throw new UserInputError('Belum Melakukan Absen Masuk Dinas',  {errors: `Belum Melakukan Absen Masuk Dinas Tanggal ${tglLaporan}`} )
                    }
                    if(cekLaporan.jamKeluar !== ""){
                        throw new UserInputError('Sudah Melakukan Absen Keluar Dinas',  {errors: `Sudah Melakukan Absen Keluar Dinas Tanggal ${tglLaporan}`} )
                    }
                    await DLaporanDinasSekuriti.update({
                        jamKeluar: dayjs(new Date()).format('HH:mm'),
                        keterangan: cekLaporan.keterangan + " Keluar: " + keterangan
                    },{
                        where: {id: {[Op.eq]: cekLaporan.id}},
                        transaction: t
                    })
                }
                await t.commit();
                return laporan;
            }catch(err){
                await t.rollback();
                throw err
            }
        },
        tambahLaporanInventarisSekuriti: async (_,args, {user})=>{
            var {counterTgl, GudangId, shift, inventarisSekuriti} = args;
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var pad = "000";
                var tglLaporan = dayjs(counterTgl).format('YYYY-MM-DD');
                var idPelapor = user.userJWT.id;
                var counterTglId = dayjs(counterTgl).format('DDMMYYYY');
                var id = "H" + counterTglId;
                var idDLaporan = "D" + counterTglId;
                var laporan = null;
                var cekLaporan = await HLaporanSekuriti.findOne({
                    where: { 
                        id: {[Op.startsWith]: id},
                        shift: {[Op.eq]: shift},
                        GudangId: {[Op.eq]: GudangId}
                    }
                })
                if(cekLaporan === null){
                    throw new UserInputError('Belum Absen Masuk Dinas',  {errors: `Belum Absen Masuk Dinas ${tglLaporan}`} )
                }else{
                    id = cekLaporan.id;
                    cekAbsen = await DLaporanDinasSekuriti.findOne({
                        where: {
                            HLaporanSekuritiId: {[Op.startsWith]: id},
                            idPelapor: {[Op.eq]: idPelapor},
                        }
                    })
                    if(cekAbsen === null){
                        throw new UserInputError('Belum Absen Masuk Dinas',  {errors: `Belum Absen Masuk Dinas ${tglLaporan}`} )
                    }
                    if(cekAbsen.jamKeluar !== ""){
                        throw new UserInputError('Sudah Absen Keluar Dinas',  {errors: `Sudah Absen Keluar Dinas ${tglLaporan}`} )
                    }
                }
                /*
                //Untuk tidak bisa masukkan kalau sudah diverifikasi atau diserahkan
                if(cekLaporan.idKetua !== 0 ||cekLaporan.idPenerima !== 0 || cekLaporan.idPenyerah !== 0){
                    throw new UserInputError('Sudah Diverifikasi atau Diserahkan',  {errors: `Sudah Diverifikasi atau Diserahkan`} )
                }*/
                cekLaporan = await DLaporanInventarisSekuriti.count({
                    where: {
                        id: {[Op.startsWith]: idDLaporan}
                    }
                })
                var counterId = cekLaporan;
                var counterIdDLaporan;
                await Promise.all(inventarisSekuriti.map(async element => {
                    counterId = counterId + 1;
                    counterIdDLaporan = idDLaporan + pad.substring(0, pad.length - counterId.toString().length) + counterId.toString();
                    await DLaporanInventarisSekuriti.create({
                        id: counterIdDLaporan, HLaporanSekuritiId: id, idPelapor: idPelapor, namaBarang: element.namaBarang,
                        jumlahBarang: element.jumlahBarang, baik: element.baik, keterangan: element.keterangan
                    },{transaction: t})
                }))
                await t.commit();
                return laporan;
            }catch(err){
                await t.rollback();
                throw err
            }
        },
        tambahLaporanMutasiSekuriti: async (_,args, {user})=>{
            var {counterTgl, GudangId, shift, jamLaporan, uraian, file,keterangan} = args;
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var pad = "000";
                var tglLaporan = dayjs(counterTgl).format('YYYY-MM-DD');
                var idPelapor = user.userJWT.id;
                var counterTglId = dayjs(counterTgl).format('DDMMYYYY');
                var id = "H" + counterTglId;
                var idDLaporan = "D" + counterTglId;
                var laporan = null;
                var cekLaporan = await HLaporanSekuriti.findOne({
                    where: { 
                        id: {[Op.startsWith]: id},
                        shift: {[Op.eq]: shift},
                        GudangId: {[Op.eq]: GudangId}
                    }
                })
                if(cekLaporan === null){
                    throw new UserInputError('Belum Absen Dinas',  {errors: `Belum Absen Dinas ${tglLaporan}`} )
                }else{
                    id = cekLaporan.id;
                    cekAbsen = await DLaporanDinasSekuriti.findOne({
                        where: {
                            HLaporanSekuritiId: {[Op.startsWith]: id},
                            idPelapor: {[Op.eq]: idPelapor}
                        }
                    })
                    if(cekAbsen === null){
                        throw new UserInputError('Belum Absen Dinas',  {errors: `Belum Absen Dinas ${tglLaporan}`} )
                    }
                    if(cekAbsen.jamKeluar !== ""){
                        throw new UserInputError('Sudah Absen Keluar Dinas',  {errors: `Sudah Absen Keluar Dinas ${tglLaporan}`} )
                    }
                }

                cekLaporan = await DLaporanMutasiSekuriti.count({
                    where: {
                        id: {[Op.startsWith]: idDLaporan}
                    }
                })
                idDLaporan += pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();

                if(file === null){
                    laporan = await DLaporanMutasiSekuriti.create({
                        id: idDLaporan, HLaporanSekuritiId: id, idPelapor, jamLaporan, uraian
                        , foto: '-', keterangan
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
                                    laporan = await DLaporanMutasiSekuriti.create({
                                        id: idDLaporan, HLaporanSekuritiId: id, idPelapor, jamLaporan, uraian
                                        , foto, keterangan
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
        updateHLaporanSekuriti: async (_,args,{user})=>{
            var {id, status} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                if(status === "Penyerah"){
                    var laporans = await DLaporanDinasSekuriti.findOne({
                        where: {
                            HlaporanSekuritiId: {[Op.eq]: id},
                            idPelapor: {[Op.eq]: user.userJWT.id}
                        }
                    })
                    if(laporans === null){
                        throw new UserInputError('Belum Absen Dinas',  {errors: `Belum Absen Dinas Laporan Ini`} )
                    }
                    return await HLaporanSekuriti.update({idPenyerah: user.userJWT.id},{
                        where: {id: {[Op.eq]: id}}
                    });
                }else if(status === "Penerima"){
                    var laporans = await HLaporanSekuriti.findOne({
                        where: {
                            id: {[Op.eq]: id}
                        }
                    })
                    if(laporans.shift === "Pagi"){
                        var counterTgl = dayjs(laporans.tanggalLaporan).format('YYYY-MM-DD').toString();
                        var cekLaporan = await HLaporanSekuriti.findOne({
                            where: {
                                tanggalLaporan : {[Op.eq]: counterTgl},
                                shift: {[Op.eq]: "Malam"}
                            }
                        })
                        if(cekLaporan === null){
                            counterTgl = dayjs(laporans.tanggalLaporan).format('DD-MM-YYYY').toString();
                            throw new UserInputError('Belum Absen Dinas',  {errors: `Belum Absen Dinas ${counterTgl} Shift Malam`} )
                        }
                        laporans = await DLaporanDinasSekuriti.findOne({
                            where: {
                                HlaporanSekuritiId: {[Op.eq]: cekLaporan.id},
                                idPelapor: {[Op.eq]: user.userJWT.id}
                            }
                        })
                        if(laporans === null){
                            counterTgl = dayjs(laporans.tanggalLaporan).format('DD-MM-YYYY').toString();
                            throw new UserInputError('Belum Absen Dinas',  {errors: `Belum Absen Dinas ${counterTgl} Shift Malam`} )
                        }
                    }else if(laporans.shift === "Malam"){
                        var counterTgl = dayjs(new Date(laporans.tanggalLaporan)).add(1, 'day');
                        counterTgl = dayjs(counterTgl).format('YYYY-MM-DD').toString();
                        var cekLaporan = await HLaporanSekuriti.findOne({
                            where: {
                                tanggalLaporan : {[Op.eq]: counterTgl},
                                shift: {[Op.eq]: "Pagi"}
                            }
                        })
                        if(cekLaporan === null){
                            counterTgl = dayjs(counterTgl).format('DD-MM-YYYY').toString();
                            throw new UserInputError('Belum Absen Dinas',  {errors: `Belum Absen Dinas ${counterTgl} Shift Pagi`} )
                        }
                        laporans = await DLaporanDinasSekuriti.findOne({
                            where: {
                                HlaporanSekuritiId: {[Op.eq]: cekLaporan.id},
                                idPelapor: {[Op.eq]: user.userJWT.id}
                            }
                        })
                        if(laporans === null){
                            counterTgl = dayjs(counterTgl).format('DD-MM-YYYY').toString();
                            throw new UserInputError('Belum Absen Dinas',  {errors: `Belum Absen Dinas ${counterTgl} Shift Pagi`} )
                        }
                    }
                    return await HLaporanSekuriti.update({idPenerima: user.userJWT.id},{
                        where: {id: {[Op.eq]: id}}
                    });
                }else if(status === "Ketua"){
                    return await HLaporanSekuriti.update({idKetua: user.userJWT.id},{
                        where: {id: {[Op.eq]: id}}
                    });
                }
                return id;
            }catch(err){
                throw err
            }
        },
    }
}