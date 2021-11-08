const { HLaporanArmada, DLaporanArmada, LaporanKeluarMasukPipa, LaporanStok ,Karyawan, Jabatan, sequelize, PembagianAnggota,User } = require('../../models');
const {Op} = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { UserInputError, AuthenticationError} = require('apollo-server-express');
const {JWT_SECRET} = require('../../config/env.json')
const dayjs = require('dayjs');
const Sequelize = require('sequelize');
const path = require('path');
const fs = require('fs');
const e = require('express');

module.exports={
    Query: {
        //general
        getLaporanMasterArmada:  async (_,args,{user}) =>{
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
                    whereHKu.push({
                        idSupir: {[Op.eq]: karyawan}
                    })
                }
                laporans = await HLaporanArmada.findAndCountAll({
                    include: [
                        {
                            model: Karyawan,
                            as: 'armada',
                        },
                        {
                            model: Karyawan,
                            as: 'stokist',
                        },
                        {
                            model: Karyawan,
                            as: 'supir',
                        },
                        {
                            model: Karyawan,
                            as: 'kernet',
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
        getSummaryArmada: async (_,__,{user}) =>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                
                var date = new Date();
                var y = date.getFullYear(), m = date.getMonth();
                var firstDay = dayjs(new Date(y, m, 1)).format('YYYY-MM-DD');
                var lastDay = dayjs(new Date(y, m + 1, 0)).format('YYYY-MM-DD');
                var getKaryawan = await HLaporanArmada.findAll({
                    attributes: [
                        'idSupir',
                        [sequelize.fn('count', sequelize.col('status')), 'jumlahPengantaran'],
                    ],
                    include:{
                        model: Karyawan,
                        as: 'supir',
                        attributes: ['nama']
                    },
                    where: {
                        createdAt: {
                            [Op.between]: [firstDay, lastDay]
                        }
                    },
                    order: sequelize.literal('jumlahPengantaran DESC'),
                    group: ['idSupir']
                })
                await Promise.all(getKaryawan.map(async element => {
                    element.jumlahPengantaran = element.dataValues.jumlahPengantaran;
                }))
                return getKaryawan;
            }catch(err){
                throw err
            }
        },
        getAnggotaArmada: async (_,args,{user}) =>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var karyawanBaru = [];
                var karyawan;
                var jabatans = await Jabatan.findOne({
                    where: {
                        namaJabatan: {[Op.eq]: 'Armada'},
                        tingkatJabatan: {[Op.eq]: 5}
                    }
                })
                var users = await User.findAll({
                    where: {
                        idJabatan: {[Op.eq]: jabatans.id}
                    }
                })
                await Promise.all(users.map(async element => {
                    karyawan = await Karyawan.findOne({
                        where: {id: {[Op.eq]: element.id}}
                    })
                    karyawanBaru.push(karyawan);
                }))
                return karyawanBaru;
            }catch(err){
                throw err
            }
        },
        getLaporansKetuaArmada: async (_,args,{user}) =>{
            var {status, page, limit} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var cekJabatan = await Jabatan.findOne({
                    where: {id: {[Op.eq]: user.userJWT.idJabatan}}
                })
                var laporans;
                var laporanBaru = [];
                page -= 1;
                var offset = page ? page * limit: 0;
                var cekKaryawan;
                var idPelapor;
                if(status === 0){
                    laporans = await HLaporanArmada.findAndCountAll({
                        limit: limit,
                        offset: offset,
                        order: [['createdAt','DESC']]
                    });
                }else{
                    laporans = await HLaporanArmada.findAndCountAll({
                        where: {status: {[Op.eq]: status}},
                        limit: limit,
                        offset: offset,
                        order: [['createdAt','DESC']]
                    });
                }
                var laporan = {};
                laporan.count = laporans.count;
                await Promise.all(laporans.rows.map(async (element) =>
                { 
                    //Cek apakah divisi dari anggota yang request sudah sesuai apa belum
                    cekJabatan.namaJabatan === 'Stokist Pipa'? 
                        idPelapor = element.idArmada: 
                        idPelapor = element.idStokist
                    cekKaryawan = await Karyawan.findOne({
                        where: {id: {[Op.eq]: idPelapor}}
                    })
                    element.namaPelapor = cekKaryawan === null ? "-" : cekKaryawan.nama;
                    cekKaryawan = await Karyawan.findOne({
                        where: {id: {[Op.eq]: element.idSupir}}
                    })
                    element.namaSupir = cekKaryawan === null ? "-" :  cekKaryawan.nama;
                    cekKaryawan = await Karyawan.findOne({
                        where: {id: {[Op.eq]: element.idKernet}}
                    })
                    element.namaKernet = cekKaryawan === null ? "-" :  cekKaryawan.nama;
                    laporanBaru.push(element);
                }))
                laporan.rows = laporanBaru;
                return laporan;
            }catch(err){
                throw err
            }
        },
        getDLaporanKetuaArmada: async (_,args,{user}) =>{
            var {id} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans = await DLaporanArmada.findAll({
                        where: {
                            HLaporanArmadaId: {[Op.eq]: id},
                            diHapus: {[Op.eq]: false}
                        }
                        ,order: [['createdAt','DESC']]
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
        tambahLaporanKetuaArmada: async (_,args, {user})=>{
            var {idNota, idSupir, idKernet, penerima, dLaporanArmada, file, keterangan} = args;
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var pad = "000";
                var tgl = new Date();
                var tglLaporan = dayjs(tgl).format('DDMMYYYY');
                var counterTgl = dayjs(tgl).format('YYYY-MM-DD');
                var idArmada = user.userJWT.id;
                var id = "H" + tglLaporan;
                var idDLaporan = "D" + tglLaporan;
                var status = 1;
                var laporan = null;

                var cekLaporan = await HLaporanArmada.count({
                    where: {
                        id: {[Op.startsWith]: id}
                    }
                })
                id += pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();

                if(file === null){
                    cekLaporan = await HLaporanArmada.findOne({
                        where: { 
                            idNota: {[Op.eq]: idNota}
                        }
                    })
                    if(cekLaporan === null) {
                        var counterPengantaran = new Date('0000-00-00 00:00:00')
                        const hLaporan = await HLaporanArmada.create({
                            id, idNota, idArmada, idStokist: 0, idSupir, idKernet, 
                            keterangan, penerima, foto: '-', status, pengantaran: counterPengantaran, 
                            kembali: counterPengantaran
                        },{ transaction: t});
                    }else{
                        throw new UserInputError('Sudah ada laporan untuk nota ini',  {errors: `Sudah Ada Laporan Untuk Nota ${idNota}`} )
                    }
                    cekLaporan = await DLaporanArmada.count({
                        where: {
                            id: {[Op.startsWith]: idDLaporan}
                        }
                    })
                    var counterId = cekLaporan;
                    var counterIdDLaporan;
                    await Promise.all(dLaporanArmada.map(async element => {
                        counterId = counterId + 1;
                        counterIdDLaporan = idDLaporan + pad.substring(0, pad.length - counterId.toString().length) + counterId.toString();
                        await DLaporanArmada.create({
                            id: counterIdDLaporan, HLaporanArmadaId: id, merkBarang: 
                            element.merkBarang, tipeBarang: element.tipeBarang, ukuranBarang: 
                            element.ukuranBarang, jumlahBarang: element.jumlahBarang, satuanBarang:
                            'Batang', diHapus: false
                        },{transaction: t})
                    }));
                }else{
                    const { createReadStream, filename, mimetype, encoding } = await file;

                    const { ext } = path.parse(filename);
                    var namaFile = id + ext;

                    const storeUpload = async ({ stream, filename, mimetype, encoding }) => {
                        const pathName = path.join(__dirname, `../../public/laporan/Armada/${namaFile}`)
                    
                        return new Promise( (resolve, reject) =>
                            stream
                                .pipe(fs.createWriteStream(pathName))
                                .on("finish",async () => {
                                    var foto = `http://localhost:4000/laporan/Armada/${namaFile}`
                                    var cekLaporan = await HLaporanArmada.findOne({
                                        where: { 
                                            idNota: {[Op.eq]: idNota}
                                        }
                                    })
                                    if(cekLaporan === null) {
                                        var counterPengantaran = new Date('0000-00-00 00:00:00')
                                        const hLaporan = await HLaporanArmada.create({
                                            id, idNota, idArmada, idStokist: 0, idSupir, idKernet, 
                                            keterangan, penerima, foto, status, pengantaran: counterPengantaran, 
                                            kembali: counterPengantaran
                                        },{ transaction: t});
                                    }else{
                                        throw new UserInputError('Sudah ada laporan untuk nota ini',  {errors: `Sudah Ada Laporan Untuk Nota ${idNota}`} )
                                    }
                                    cekLaporan = await DLaporanArmada.count({
                                        where: {
                                            id: {[Op.startsWith]: idDLaporan}
                                        }
                                    })
                                    var counterId = cekLaporan;
                                    var counterIdDLaporan;
                                    await Promise.all(dLaporanArmada.map(async element => {
                                        counterId = counterId + 1;
                                        counterIdDLaporan = idDLaporan + pad.substring(0, pad.length - counterId.toString().length) + counterId.toString();
                                        await DLaporanArmada.create({
                                            id: counterIdDLaporan, HLaporanArmadaId: id, merkBarang: 
                                            element.merkBarang, tipeBarang: element.tipeBarang, ukuranBarang: 
                                            element.ukuranBarang, jumlahBarang: element.jumlahBarang, satuanBarang:
                                            'Batang', diHapus: false
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
        updateLaporanKetuaArmada: async (_,args,{user})=>{
            var {id, idSupir, idKernet, keterangan, penerima, dLaporanArmada} = args;
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var counterId = id.replace('H','D').slice(0,9);
                var cekLaporan = await DLaporanArmada.count({
                    where: {
                        id: {[Op.startsWith]: counterId}
                    }
                })
                var counterIdDLaporan;
                await Promise.all(dLaporanArmada.map(async (element) => {
                    if(element.baru === true){
                        cekLaporan += 1;
                        counterIdDLaporan = counterId + pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();
                        await DLaporanArmada.create({
                            id: counterIdDLaporan, HLaporanArmadaId: id, merkBarang: element.merkBarang,
                            tipeBarang: element.tipeBarang, ukuranBarang: element.ukuranBarang, 
                            jumlahBarang: element.jumlahBarang, satuanBarang: 'Batang', diHapus : false
                        },{transaction: t})
                    }
                    else if(element.action === 'hapus'){
                        await DLaporanArmada.update({
                            diHapus: true,
                        },{
                            where: {id: {[Op.eq]: element.id}},
                            transaction: t
                        })
                    }else if(element.action === 'edit'){
                        await DLaporanArmada.update({
                            merkBarang: element.merkBarang,
                            tipeBarang: element.tipeBarang,
                            ukuranBarang: element.ukuranBarang,
                            jumlahBarang: element.jumlahBarang,
                        },{
                            where: {id: {[Op.eq]: element.id}},
                            transaction: t
                        })
                    }
                }))
                var laporan = await HLaporanArmada.update({
                    penerima: penerima,
                    idSupir: idSupir,
                    idKernet: idKernet,
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
        updateStatusLaporanArmada: async (_,args,{user})=>{
            var {id, status, penerima} = args;
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                if(status === 2){
                    var pad = "000";
                    var laporans = await HLaporanArmada.update({
                        status: status,
                        idStokist: user.userJWT.id
                    },{
                        where: {id: {[Op.eq]: id}},
                        transaction: t
                    })
                    laporans = await HLaporanArmada.findOne({
                        where: {id: {[Op.eq]: id}}
                    })
                    var dLaporan = await DLaporanArmada.findAll({
                        where: {
                            HLaporanArmadaId: {[Op.eq]: id},
                            diHapus: false,
                        }
                    })
                    var cekLaporan;
                    var barang;
                    var laporanStok;
                    var namaBarang;
                    var jumlahBarang;
                    var tgl = new Date();
                    var tglLaporan = dayjs(tgl).format('DDMMYYYY');
                    var counterId = "L" + tglLaporan;
                    var idLaporanKMPipa;
                    cekLaporan = await LaporanKeluarMasukPipa.count({
                        where: {id: {[Op.startsWith]: counterId}}
                    })
                    var error = false;
                    await Promise.all(dLaporan.map(async (element)=> {
                        barang = await LaporanStok.findOne({
                            where: {
                                jenisBarang: {[Op.eq]: "Pipa"},
                                merkBarang: {[Op.eq]: element.merkBarang},
                                tipeBarang: {[Op.eq]: element.tipeBarang},
                                ukuranBarang: {[Op.eq]: element.ukuranBarang}
                            }
                        })
                        if(barang === null){
                            error = true;
                            namaBarang = element.merkBarang + " " + element.tipeBarang + " " + element.ukuranBarang;
                            throw new UserInputError(`${namaBarang} Belum Terdaftar Di Gudang`,  {errors: `${namaBarang} Belum Terdaftar Di Gudang`} )
                        }else{
                            namaBarang = element.merkBarang + " " + element.tipeBarang + " " + element.ukuranBarang;
                            jumlahBarang = parseInt(barang.jumlahBarang) - parseInt(element.jumlahBarang);
                            if(jumlahBarang < 0){
                                error = true;
                                throw new UserInputError(`${namaBarang} Tidak Mencukupi`,  {errors: `${namaBarang} Tidak Mencukupi Stok`} )
                            }
                            await LaporanStok.update({
                                jumlahBarang: jumlahBarang
                            },{
                                where: {id: {[Op.eq]: barang.id}},
                                transaction: t
                            })
                        }
                        cekLaporan += 1;
                        idLaporanKMPipa = counterId + pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();
                        await LaporanKeluarMasukPipa.create({
                            id: idLaporanKMPipa, LaporanStokId: barang.id, terimaLaporan: penerima + ` (Id Nota: ${laporans.idNota})`,
                             jenisLaporan: 'keluar', jumlahLaporan: element.jumlahBarang
                        },{transaction: t})
                        cekLaporan = cekLaporan + 1;
                    }))
                }else if(status === 3){
                    var laporans = await HLaporanArmada.update({
                        status: status,
                        pengantaran: new Date()
                    },{
                        where: {id: {[Op.eq]: id}},
                        transaction: t
                    })
                }else if(status === 4){
                    var laporans = await HLaporanArmada.update({
                        status: status,
                        kembali: new Date()
                    },{
                        where: {id: {[Op.eq]: id}},
                        transaction: t
                    })
                }
                t.commit()
                return laporans;
            }catch(err){
                t.rollback();
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