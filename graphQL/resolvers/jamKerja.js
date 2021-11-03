const {JamKerja} = require('../../models');
const {Op} = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { UserInputError, AuthenticationError} = require('apollo-server-express');
const {JWT_SECRET} = require('../../config/env.json')

module.exports={
    Query: {

      },
    Mutation: {
        registerJamKerja: async (_,args, {user})=>{
            var {namaShift, jamMasuk, jamKeluar} = args;
            var errors = {}
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')

                if(namaShift.trim() === '') errors.namaShift = 'Nama Shift tidak boleh kosong'
                if(jamMasuk.trim() === '') errors.jamMasuk = 'Jam Masuk tidak boleh kosong'
                if(jamKeluar.trim() === '') errors.jamKeluar = 'Jam Keluar tidak boleh kosong'
                if(Object.keys(errors).length > 0){
                    throw new UserInputError('Bad Input', { errors })
                }
                const jamKeluars = await JamKerja.create({
                    namaShift, jamMasuk, jamKeluar
                })
                return jamKeluars;
            }catch(err){
                throw new UserInputError('Bad Input',{errors})
            }
        },
    }
}