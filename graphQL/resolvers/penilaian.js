const {IndexPenilaian, PenilaianHRD, HPenilaianHRD, DPenilaianHRD, PengaruhNilai,sequelize} = require('../../models');
const {Op} = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { UserInputError, AuthenticationError} = require('apollo-server-express');
const {JWT_SECRET} = require('../../config/env.json')
const dayjs = require('dayjs');

module.exports={
    Query: {
      getIndexPenilaian: async (_,__, {user})=>{
          try{
              if(!user) throw new AuthenticationError('Unauthenticated')
              const indexPenilaian = await IndexPenilaian.findAll()
              return indexPenilaian;
          }catch(err){
              throw err
          }
      },
      getPengaruhNilai: async (_,__, {user})=>{
        try{
            if(!user) throw new AuthenticationError('Unauthenticated')
            const pengaruh = await PengaruhNilai.findAll({
                order: [['nilaiMin', 'DESC']]
            })
            return pengaruh;
        }catch(err){
            throw err
        }
    },
    },
    Mutation: {
      registerIndexPenilaian: async (_,args, {user})=>{
          var {namaIndex, nilaiIndex, keteranganIndex} = args;
          var errors = {}
          try{
              if(!user) throw new AuthenticationError('Unauthenticated')

              if(namaIndex.trim() === '') errors.namaShift = 'Nama Index tidak boleh kosong'
              if(nilaiIndex.toString().trim() === '') errors.nilaiIndex = 'Nilai Index tidak boleh kosong'
              if(keteranganIndex.trim() === '') errors.jamMasuk = 'Keterangan Index tidak boleh kosong'
              if(Object.keys(errors).length > 0){
                  throw new UserInputError('Bad Input', { errors })
              }
              const indexPenilaian = await IndexPenilaian.create({
                  namaIndex, nilaiIndex, keteranganIndex, status: 0
              })
              return indexPenilaian;
          }catch(err){
              throw new UserInputError('Bad Input',{errors})
          }
      },
      updateStatusIndexPenilaian: async (_,args,{user}) =>{
        var {id, status} = args;
        try{
            if(!user) throw new AuthenticationError('Unauthenticated')
            var laporan = await IndexPenilaian.update({
                status
            },{
                where: {id: {[Op.eq]: id}},
            })
            return laporan;
        }catch(err){
            throw err
        }
      },
      updateIndexPenilaian: async (_,args,{user}) =>{
        var {id, namaIndex, nilaiIndex, keteranganIndex} = args;
        try{
            if(!user) throw new AuthenticationError('Unauthenticated')
            var laporan = await IndexPenilaian.update({
                namaIndex, nilaiIndex, keteranganIndex
            },{
                where: {id: {[Op.eq]: id}},
            })
            return laporan;
        }catch(err){
            throw err
        }
      },
      registerNilaiHRD: async (_,args,{user}) =>{
        var {idKaryawan, ListNilaiInput} = args;
        const t = await sequelize.transaction();
        try{
            if(!user) throw new AuthenticationError('Unauthenticated')
            var laporan = null;
            var tgl = dayjs(new Date()).format('DDMMYYYY');
            var date = new Date(), y = date.getFullYear(), m = date.getMonth();
            var firstDay = dayjs(new Date(y, m, 1)).format('YYYY-MM-DD');
            var lastDay = dayjs(new Date(y, m + 1, 0)).format('YYYY-MM-DD');
            var pad = "000"
            var counterNilai = 0;
            await Promise.all(ListNilaiInput.map(async element =>{
                counterNilai += element.hasil;
            }))
            var hPenilaianId = 'H' + tgl;
            var ctrId = 'D' + tgl;
            var dPenilaianId = 'D' + tgl;
            var hPenilaian = await HPenilaianHRD.findOne({
                where: {
                    idKaryawan: {[Op.eq]: idKaryawan},
                    createdAt: {
                        [Op.between]: [firstDay, lastDay]
                    }
                }
            })
            if(hPenilaian === null){
                cekLaporan = await HPenilaianHRD.count({
                    where: {
                        id: {[Op.startsWith]: hPenilaianId}
                    }
                })
                hPenilaianId += pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();
                await HPenilaianHRD.create({
                    id: hPenilaianId, idKaryawan: idKaryawan, totalNilai: counterNilai, jumlahNilai: counterNilai,
                    jumlahKaryawan: 1
                },{ transaction: t});
            }else{
                hPenilaianId = hPenilaian.id;
                cekLaporan = await DPenilaianHRD.findOne({
                    where: {
                        HPenilaianKuisionerId: {[Op.eq]: hPenilaianId},
                        idPenilai: {[Op.eq]: user.userJWT.id}
                    }
                })
                if(cekLaporan !== null){
                    var jumlahNilai = hPenilaian.jumlahNilai + counterNilai;
                    var counterHNilai = jumlahNilai / hPenilaian.jumlahKaryawan;
                    await HPenilaianHRD.update({
                        totalNilai: counterHNilai, jumlahNilai
                    },{
                        where: {id: {[Op.eq]: hPenilaianId}},
                        transaction: t
                    })
                }else{
                    var jumlahNilai = hPenilaian.jumlahNilai + counterNilai;
                    var jumlahKaryawan = hPenilaian.jumlahKaryawan + 1;
                    var counterHNilai = jumlahNilai/ jumlahKaryawan;
                    await HPenilaianHRD.update({
                        totalNilai: counterHNilai, jumlahNilai, jumlahKaryawan
                    },{
                        where: {id: {[Op.eq]: hPenilaianId}},
                        transaction: t
                    })
                }
            }
            var cekLaporan = await DPenilaianHRD.count({
                where: {id: {[Op.startsWith]: dPenilaianId}}
            })
            var counterTgl = cekLaporan;
            await Promise.all(ListNilaiInput.map(async element =>{
                counterTgl = counterTgl + 1;
                dPenilaianId = ctrId + pad.substring(0, pad.length - counterTgl.toString().length) + counterTgl.toString();
                await DPenilaianHRD.create({
                    id: dPenilaianId, HPenilaianHRDId: hPenilaianId, IndexPenilaianId: element.id, 
                    idPenilai: user.userJWT.id, nilai: element.hasil
                },{transaction: t})
            }))
            t.commit();
            return laporan;
        }catch(err){
            console.log(err);
            t.rollback()
            throw err;
        }
      },
      registerPengaruhNilai: async (_,args, {user})=>{
        var {nilaiMin, nilaiMax, hasilNilai, pengurangan, nilaiUang} = args;
        try{
            if(!user) throw new AuthenticationError('Unauthenticated')

            const pengaruh = await PengaruhNilai.create({
                nilaiMin, nilaiMax, hasilNilai, pengurangan, nilaiUang
            })
            return pengaruh;
        }catch(err){
            console.log(err);
            throw err
        }
      },
      updatePengaruhNilai: async (_,args, {user})=>{
        var {id, nilaiMin, nilaiMax, hasilNilai, pengurangan, nilaiUang} = args;
        try{
            if(!user) throw new AuthenticationError('Unauthenticated')

            const pengaruh = await PengaruhNilai.update({
                nilaiMin, nilaiMax, hasilNilai, pengurangan, nilaiUang
            },{
                where: {id: {[Op.eq]: id}}
            })
            return pengaruh;
        }catch(err){
            console.log(err);
            throw err
        }
      },
    }
}