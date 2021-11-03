const {LaporanDataDiri, Karyawan, sequelize} = require('../../models');
const {Op} = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { UserInputError, AuthenticationError} = require('apollo-server-express');
const {JWT_SECRET} = require('../../config/env.json')
const dayjs = require('dayjs');

module.exports={
    Query: {
        getPermintaanDataDiri: async (_, __, { user })=>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                const listPermintaan = await LaporanDataDiri.findAll({
                    where: {status: {[Op.eq]: 0}},
                    order: [['createdAt','DESC']]
                })
                var cekKaryawan;
                await Promise.all(listPermintaan.map(async element => {
                    cekKaryawan = await Karyawan.findOne({
                        where: {id: {[Op.eq]: element.idKaryawan}}
                    })
                    element.namaKaryawan = cekKaryawan.nama;
                }))
                return listPermintaan;
            }catch(err){
                throw err
            }
        },
    },
    Mutation: {
      registerLaporanDataDiri: async (_,args, {user})=>{
          var {bagianData, dataSeharusnya} = args;
          var errors = {}
          try{
              if(!user) throw new AuthenticationError('Unauthenticated')

              if(bagianData.trim() === '') errors.namaShift = 'Bagian Data tidak boleh kosong'
              if(dataSeharusnya.trim() === '') errors.nilaiIndex = 'Data Seharusnya tidak boleh kosong'
              if(Object.keys(errors).length > 0){
                  throw new UserInputError('Bad Input', { errors })
              }
              const laporanDataDiri = await LaporanDataDiri.create({
                idKaryawan: user.userJWT.id, bagianData, dataSeharusnya, idHRD: 0, status: 0
              })
              return laporanDataDiri;
          }catch(err){
              throw new UserInputError('Bad Input',{errors})
          }
      },
    }
}