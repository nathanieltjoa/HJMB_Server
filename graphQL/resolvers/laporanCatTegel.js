const {HLaporanCatTegel, DLaporanCatTegel, ULaporanCatTegel, Karyawan, Jabatan, sequelize } = require('../../models');
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
        getLaporanMasterCatTegel: async (_,args,{user}) =>{
            var {merk, orderBy, bulan, status, banding, page, limit} = args;
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
                if(orderBy === "Laporan Terbaru"){
                    orderKu= [
                        ["createdAt", "DESC"]
                    ]
                }else if(orderBy === "Laporan Terlama"){
                    orderKu= [
                        ["createdAt", "ASC"]
                    ]
                }
                if(merk !== ""){
                    whereDKu.push({
                        merkProduk: {[Op.eq]: merk}
                    })
                }
                laporans = await DLaporanCatTegel.findAndCountAll({
                    include: [{
                        model: HLaporanCatTegel,
                        as: 'hLaporanCatTegel',
                        include: [
                            {
                                model: Karyawan,
                                as: 'karyawan',
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
                throw err
            }
        },
        getListMerkCatTegel: async (_,__,{user}) =>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans = await DLaporanCatTegel.findAll({
                    attributes: ['merkProduk'],
                    group: ['merkProduk']
                });
                return laporans;
            }catch(err){
                throw err
            }
        },
        getLaporanCatTegel: async (_,args,{user}) =>{
            var {jenisProduk, page, limit} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans;
                var laporanBaru = [];
                page -= 1;
                var offset = page ? page * limit: 0;
                var cekKaryawan;
                var namaKaryawan;
                if(jenisProduk === "0"){
                    laporans = await DLaporanCatTegel.findAndCountAll({
                        limit: limit,
                        offset: offset,
                        order: [['createdAt','DESC']]
                    });
                }else{
                    laporans = await DLaporanCatTegel.findAndCountAll({
                        include: [{
                            model: HLaporanCatTegel,
                            as: 'hLaporanCatTegel',
                            where: {
                                jenisProduk: {[Op.eq]: jenisProduk}
                            }
                        }],
                        limit: limit,
                        offset: offset,
                        order: [['createdAt','DESC']]
                    });
                }
                var laporan = {};
                laporan.count = laporans.count;
                await Promise.all(laporans.rows.map(async element =>
                { 
                    counterHLaporan = await HLaporanCatTegel.findOne({
                        where: {id: {[Op.eq]: element.HLaporanCatTegelId}}
                    })
                    namaKaryawan = "-";
                    if(counterHLaporan.idPelapor !== 0){
                        cekKaryawan = await Karyawan.findOne({
                            where: {id: {[Op.eq]: counterHLaporan.idPelapor}}
                        })
                        namaKaryawan = cekKaryawan.nama;
                    }
                    element.namaPelapor = namaKaryawan;
                    element.jenisProduk = counterHLaporan.jenisProduk;
                    laporanBaru.push(element);
                }))
                laporan.rows = laporanBaru;
                return laporan;
            }catch(err){
                throw err
            }
        },
        getULaporanCatTegel: async (_,args,{user}) =>{
            var {id} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans = await ULaporanCatTegel.findAll({
                        where: {
                            DLaporanCatTegelId: {[Op.eq]: id},
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

        //HRD
        tambahLaporanKetuaCatTegel: async (_,args, {user})=>{
            var {jenisProduk, merkProduk, warna, jumlahProduk, satuanProduk, file, keterangan, bahanCatTegel} = args;
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
                var khusus = 0;
                var laporan = null;
                
                var cekLaporan = await HLaporanCatTegel.findOne({
                    where: { 
                        id: {[Op.startsWith]: id},
                        jenisProduk: {[Op.eq]: jenisProduk}
                    }
                })
                if(cekLaporan === null) {
                    cekLaporan = await HLaporanCatTegel.count({
                        where: {
                            id: {[Op.startsWith]: id}
                        }
                    })
                    id += pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();
                    await HLaporanCatTegel.create({
                        id, idPelapor, jenisProduk
                    },{ transaction: t});
                }else{
                    id = cekLaporan.id;
                }

                
                cekLaporan = await DLaporanCatTegel.count({
                    where: {
                        id: {[Op.startsWith]: idDLaporan}
                    }
                })
                var counterId = parseInt(cekLaporan) + 1;
                idDLaporan = idDLaporan + pad.substring(0, pad.length - counterId.toString().length) + counterId.toString();

                if(file === null){
                    await DLaporanCatTegel.create({
                        id: idDLaporan, HLaporanCatTegelId: id, merkProduk,
                        warna, jumlahProduk, satuanProduk, foto: '-', keterangan, khusus
                    },{transaction: t})
                }else{
                    const { createReadStream, filename, mimetype, encoding } = await file;

                    const { ext } = path.parse(filename);
                    var namaFile = idDLaporan + ext;

                    const storeUpload = async ({ stream, filename, mimetype, encoding }) => {
                        const pathName = path.join(__dirname, `../../public/laporan/Cat Tegel/${namaFile}`)
                    
                        return new Promise( (resolve, reject) =>
                            stream
                                .pipe(fs.createWriteStream(pathName))
                                .on("finish",async () => {
                                    var foto = `http://localhost:4000/laporan/Cat Tegel/${namaFile}`
                                    await DLaporanCatTegel.create({
                                        id: idDLaporan, HLaporanCatTegelId: id, merkProduk,
                                        warna, jumlahProduk, satuanProduk, foto, keterangan, khusus
                                    },{transaction: t})
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

                var counterId = 0;
                var counterIdDLaporan = idDLaporan.replace('D', 'U');
                var idULaporan;
                await Promise.all(bahanCatTegel.map(async element => {
                    counterId = counterId + 1;
                    idULaporan = counterIdDLaporan + pad.substring(0, pad.length - counterId.toString().length) + counterId.toString();
                    await ULaporanCatTegel.create({
                        id: idULaporan, DLaporanCatTegelId: idDLaporan, namaBahan: element.namaBahan,
                         jumlahBahan: element.jumlahBahan, satuanBahan: element.satuanBahan, diHapus: false
                    },{transaction: t})
                }));

                t.commit();
                return laporan;
            }catch(err){
                t.rollback();
                throw err
            }
        },
        updateLaporanKetuaCatTegel: async (_,args,{user})=>{
            var {id, merkProduk, warna, jumlahProduk, satuanProduk, keterangan, bahanCatTegel} = args;
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporan = null;
                await DLaporanCatTegel.update({
                    merkProduk: merkProduk,
                    warna: warna,
                    jumlahProduk: jumlahProduk,
                    satuanProduk: satuanProduk,
                    keterangan: keterangan
                },{
                    where: {id: {[Op.eq]: id}},
                    transaction: t
                })
                var counterId = id.replace('D','U').slice(0,9);
                var cekLaporan = await ULaporanCatTegel.count({
                    where: {
                        id: {[Op.startsWith]: counterId}
                    }
                })
                var counterIdULaporan;
                await Promise.all(bahanCatTegel.map( async element => {
                    if(element.baru === true){
                        cekLaporan += 1;
                        counterIdULaporan = counterId + pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();
                        await ULaporanCatTegel.create({
                            id: counterIdULaporan, DLaporanCatTegelId: id, namaBahan: element.namaBahan,
                            jumlahBahan: element.jumlahBahan, satuanBahan: element.satuanBahan, 
                            diHapus : false
                        },{transaction: t})
                    }
                    else if(element.action === 'hapus'){
                        await ULaporanCatTegel.update({
                            diHapus: true,
                        },{
                            where: {id: {[Op.eq]: element.id}},
                            transaction: t
                        })
                    }
                    else if(element.action === 'edit'){
                        await ULaporanCatTegel.update({
                            namaBahan: element.namaBahan,
                            jumlahBahan: element.jumlahBahan,
                            satuanBahan: element.satuanBahan,
                        },{
                            where: {id: {[Op.eq]: element.id}},
                            transaction: t
                        })
                    }
                }))
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