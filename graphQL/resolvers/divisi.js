const { Divisi, PembagianAnggota, Jabatan, Karyawan } = require('../../models');
const {Op} = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { UserInputError, AuthenticationError} = require('apollo-server-express');
const {JWT_SECRET} = require('../../config/env.json');

module.exports={
    Query: {
      //general
        getListDivisi: async (_, __, { user })=>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var listDivisi;
                var jabatan = await Jabatan.findOne({
                    where: { id: {[Op.eq]: user.userJWT.idJabatan}}
                })
                if(jabatan.tingkatJabatan === 1){
                    listDivisi = await Divisi.findAll({
                        where: {
                            status: {[Op.eq]: 1},
                            [Op.and]: [
                                {namaDivisi: {[Op.ne]: 'Direktur Perusahaan'}},
                                {namaDivisi: {[Op.ne]: 'Wakil Direktur Perusahaan'}},
                            ],
                        }
                    })
                }else{
                    listDivisi = await Divisi.findAll({
                        where: {
                            status: {[Op.eq]: 1},
                            [Op.and]: [
                                {namaDivisi: {[Op.ne]: 'Direktur Perusahaan'}},
                                {namaDivisi: {[Op.ne]: 'Wakil Direktur Perusahaan'}},
                                {namaDivisi: {[Op.ne]: 'HRD'}},
                            ],
                        }
                    })
                }
                return listDivisi;
            }catch(err){
                throw err
            }
        },
        getPembagianGroup: async (_, __, { user })=>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')

                var jabatan = await Jabatan.findOne({
                    where: { id: {[Op.eq]: user.userJWT.idJabatan}}
                })

                const listDivisi = await Divisi.findOne({
                    where: {
                        namaDivisi: {[Op.eq]: jabatan.namaJabatan}
                    }
                })
                return listDivisi;
            }catch(err){
                throw err
            }
        },
        getMasterListPembagianAnggota: async (_, args, { user })=>{
            var {divisi} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                const listPembagian = await PembagianAnggota.findAll({
                    include: [{
                        model: Jabatan,
                        as: 'jabatan',
                        where: {
                            namaJabatan: {[Op.eq]: divisi},
                            tingkatJabatan: {[Op.eq]: 5}
                        }
                    },{
                        model: Karyawan,
                        as: 'karyawan',
                    }],
                    order:[
                        ['ketua','DESC']
                    ]
                })
                return listPembagian;
            }catch(err){
                throw err
            }
        },
        getListPembagianAnggota: async (_, __, { user })=>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')

                var jabatan = await Jabatan.findOne({
                    where: { id: {[Op.eq]: user.userJWT.idJabatan}}
                })

                const listPembagian = await PembagianAnggota.findAll({
                    include: [{
                        model: Jabatan,
                        as: 'jabatan',
                        where: {
                            namaJabatan: {[Op.eq]: jabatan.namaJabatan},
                            tingkatJabatan: {[Op.eq]: 5}
                        }
                    },{
                        model: Karyawan,
                        as: 'karyawan',
                    }],
                    order:[
                        ['ketua','DESC']
                    ]
                })
                return listPembagian;
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
        updatePembagianDivisi: async (_,args,{user}) =>{
            var {id, jumlahGroup} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporan = await Divisi.update({
                    jumlahGroup
                },{
                    where: {id: {[Op.eq]: id}},
                })
                return laporan;
            }catch(err){
                throw err
            }
        },
        registerAnggota: async (_,args,{user}) =>{
            var {idKaryawan, groupKaryawan} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')

                var cekLaporan = await PembagianAnggota.findOne({
                    where: {idKaryawan: {[Op.eq]: idKaryawan}}
                })
                var laporan;
                if(cekLaporan !== null){
                    return await PembagianAnggota.update({
                        groupKaryawan: groupKaryawan
                    },{
                        where: {idKaryawan: {[Op.eq]: idKaryawan}}
                    })
                }else{
                    var karyawan = await Karyawan.findOne({
                        where: { id: {[Op.eq]: idKaryawan}}
                    })
    
                    laporan = await PembagianAnggota.create({
                        idKaryawan, JabatanId: karyawan.JabatanId, groupKaryawan, ketua: 0
                    })
                }
                return laporan;
            }catch(err){
                console.log(err);
                throw err
            }
        },
        keluarkanAnggota: async (_,args,{user}) =>{
            var {id} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporan = await PembagianAnggota.update({
                    groupKaryawan: 0,
                    ketua: 0
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