const {Gudang} = require('../../models');
const {Op} = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { UserInputError, AuthenticationError} = require('apollo-server-express');
const {JWT_SECRET} = require('../../config/env.json')

module.exports={
    Query: {
        getGudang: async (_, __, { user })=>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                
                /*const tingkatan = await Jabatan.findAll({
                    where: {id: {[Op.like]: user.idJabatan}},
                })
                if(tingkatan[0].tingkatJabatan > 3){
                    throw new AuthenticationError('Tidak dapat Akses Karena Masalah Tingkatan Jabatan')
                }*/
                const listGudang = await Gudang.findAll({
                    where: {status: {[Op.eq]: 1}}
                })
                return listGudang;
            }catch(err){
                throw err
            }
        },
        getListGudang: async (_, __, { user })=>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                const listGudang = await Gudang.findAll()
                return listGudang;
            }catch(err){
                throw err
            }
        },
      },
    Mutation: {
        registerGudang: async (_,args, {user})=>{
            var {namaGudang, alamatGudang} = args;
            var errors = {}
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                //generate username
                if(namaGudang.trim() === '') errors.namaGudang = 'Nama Gudang tidak boleh kosong'
                if(alamatGudang.trim() === '') errors.alamatGudang = 'Alamt Gudang tidak boleh kosong'
                if(Object.keys(errors).length > 0){
                    throw new UserInputError('Bad Input', { errors })
                }
                const gudangs = await Gudang.create({
                    namaGudang, alamatGudang, status: 1
                })
                return gudangs;
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
        updateGudang: async (_,args,{user})=>{
            var {id, namaGudang, alamatGudang} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                return await Gudang.update({namaGudang: namaGudang, alamatGudang: alamatGudang},{
                    where: {id: {[Op.eq]: id}}
                });
            }catch(err){
                throw err
            }
        },
        updateStatusGudang: async (_,args,{user})=>{
            var {status, id} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                if(status === false){
                    return await Gudang.update({status: 2},{
                        where: {id: {[Op.eq]: id}}
                    });
                }else if(status === true){
                    return await Gudang.update({status: 1},{
                        where: {id: {[Op.eq]: id}}
                    });
                }
            }catch(err){
                throw err
            }
        },
    }
}