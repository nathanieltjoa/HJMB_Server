const { TipeMesin } = require('../../models');
const {Op} = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { UserInputError, AuthenticationError} = require('apollo-server-express');
const {JWT_SECRET} = require('../../config/env.json');

module.exports={
    Query: {
      //general
      //HRD
      //Direktur
      //Staf Keuangan
      //Ketua Divisi
      //Anggota Divisi
    },
    Mutation: {
        //General
        registerMesin: async (_,args, {user})=>{
            var {id, namaMesin} = args;
            var errors = {}
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                //generate username
                if(namaMesin.trim() === '') errors.namaMesin = 'Nama Mesin tidak boleh kosong'
                if(Object.keys(errors).length > 0){
                    throw new UserInputError('Bad Input', { errors })
                }
                const tipeMesin = await TipeMesin.create({
                    DivisiId: id, namaTipe: namaMesin, status: 1
                })
                return tipeMesin;
            }catch(err){
                if(err.name === 'SequelizeUniqueConstraintError'){
                    err.errors.forEach((e) => {
                       (errors[e.path] = `${e.path} sudah ada`) 
                    });
                }else if(err.name === 'SequelizeValidationError'){
                    err.errors.forEach((e)=>(
                        errors[e.path] = e.message
                    ))
                }
                throw new UserInputError('Bad Input',{errors})
            }
        },
        //HRD
        //Direktur
        //Staf Keuangan
        //Ketua Divisi
        //Anggota Divisi
    }
}