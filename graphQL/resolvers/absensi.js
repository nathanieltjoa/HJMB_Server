const {Absensi, JamKerja, Karyawan, sequelize} = require('../../models');
const {Op} = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { UserInputError, AuthenticationError} = require('apollo-server-express');
const {JWT_SECRET} = require('../../config/env.json')
const dayjs = require('dayjs');

module.exports={
    Query: {
        getAbsensi: async (_, args, { user })=>{
            var {page, limit, tglAwal, tglAkhir} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var offset = page ? page * limit: 0;
                var where ={};
                tglAwal = dayjs(tglAwal).format('YYYY-MM-DD').toString();
                tglAkhir = dayjs(tglAkhir).format('YYYY-MM-DD').toString();
                if(tglAwal !== 'Invalid Date' && tglAkhir !== 'Invalid Date'){
                    where = {tanggal:{
                        [Op.between]: [tglAwal, tglAkhir]
                    }}
                }else if(tglAwal !== 'Invalid Date' && tglAkhir === 'Invalid Date'){
                    where = {tanggal: {
                        [Op.gte]: tglAwal
                    }}
                }else if(tglAwal === 'Invalid Date' && tglAkhir !== 'Invalid Date'){
                    where = {tanggal: {
                        [Op.lte]: tglAkhir
                    }}
                }
                const listAbsensi = await Absensi.findAndCountAll({
                    include: [{
                        model: JamKerja,
                        as: 'jamKerja',
                    }],
                    where: where,
                    limit: limit,
                    offset: offset,
                    order: [['tanggal','DESC']]
                })
                await Promise.all(listAbsensi.rows.map(async element => {
                    cekKaryawan = await Karyawan.findOne({
                        where: {id: {[Op.eq]: element.idKaryawan}}
                    })
                    element.namaKaryawan = cekKaryawan.nama;
                }))
                return listAbsensi;
            }catch(err){
                throw err
            }
        },
        getAbsensiKu: async (_, args, { user })=>{
            var {page, limit} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                page -= 1;
                var offset = page ? page * limit: 0;
                var firstDay = dayjs(new Date(y, m, 1)).format('YYYY-MM-DD');
                var lastDay = dayjs(new Date(y, m + 1, 0)).format('YYYY-MM-DD');
                const listAbsensi = await Absensi.findAndCountAll({
                    include: [{
                        model: JamKerja,
                        as: 'jamKerja',
                    }],
                    where: {
                        idKaryawan: {[Op.eq]: user.userJWT.id},
                        tanggal: {
                            [Op.between]: [firstDay, lastDay]
                        }
                    },
                    limit: limit,
                    offset: offset,
                    order: [['tanggal','DESC']]
                })
                return listAbsensi;
            }catch(err){
                throw err
            }
        },
        getListAbsensiPribadiMaster: async (_, args, { user })=>{
            var {idKaryawan} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var firstDay = dayjs(new Date(y, m, 1)).format('YYYY-MM-DD');
                var lastDay = dayjs(new Date(y, m + 1, 0)).format('YYYY-MM-DD');
                const listAbsensi = await Absensi.findAll({
                    include: [{
                        model: JamKerja,
                        as: 'jamKerja',
                    },{
                        model: Karyawan,
                        as: 'karyawan',
                    }],
                    where: {
                        idKaryawan: {[Op.eq]: idKaryawan},
                        tanggal: {
                            [Op.between]: [firstDay, lastDay]
                        }
                    },
                    order: [['tanggal','DESC']]
                })
                return listAbsensi;
            }catch(err){
                throw err
            }
        },
      },
    Mutation: {
        registerAbsensi: async (_,args, {user})=>{
            var {status, absensiInput} = args;
            var errors = {}
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var tgl = dayjs(new Date()).format('DDMMYYYY');
                var ctrId = 'A' + tgl;
                var id;
                var counterTgl = 0;
                var pad = "0000"
                var cekLaporan;
                await Promise.all(absensiInput.map(async element => {
                    counterTgl = counterTgl + 1;
                    element.idKu = ctrId + pad.substring(0, pad.length - counterTgl.toString().length) + counterTgl.toString();
                    element.tanggal = dayjs(element.tanggal).format('MM-DD-YYYY');
                    var scanMasuk = element.scanMasuk.replace('.',':');
                    var scanPulang = element.scanPulang.replace('.',':');
                    element.scanMasuk = scanMasuk;
                    element.scanPulang = scanPulang;
                    cekLaporan = await JamKerja.findOne({
                        where: {
                            namaShift: {[Op.eq]: element.jamKerja}
                        }
                    })
                    if(cekLaporan === null){
                        element.jamKerjaId = 7;
                    }else{
                        element.jamKerjaId = cekLaporan.id;
                    }
                }))
                await Promise.all(absensiInput.map( async element => {
                    await Absensi.create({
                        id: element.idKu, idKaryawan: element.id, tanggal: element.tanggal, 
                        JamKerjaId: element.jamKerjaId, scanMasuk: element.scanMasuk.replace('.',':'),
                        scanPulang: element.scanPulang.replace('.',':'), terlambat: element.terlambat.replace('.',':'), 
                        jamBolos: element.jamBolos.replace('.',':'), absen: element.absen, lembur: element.lembur.replace('.',':')
                    },{transaction: t})
                }))
                await t.commit();
                return id;
            }catch(err){
                await t.rollback();
                throw new UserInputError('Bad Input',{errors})
            }
        },
    }
}