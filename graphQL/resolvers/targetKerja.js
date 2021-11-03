const { Permintaan, Jabatan, User, Karyawan, TargetKerja } = require('../../models');
const {Op} = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { UserInputError, AuthenticationError} = require('apollo-server-express');
const {JWT_SECRET} = require('../../config/env.json');

module.exports={
    Query: {
        //general
        getTarget: async (_,__, { user }) =>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                //ambil semua permintaan yang sesuai dengan tingkatan
                const jabatan = await Jabatan.findOne({
                    where: {id: {[Op.eq]: user.userJWT.idJabatan}}
                })
                const target = await TargetKerja.findAll({
                    where: { 
                        namaDivisi: { [Op.eq]: jabatan.namaJabatan }
                    }
                })
                return target;
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
        updateTarget: async (_,args,{user})=>{
            var {jumlahTarget} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                const jabatan = await Jabatan.findOne({
                    where: {id: {[Op.eq]: user.userJWT.idJabatan}}
                })
                return await TargetKerja.update({jumlahTarget: jumlahTarget, updatedBy: user.userJWT.id},{
                    where: {namaDivisi: {[Op.eq]: jabatan.namaJabatan}}
                });
            }catch(err){
                throw err
            }
        },
        updateTargetMixer: async (_,args,{user})=>{
            var {targetMixer1, targetMixer2, targetMixer3, targetMixer4} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                const jabatan = await Jabatan.findOne({
                    where: {id: {[Op.eq]: user.userJWT.idJabatan}}
                })
                if(targetMixer1 !== -1){
                    await TargetKerja.update({jumlahTarget: targetMixer1, updatedBy: user.userJWT.id},{
                        where: {namaPengerjaan: {[Op.eq]: "Mixer 1"}, namaDivisi: {[Op.eq]: jabatan.namaJabatan}}
                    });
                }
                if(targetMixer2 !== -1){
                    await TargetKerja.update({jumlahTarget: targetMixer2, updatedBy: user.userJWT.id},{
                        where: {namaPengerjaan: {[Op.eq]: "Mixer 2"}, namaDivisi: {[Op.eq]: jabatan.namaJabatan}}
                    });
                }
                if(targetMixer3 !== -1){
                    await TargetKerja.update({jumlahTarget: targetMixer3, updatedBy: user.userJWT.id},{
                        where: {namaPengerjaan: {[Op.eq]: "Mixer 3"}, namaDivisi: {[Op.eq]: jabatan.namaJabatan}}
                    });
                }
                if(targetMixer4 !== -1){
                    await TargetKerja.update({jumlahTarget: targetMixer4, updatedBy: user.userJWT.id},{
                        where: {namaPengerjaan: {[Op.eq]: "Mixer 4"}, namaDivisi: {[Op.eq]: jabatan.namaJabatan}}
                    });
                }
                return null;
            }catch(err){
                throw err
            }
        },
        updateTargetProduksiPipa: async (_,args,{user})=>{
            var {targetProduksi} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                const jabatan = await Jabatan.findOne({
                    where: {id: {[Op.eq]: user.userJWT.idJabatan}}
                })
                if(targetProduksi !== -1){
                    await TargetKerja.update({jumlahTarget: targetProduksi, updatedBy: user.userJWT.id},{
                        where: {namaPengerjaan: {[Op.eq]: "Produksi Per Jam"}, namaDivisi: {[Op.eq]: jabatan.namaJabatan}}
                    });
                }
                return null;
            }catch(err){
                throw err
            }
        }
        //HRD
        

        //Direktur

        //Staf Keuangan

        //Ketua Divisi

        //Anggota Divisi

    }
}