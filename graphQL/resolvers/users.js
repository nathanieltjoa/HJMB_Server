const { User } = require('../../models');
const { Jabatan } = require('../../models');
const {Op} = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { UserInputError, AuthenticationError} = require('apollo-server-express');
const {JWT_SECRET} = require('../../config/env.json')

module.exports={
    Query: {
        //general
        loginWebsite: async (_,args)=>{
            const {username, password} = args
            var errors = {}
            var userJWT = {}
            try{
                if(username.trim() === "") errors.username = 'Username tidak boleh kosong'
                if(password.trim() === '') errors.password = 'Password tidak boleh kosong'
                if(Object.keys(errors).length > 0){
                    throw new UserInputError('Bad Input', { errors })
                }
                const user = await User.findOne({
                    where: {username}
                })
                if(!user){
                    errors.username = 'User tidak ditemukan'
                    throw new UserInputError('User tidak ditemukan', { errors })
                }
                const correctPassword = await bcrypt.compare(password,user.password);
                if(!correctPassword){
                    errors.password = 'Password tidak sesuai'
                    throw new UserInputError('Password tidak sesuai', {errors})
                }
                const jabatan = await Jabatan.findOne({
                    where: { id: {[Op.eq]: user.idJabatan}}
                })
                if(jabatan.tingkatJabatan > 3){
                    errors.username = 'User Tidak Memiliki Hak Akses'
                    throw new UserInputError('Tidak Dapat Hak Akses',{errors})
                }
                userJWT.username = username;
                userJWT.idJabatan = user.idJabatan;
                userJWT.userDivisi = jabatan.namaJabatan;
                userJWT.id = user.id;
                const token = jwt.sign({userJWT}, JWT_SECRET, {  });
                user.userDivisi = userJWT.userDivisi;
                user.token = token;
                return user
            }catch(err){
                throw err
            }
        },
        loginMobile: async (_,args)=>{
            const {username, password} = args
            var errors = {}
            var userJWT = {}
            try{
                if(username.trim() === "") errors.username = 'Username tidak boleh kosong'
                if(password.trim() === '') errors.password = 'Password tidak boleh kosong'
                if(Object.keys(errors).length > 0){
                    throw new UserInputError('Bad Input', { errors })
                }
                const user = await User.findOne({
                    where: {username}
                })
                if(!user){
                    errors.username = 'User tidak ditemukan'
                    throw new UserInputError('User tidak ditemukan', { errors })
                }
                const correctPassword = await bcrypt.compare(password,user.password);
                if(!correctPassword){
                    errors.password = 'Password tidak sesuai'
                    throw new UserInputError('Password tidak sesuai', {errors})
                }
                const jabatan = await Jabatan.findOne({
                    where: { id: {[Op.eq]: user.idJabatan}}
                })
                /*if(jabatan.tingkatJabatan > 3){
                    errors.username = 'User Tidak Memiliki Hak Akses'
                    throw new UserInputError('Tidak Dapat Hak Akses',{errors})
                }*/
                userJWT.username = username
                userJWT.idJabatan = user.idJabatan;
                userJWT.id = user.id;
                userJWT.userDivisi = jabatan.namaJabatan;
                userJWT.isChief = jabatan.tingkatJabatan === 4 ? true : false
                const token = jwt.sign({userJWT}, JWT_SECRET, { });
                user.token = token;
                user.userDivisi = userJWT.userDivisi;
                user.isChief = userJWT.isChief;
                return user
            }catch(err){
                throw err
            }
        },
        getUsers: async (_, __, { user }) => {
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                
                const users = await User.findAll()
                return users;
            }catch(err){
                throw err
            }
        },
        getUser: async (_,__, {user})=>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                const users = await User.findOne({
                    where: { username: {[Op.ne]: user.username}}
                })
                return users;
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
        registerUser: async (_,args,{user})=>{
            var {id,username, idJabatan} = args;
            var errors = {}
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')

                //generate username
                username = username.split(' ')[0].toLowerCase();
                const counterUser = await User.findAll({
                    where: {username: {[Op.like]: (username+'%')}},
                })
                username = username + (counterUser.length+1);
                var passwordRaw = username + (Math.floor(Math.random() * 100) + 10);
                var password = await bcrypt.hash(passwordRaw,6)
                const users = await User.create({
                    id,username, password, idJabatan
                })
                users.passwordRaw = passwordRaw;
                return users;
            }catch(err){
                throw err
            }
        },
        changePassword: async(_,args,{user}) => {
            const {passwordLama, passwordBaru, passwordConfirm} = args
            var errors = {}
            try{
                if(passwordLama.trim() === "") errors.passwordLama = 'Password Lama tidak boleh kosong'
                if(passwordBaru.trim() === '') errors.passwordBaru = 'Password Baru tidak boleh kosong'
                if(passwordConfirm.trim() === '') errors.passwordConfirm = 'Confirm Password tidak boleh kosong'
                if(Object.keys(errors).length > 0){
                    throw new UserInputError('Bad Input', { errors })
                }
                if(passwordBaru !== passwordConfirm) errors.passwordBaru = 'Password Baru dan Confirm Password Tidak Sama'
                if(Object.keys(errors).length > 0){
                    throw new UserInputError('Password Baru dan Confirm Password Tidak Sama', { errors })
                }
                const userKu = await User.findOne({
                    where: {id: {[Op.eq]: user.userJWT.id}}
                })
                const correctPassword = await bcrypt.compare(passwordLama,userKu.password);
                if(!correctPassword){
                    errors.passwordLama = 'Password yang anda masukkan tidak sesuai dengan password lama'
                    throw new UserInputError('Password tidak sesuai', {errors})
                }
                var password = await bcrypt.hash(passwordBaru,6)

                return await User.update({password: password},{
                    where: {id: {[Op.eq]: user.userJWT.id}}
                }); 
            }catch(err){
                throw err
            }
        },
        deleteUser: async (_,args,{user}) => {
            var {id} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                const usersCounter = await User.findOne({
                    where: {id: {[Op.eq]: id}}
                })
                await User.destroy({
                    where: {id: {[Op.eq]: id}}
                })
                return usersCounter;
            }catch(err){
                throw err
            }
        }
    }
}