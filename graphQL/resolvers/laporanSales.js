const {HLaporanSales, DLaporanSales, Karyawan, Jabatan, PembagianAnggota,sequelize } = require('../../models');
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
const hlaporansales = require('../../models/hlaporansales');

module.exports={
    Query: {
        getLaporanMasterSales:  async (_,args,{user}) =>{
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
                    var laporanKejadian = banding === 1? true: false;
                    whereHKu.push({
                        laporanKejadian: {[Op.eq]: laporanKejadian}
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
                        idPelapor: {[Op.eq]: karyawan}
                    })
                }
                laporans = await HLaporanSales.findAndCountAll({
                    include: [
                        {
                            model: Karyawan,
                            as: 'ketua',
                        },{
                            model: Karyawan,
                            as: 'karyawan',
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
        getSummarySales: async (_,__,{user}) =>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                
                var date = new Date();
                var y = date.getFullYear(), m = date.getMonth();
                var firstDay = dayjs(new Date(y, m, 1)).format('YYYY-MM-DD');
                var lastDay = dayjs(new Date(y, m + 1, 0)).format('YYYY-MM-DD');
                var getKaryawan = await HLaporanSales.findAll({
                    attributes: ['idPelapor',],
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
                var cekProduksi;
                await Promise.all(getKaryawan.map(async element => {
                    cekProduksi = await HLaporanSales.count({
                        where: {
                            laporanKejadian: {[Op.eq]: true},
                            createdAt: {
                                [Op.between]: [firstDay, lastDay]
                            }
                        }
                    })
                    element.jumlahBanding = cekProduksi;
                    cekProduksi = await DLaporanSales.count({
                        include: [{
                            model: HLaporanSales,
                            as: 'hLaporanSales',
                            attributes: [],
                            where: {
                                idPelapor: {[Op.eq]: element.idPelapor},
                                createdAt: {
                                    [Op.between]: [firstDay, lastDay]
                                }
                            }
                        }],
                        where: {
                            jamKeluar: {[Op.ne]: '-'}
                        }
                    })
                    element.jumlahProduksi = cekProduksi;
                }))
                return getKaryawan;
            }catch(err){
                throw err
            }
        },
        getLaporansSales: async (_,args,{user}) =>{
            var {status, page, limit} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans;
                var laporanBaru = [];
                var cekKaryawan;
                var namaKaryawan;
                page -= 1;
                var offset = page ? page * limit: 0;
                if(status === 0){
                    laporans = await DLaporanSales.findAndCountAll({
                        include: [{
                            model: HLaporanSales,
                            as: 'hLaporanSales',
                            where: {
                                idPelapor: {[Op.eq]: user.userJWT.id}
                            }
                        }],
                        where: {jamKeluar: {[Op.eq]: "-"}},
                        limit: limit
                        ,offset: offset
                        ,order: [['createdAt','DESC']]
                    });
                }else{
                    laporans = await DLaporanSales.findAndCountAll({
                        include: [{
                            model: HLaporanSales,
                            as: 'hLaporanSales',
                            where: {
                                idPelapor: {[Op.eq]: user.userJWT.id},
                                status: {[Op.eq]: status}
                            }
                        }],
                        where: {jamKeluar: {[Op.eq]: "-"}},
                        limit: limit,
                        offset: offset,
                        order: [['createdAt','DESC']]
                    });
                }
                var laporan = {};
                laporan.count = laporans.count;
                await Promise.all(laporans.rows.map(async element =>
                { 
                    counterHLaporan = await HLaporanSales.findOne({
                        where: {id: {[Op.eq]: element.HLaporanSalesId}}
                    })
                    namaKaryawan = "-";
                    if(counterHLaporan.idKetua !== 0){
                        cekKaryawan = await Karyawan.findOne({
                            where: {id: {[Op.eq]: counterHLaporan.idPelapor}}
                        })
                        namaKaryawan = cekKaryawan.nama;
                    }
                    element.namaPelapor = namaKaryawan;
                    element.status = counterHLaporan.status;
                    laporanBaru.push(element);
                }))
                laporan.rows = laporanBaru;
                return laporan;
            }catch(err){
                throw err
            }
        },
        getHLaporansSales: async (_,args,{user}) =>{
            var {status, page, limit} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporanBaru = [];
                page -= 1;
                var offset = page ? page * limit: 0;
                var cekKaryawan;
                var jabatan = await Jabatan.findOne({
                    where: { id: {[Op.eq]: user.userJWT.idJabatan}}
                })
                var laporans;
                if(jabatan.tingkatJabatan === 5){
                    if(status === 0){
                        laporans = await HLaporanSales.findAndCountAll({
                            where: {idPelapor: {[Op.eq]: user.userJWT.id}},
                            limit: limit,
                            offset: offset,
                            order: [['createdAt','DESC']]
                        });
                    }else{
                        laporans = await HLaporanSales.findAndCountAll({
                            where: {
                                idPelapor: {[Op.eq]: user.userJWT.id},
                                status: {[Op.eq]: status}
                            },
                            limit: limit,
                            offset: offset,
                            where: {
                                status: {[Op.eq]: status}
                            }
                            ,order: [['createdAt','DESC']]
                        });
                    }
                    var laporan = {};
                    laporan.count = laporans.count;
                    await Promise.all(laporans.rows.map(async (element) =>
                    { 
                        //Cek apakah divisi dari anggota yang request sudah sesuai apa belum
                        if(element.idKetua !== 0){
                            cekKaryawan = await Karyawan.findOne({
                                where: {id: {[Op.eq]: element.idPelapor}}
                            })
                            element.namaPelapor = cekKaryawan.nama;
                        }else{
                            element.namaPelapor = "-";
                        }
                        laporanBaru.push(element);
                    }))
                }else if(jabatan.tingkatJabatan === 4){
                    if(status === 0){
                        laporans = await HLaporanSales.findAndCountAll({
                            limit: limit,
                            offset: offset,
                            order: [['createdAt','DESC']]
                        });
                    }else{
                        laporans = await HLaporanSales.findAndCountAll({
                            where: {
                                status: {[Op.eq]: status}
                            },
                            limit: limit,
                            offset: offset,
                            where: {
                                status: {[Op.eq]: status}
                            }
                            ,order: [['createdAt','DESC']]
                        });
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
                }
                laporan.rows = laporanBaru;
                return laporan;
            }catch(err){
                throw err
            }
        },
        getDLaporanSales: async (_,args,{user}) =>{
            var {id} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                return await DLaporanSales.findAll({
                    where: {HLaporanSalesId: {[Op.eq]: id}},
                    order: [['createdAt','DESC']]
                });
            }catch(err){
                throw err
            }
        },
      },
    Mutation: {
        //General

        //HRD
        tambahLaporanSales: async (_,args, {user})=>{
            var { namaToko, file, keterangan } = args;
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var idPelapor = user.userJWT.id;
                var counterTgl = dayjs(new Date()).format('DDMMYYYY');
                var id = "H" + counterTgl;
                var idDLaporan = "D" + counterTgl;
                var jamMasuk = dayjs(new Date()).format('HH:mm');
                var status = 1;
                var keteranganKejadian = "";
                var laporan = null;
                var laporanKejadian = false;
                var cekLaporan = await HLaporanSales.findOne({
                    where: { 
                        id: {[Op.startsWith]: id},
                        idPelapor: {[Op.eq]: idPelapor}
                    }
                })
                if(cekLaporan !== null){
                    id = cekLaporan.id;
                }else{
                    cekLaporan = await HLaporanSales.count({
                        id: {[Op.startsWith]: id}
                    })
                    id += cekLaporan;
                    await HLaporanSales.create({
                        id, idPelapor, idKetua: 0,status, laporanKejadian, keteranganKejadian, feedbackKaryawan: ""
                    },{ transaction: t});
                }

                
                cekLaporan = await DLaporanSales.count({
                    where: {
                        id: {[Op.startsWith]: idDLaporan}
                    }
                })
                idDLaporan += cekLaporan;

                if(file === null){
                    laporan = await DLaporanSales.create({
                        id: idDLaporan,HLaporanSalesId: id, namaToko, foto: '-', keterangan, jamMasuk,
                        jamKeluar: "-"
                    },{transaction: t});
                }else{
                    const { createReadStream, filename, mimetype, encoding } = await file;

                    const { ext } = path.parse(filename);
                    var namaFile = idDLaporan + ext;

                    const storeUpload = async ({ stream, filename, mimetype, encoding }) => {
                        const pathName = path.join(__dirname, `../../public/laporan/Sales/${namaFile}`)
                    
                        return new Promise( (resolve, reject) =>
                            stream
                                .pipe(fs.createWriteStream(pathName))
                                .on("finish",async () => { 
                                    var foto = `http://localhost:4000/laporan/Sales/${namaFile}`
                                    laporan = await DLaporanSales.create({
                                        id: idDLaporan,HLaporanSalesId: id, namaToko, foto, keterangan, jamMasuk,
                                        jamKeluar: "-"
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
        updateCheckOutLaporanSales: async (_,args,{user})=>{
            var {id, keterangan} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans = await DLaporanSales.findOne({
                    where: {id: {[Op.eq]: id}}
                })
                var jamKeluar = dayjs(new Date()).format('HH:mm');
                return await DLaporanSales.update({keterangan: laporans.keterangan + " Keluar:"+keterangan, jamKeluar: jamKeluar},{
                    where: {id: {[Op.eq]: id}}
                });
            }catch(err){
                throw err
            }
        },
        updateStatusLaporanSales: async (_,args,{user})=>{
            var {id, status} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                return await HLaporanSales.update({status: status, idKetua: user.userJWT.id},{
                    where: {id: {[Op.eq]: id}}
                });
            }catch(err){
                throw err
            }
        },
        updateKeteranganKejadian: async (_,args,{user})=>{
            var {id, keteranganKejadian} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                return await HLaporanSales.update({laporanKejadian: true, keteranganKejadian: keteranganKejadian},{
                    where: {id: {[Op.eq]: id}}
                });
            }catch(err){
                throw err
            }
        },
        updateFeedback: async (_,args,{user})=>{
            var {id, feedbackKaryawan} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                return await HLaporanSales.update({feedbackKaryawan: feedbackKaryawan},{
                    where: {id: {[Op.eq]: id}}
                });
            }catch(err){
                throw err
            }
        },
    }
}