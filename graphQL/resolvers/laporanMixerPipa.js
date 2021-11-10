const { LaporanMixerPipa, Karyawan, Jabatan, PembagianAnggota,sequelize } = require('../../models');
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
        getLaporanMasterMixerPipa:  async (_,args,{user}) =>{
            var {karyawan, orderBy, bulan, status, banding, page, limit} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans;
                var offset = page ? page * limit: 0;


                var orderKu =[];
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
                    whereDKu.push({
                        idPelapor: {[Op.eq]: cekLaporan.idKaryawan}
                    })
                }
                laporans = await LaporanMixerPipa.findAndCountAll({
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
                    where: whereDKu
                });
                return laporans;
            }catch(err){
                throw err
            }
        },
        getSummaryMixerPipa: async (_,__,{user}) =>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                
                var date = new Date();
                var y = date.getFullYear(), m = date.getMonth();
                var firstDay = dayjs(new Date(y, m, 1)).format('YYYY-MM-DD');
                var lastDay = dayjs(new Date(y, m + 1, 0)).format('YYYY-MM-DD');
                var getKaryawan = await LaporanMixerPipa.findAll({
                    attributes: [
                        'idPelapor',
                        [sequelize.fn('sum', sequelize.col('totalHasil')), 'jumlahProduksi'],
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
                    cekProduksi = await LaporanMixerPipa.count({
                        where: {
                            pernahBanding: {[Op.eq]: true},
                            idPelapor: {[Op.eq]: element.idPelapor},
                            createdAt: {
                                [Op.between]: [firstDay, lastDay]
                            }
                        }
                    })
                    element.jumlahBanding = cekProduksi;
                    element.jumlahProduksi = element.dataValues.jumlahProduksi;
                    cekProduksi = await LaporanMixerPipa.count({
                        where: {
                            totalHasil: {[Op.lt]: sequelize.col('targetMixer')},
                            idPelapor: {[Op.eq]: element.idPelapor},
                            createdAt: {
                                [Op.between]: [firstDay, lastDay]
                            }
                        }
                    })
                    element.tidakCapaiTarget = cekProduksi;
                }))
                return getKaryawan;
            }catch(err){
                throw err
            }
        },
        getLaporans: async (_,args,{user}) =>{
            var {status, page, limit} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporans;
                var laporanBaru = [];
                page -= 1;
                var laporan = {};
                var offset = page ? page * limit: 0;
                var cekKaryawan;
                var namaKaryawan;
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
                        laporans = await LaporanMixerPipa.findAndCountAll({
                            where: { idPelapor: {[Op.eq]: cekLaporan.idKaryawan} },
                            limit: limit,
                            offset: offset,
                            order: [['createdAt','DESC']]
                        })
                    }else{
                        laporans = await LaporanMixerPipa.findAndCountAll({
                            where: { 
                                status: {[Op.eq]: status},
                                idPelapor: {[Op.eq]: cekLaporan.idKaryawan}
                            },
                            limit: limit,
                            offset: offset,
                            order: [['createdAt','DESC']]
                        })
                    }
                    await Promise.all(laporans.rows.map(async (element) =>
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
                        laporans = await LaporanMixerPipa.findAndCountAll({
                            limit: limit,
                            offset: offset,
                            order: [['createdAt','DESC']]
                        })
                    }else{
                        laporans = await LaporanMixerPipa.findAndCountAll({
                            where: { status: {[Op.eq]: status}},
                            limit: limit,
                            offset: offset,
                            order: [['createdAt','DESC']]
                        })
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
                return laporans;
            }catch(err){
                throw err
            }
        }
        //HRD
        //Direktur
        //Staf Keuangan
        //Ketua Divisi
        //Anggota Divisi
      },
    Mutation: {
        //General

        //HRD
        tambahLaporan: async (_,args, {user})=>{
            var {tipeMesin, bahanDigunakan, totalHasil, targetMixer, file, keterangan} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                
                var cekLaporan = await PembagianAnggota.findOne({
                    where: {idKaryawan: {[Op.eq]: user.userJWT.id}}
                })

                if(cekLaporan.ketua === false){
                    throw new UserInputError('Error',  {errors: `Akun Anda Tidak Memiliki Hak Untuk Buat Laporan`} )
                }
                var pad = "000"

                var tanggalLaporan = new Date();
                tanggalLaporan = await dayjs(tanggalLaporan).format('YYYY-MM-DD');
                var cekLaporan = await LaporanMixerPipa.findOne({
                    where: { 
                        createdAt: {[Op.startsWith]: tanggalLaporan},
                        tipeMesin: {[Op.eq]: tipeMesin}
                    }
                })
                if(cekLaporan !== null){
                    throw new UserInputError('Tidak Bisa Menambah Laporan Lagi',  {errors: `Sudah Ada Laporan Masuk Untuk ${tipeMesin} Hari Ini`} )
                }
                var counterTgl = dayjs(new Date()).format('DDMMYYYY');
                var id = "H" + counterTgl;
                var idPelapor = user.userJWT.id;
                var idKetua = 0;
                var status = 1;
                var keteranganBanding = "";
                var laporan = null;
                var pernahBanding = false;

                cekLaporan = await LaporanMixerPipa.count({
                    where: {
                        createdAt: {[Op.startsWith]: tanggalLaporan},
                    }
                })
                id += pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();
                
                if(file === null){
                    laporan = await LaporanMixerPipa.create({
                        id, tipeMesin, bahanDigunakan, totalHasil, targetMixer, 
                        foto: '-', keterangan, idPelapor, idKetua, status, pernahBanding, keteranganBanding
                    })
                }else{
                    const { createReadStream, filename, mimetype, encoding } = await file;

                    const { ext } = path.parse(filename);
                    var namaFile = id + ext;

                    const storeUpload = async ({ stream, filename, mimetype, encoding }) => {
                        const pathName = path.join(__dirname, `../../public/laporan/Mixer Pipa/${namaFile}`)
                    
                        return new Promise( (resolve, reject) =>
                            stream
                                .pipe(fs.createWriteStream(pathName))
                                .on("finish",async () => { 
                                    var foto = `http://localhost:4000/laporan/Mixer Pipa/${namaFile}`
                                    laporan = await LaporanMixerPipa.create({
                                        id, tipeMesin, bahanDigunakan, totalHasil, targetMixer, 
                                        foto, keterangan, idPelapor, idKetua, status, pernahBanding, keteranganBanding
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
                
                
                return laporan;
            }catch(err){
                throw err
            }
        },
        updateLaporan: async (_,args,{user}) =>{
            var {id, tipeMesin, bahanDigunakan, totalHasil, keterangan} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                
                var cekLaporan = await LaporanMixerPipa.findOne({
                    where: {
                        id: {[Op.eq]: id},
                        idPelapor: {[Op.eq]: user.userJWT.id}
                    }
                })
                if(cekLaporan === null){
                    throw new UserInputError('Error',  {errors: `Akun Anda Tidak Memiliki Hak Untuk Laporan Ini`} )
                }
                var tanggalLaporan = new Date();
                tanggalLaporan = dayjs(tanggalLaporan).format('YYYY-MM-DD');
                var cekLaporan = await LaporanMixerPipa.findOne({
                    where: { 
                        createdAt: {[Op.startsWith]: tanggalLaporan},
                        tipeMesin: {[Op.eq]: tipeMesin}
                    }
                })
                if(cekLaporan !== null){
                    throw new UserInputError('Tidak Bisa Menambah Laporan Lagi',  {errors: `Sudah Ada Laporan Masuk Untuk ${tipeMesin} Hari Ini`} )
                }
                var laporan = await LaporanMixerPipa.update({
                    status: 1, 
                    tipeMesin,
                    bahanDigunakan,
                    totalHasil,
                    keterangan,
                },{
                    where: {id: {[Op.eq]: id}}
                });
                return laporan;
            }catch(err){
                throw err
            }
        },
        updateStatusLaporan: async (_,args,{user})=>{
            var {id, status, keteranganBanding} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                if(status === 3){
                    return await LaporanMixerPipa.update({status: status, idKetua: user.userJWT.id, pernahBanding: true, keteranganBanding: keteranganBanding},{
                        where: {id: {[Op.eq]: id}}
                    });
                }else{
                    return await LaporanMixerPipa.update({status: status, idKetua: user.userJWT.id},{
                        where: {id: {[Op.eq]: id}}
                    });
                }
            }catch(err){
                throw err
            }
        }
        //Direktur

        //Staf Keuangan

        //Ketua Divisi

        //Anggota Divisi

    }
}