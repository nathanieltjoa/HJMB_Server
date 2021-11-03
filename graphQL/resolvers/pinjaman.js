const {HPinjamUang, DPinjamUang, Karyawan, sequelize} = require('../../models');
const {Op} = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { UserInputError, AuthenticationError} = require('apollo-server-express');
const {JWT_SECRET} = require('../../config/env.json')
const dayjs = require('dayjs');

module.exports={
    Query: {
        getPinjaman: async (_,__, {user})=>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                const pinjaman = await HPinjamUang.findOne({
                    include: [{
                        model: DPinjamUang,
                        as: 'dPinjamUang',
                    }],
                    where: {
                        idKaryawan: {[Op.eq]: user.userJWT.id},
                        lunas: {[Op.eq]: false}
                    }
                })
                return pinjaman;
            }catch(err){
                throw err
            }
        },
        getListPinjaman: async (_,args, {user})=>{
            var {page, limit, karyawan, orderBy, bulan, status} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var offset = page ? page * limit: 0;
                var orderKu =[];
                var whereHKu = [];
                var whereDKu = [];
                if(bulan !== null && bulan !== undefined){
                    if(bulan.toString() !== "Invalid Date"){
                        var date = new Date(bulan);
                        var y = date.getFullYear(), m = date.getMonth();
                        var firstDay = dayjs(new Date(y, m, 1)).format('YYYY-MM-DD');
                        var lastDay = dayjs(new Date(y, m + 1, 0)).format('YYYY-MM-DD');
                        whereHKu.push({
                            createdAt: {
                                [Op.between]: [firstDay, lastDay]
                            }
                        })
                    }
                }
                if(status !== -1){
                    whereHKu.push({
                        status: {[Op.eq]: status}
                    })
                }
                if(orderBy === "Slip Terbaru"){
                    orderKu= [
                        ["createdAt", "DESC"]
                    ]
                }else if(orderBy === "Slip Terlama"){
                    orderKu= [
                        ["createdAt", "ASC"]
                    ]
                }
                if(karyawan !== null && karyawan !== ""){
                    whereHKu.push({
                        idKaryawan: {[Op.eq]: karyawan}
                    })
                }
                const pinjaman = await HPinjamUang.findAndCountAll({
                    include: [{
                        model: Karyawan,
                        as: 'karyawan',
                    },{
                        model: Karyawan,
                        as: 'hrd',
                    },{
                        model: Karyawan,
                        as: 'keuangan',
                    }],
                    limit: limit,
                    offset: offset,
                    where: whereHKu,
                    order: orderKu
                })
                return pinjaman;
            }catch(err){
                throw err
            }
        },
        getListPinjamanKeuangan: async (_,args, {user})=>{
            var { status, page, limit} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var whereHKu =[];
                if(status !== -1){
                    whereHKu = {
                        status: {[Op.eq]:status}
                    }
                }
                page -=1;
                var offset = page ? page * limit: 0;
                const pinjaman = await HPinjamUang.findAndCountAll({
                    include: [{
                        model: Karyawan,
                        as: 'karyawan',
                    },{
                        model: Karyawan,
                        as: 'hrd',
                    },{
                        model: Karyawan,
                        as: 'keuangan',
                    }],
                    limit: limit,
                    offset: offset,
                    where: whereHKu
                })
                return pinjaman;
            }catch(err){
                throw err
            }
        },
        getPermintaanPinjamanDiri: async (_,__, {user})=>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                const pinjaman = await HPinjamUang.findAll({
                    include: [{
                        model: Karyawan,
                        as: 'karyawan',
                    }],
                    where: {
                        status: {[Op.eq]: 0}
                    }
                })
                return pinjaman;
            }catch(err){
                throw err
            }
        },
        getDetailPinjaman: async (_,args, {user})=>{
            var {id} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                const pinjaman = await DPinjamUang.findAll({
                    where: {
                        HPinjamUangId: {[Op.eq]: id}
                    }
                })
                return pinjaman;
            }catch(err){
                throw err
            }
        },
    },
    Mutation: {
      registerPinjaman: async (_,args, {user})=>{
          var {jumlahPinjam, cicilan, keteranganPinjam} = args;
          var errors = {}
          const t = await sequelize.transaction();
          try{
              if(!user) throw new AuthenticationError('Unauthenticated')

              if(jumlahPinjam.toString().trim() === '') errors.namaShift = 'Jumlah Pinjaman tidak boleh kosong'
              if(cicilan.toString().trim() === '') errors.nilaiIndex = 'Cicilan tidak boleh kosong'
              if(keteranganPinjam.trim() === '') errors.jamMasuk = 'Keterangan Pinjaman tidak boleh kosong'
              if(Object.keys(errors).length > 0){
                  throw new UserInputError('Bad Input', { errors })
              }
              var cekLaporan = await HPinjamUang.findOne({
                  where: {
                      idKaryawan: {[Op.eq]: user.userJWT.id},
                      lunas: {[Op.eq]: false}
                    }
              })
              if(cekLaporan !== null){
                throw new UserInputError('Tidak Bisa Pinjam Uang Karena Masih Ada Cicilan',  {errors: `Tidak Bisa Pinjam Uang Karena Masih Ada Cicilan`} )
              }
              var tglLaporan = dayjs(new Date()).format('DDMMYYYY');
              var id = "H" + tglLaporan;
              var idDLaporan = "D" + tglLaporan;
              cekLaporan = await HPinjamUang.count({
                  where: {
                      id: {[Op.startsWith]: id}
                  }
              })
              id += cekLaporan;
              const indexPenilaian = await HPinjamUang.create({
                  id, idKaryawan: user.userJWT.id, idKeuangan: 0,idHRD: 0,jumlahPinjam, keteranganPinjam, lunas: false, cicilan, keteranganHRD: ''
                  , status: 0
              },{transaction: t})
              cekLaporan = await DPinjamUang.count({
                  where: {
                      id: {[Op.startsWith]: idDLaporan}
                  }
              })
              var counterId = cekLaporan;
              var biayaCicilan = Math.round(jumlahPinjam / cicilan);
              var totalBayaran = 0;
              for (let index = 1; index <= cicilan; index++) {
                counterId = counterId + 1;
                counterIdDLaporan = idDLaporan + (counterId < 10 ? "0": "")+counterId;
                if(index !== cicilan){
                    await DPinjamUang.create({
                        id: counterIdDLaporan, HPinjamUangId: id,  totalPembayaran: biayaCicilan, 
                        pembayaranKe: index, lunas: false
                    },{transaction: t})
                }else{
                    var sisaCicilan = jumlahPinjam - totalBayaran;
                    await DPinjamUang.create({
                        id: counterIdDLaporan, HPinjamUangId: id,  totalPembayaran: sisaCicilan, 
                        pembayaranKe: index, lunas: false
                    },{transaction: t})
                }
                totalBayaran += biayaCicilan;
              }
              t.commit()
              return indexPenilaian;
          }catch(err){
              t.rollback()
              throw err
          }
      },
      updateHPinjaman: async (_,args,{user}) =>{
        var {id, status, keterangan} = args;
        try{
            if(!user) throw new AuthenticationError('Unauthenticated')

            var laporan = await HPinjamUang.update({
                idHRD: user.userJWT.id,
                status: status === true? 1:3, 
                keteranganHRD: keterangan
            },{
                where: {id: {[Op.eq]: id}},
            })
            return laporan;
        }catch(err){
            throw err
        }
      },
      updateStatusPinjamanKeuangan: async (_,args,{user}) =>{
        var {id, status} = args;
        try{
            if(!user) throw new AuthenticationError('Unauthenticated')

            var laporan = await HPinjamUang.update({
                idKeuangan: user.userJWT.id,
                status: status, 
            },{
                where: {id: {[Op.eq]: id}},
            })
            return laporan;
        }catch(err){
            throw err
        }
      },
      updateStatusPinjamanKaryawan: async (_,args,{user}) =>{
        var {id, status} = args;
        try{
            if(!user) throw new AuthenticationError('Unauthenticated')

            var laporan = await HPinjamUang.update({
                status: status, 
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