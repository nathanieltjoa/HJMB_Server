const {Izin, Permintaan, sequelize, Sequelize} = require('../../models');
const {Op} = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { UserInputError, AuthenticationError} = require('apollo-server-express');
const {JWT_SECRET} = require('../../config/env.json')
const dayjs = require('dayjs');

module.exports={
    Query: {
        getIzinUjiCoba: async (_, __, { user })=>{
            try{
                const listIzin = await Izin.findAll()
                return listIzin;
            }catch(err){
                throw err
            }
        },
        getIzin: async (_, __, { user })=>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                const listIzin = await Izin.findAll()
                return listIzin;
            }catch(err){
                throw err
            }
        },
        getIzinMobile: async (_, __, { user })=>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                const listIzin = await Izin.findAll({
                    attributes: { 
                        include: [
                            [Sequelize.fn("COUNT", Sequelize.col("listPermintaan.id")), "totalPemakaian"]
                        ] 
                    },
                    include: [{
                        as: "listPermintaan",
                        model: Permintaan, 
                        attributes: []
                    }],
                    where: {status: {[Op.eq]: 1}},
                    group: ['Izin.id']
                })
                return listIzin;
            }catch(err){
                throw err
            }
        },
      },
    Mutation: {
        registerIzin: async (_,args, {user})=>{
            var {namaIzin, totalIzin, keterangan, batasanHari} = args;
            var errors = {}
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')

                if(namaIzin.trim() === '') errors.namaShift = 'Nama Izin tidak boleh kosong'
                if(totalIzin.toString().trim() === '') errors.jamMasuk = 'Total Izin tidak boleh kosong'
                if(keterangan.trim() === '') errors.jamKeluar = 'Keterangan tidak boleh kosong'
                if(Object.keys(errors).length > 0){
                    throw new UserInputError('Bad Input', { errors })
                }
                const izin = await Izin.create({
                    namaIzin, totalIzin, keterangan, status: true, batasanHari
                })
                return izin;
            }catch(err){
                throw new UserInputError('Bad Input',{errors})
            }
        },
        updateIzin: async (_,args,{user}) =>{
            var {id, namaIzin, totalIzin, keterangan, batasanHari} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                
                var izin = await Izin.update({
                    namaIzin,
                    totalIzin,
                    keterangan,
                    batasanHari
                },{
                    where: {id: {[Op.eq]: id}}
                });
                return izin;
            }catch(err){
                throw err
            }
        },
        updateStatusIzin: async (_,args,{user}) =>{
            var {id, status} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporan = await Izin.update({
                    status
                },{
                    where: {id: {[Op.eq]: id}},
                })
                return laporan;
            }catch(err){
                throw err
            }
        },
    }
}