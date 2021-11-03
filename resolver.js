const { User } = require('../models');
const {Jabatan} = require('../models');
const {Op} = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { UserInputError, AuthenticationError} = require('apollo-server-express');
const {JWT_SECRET} = require('../config/env.json')

module.exports={
    Query: {
        //general
        login: async (_,args)=>{
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
                userJWT.username = username
                userJWT.idJabatan = user.idJabatan;
                const token = jwt.sign(userJWT, JWT_SECRET, { expiresIn: 60 * 60 });
                user.token = token;
                console.log(userJWT);
                return user
            }catch(err){
                console.log(err)
                throw err
            }
        },
        getUsers: async (_, __, { user }) => {
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                
                const users = await User.findAll({
                    where: { username: {[Op.ne]: user.username}}
                })
                return users;
            }catch(err){
                console.log(err);
                throw err
            }
        },
        getUser: async (_,args)=>{
            const {usernameku} = args;
            try{
                console.log(usernameku);
                const user = await User.findAll({
                    where: {username: {[Op.like]: usernameku}},
                })
                return user;
            }catch(err){
                console.log(err)
                throw err
            }
        },
        getJabatan: async (_, __, { user })=>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                const tingkatan = await Jabatan.findAll({
                    where: {id: {[Op.like]: user.idJabatan}},
                })
                if(tingkatan[0].tingkatJabatan > 3){
                    throw new AuthenticationError('Tidak dapat Akses Karena Masalah Tingkatan Jabatan')
                }
                const listJabatan = await Jabatan.findAll()
                return listJabatan;
            }catch(err){
                console.log(err);
                throw err
            }
        }
        //HRD
        //Direktur
        //Staf Keuangan
        //Ketua Divisi
        //Anggota Divisi
      },
    Mutation: {
        //General

        //HRD
        register: async (_,args)=>{
            var {username,password, confirmPassword, roles} = args;
            var errors = {}
            try{
                if(username.trim() === '') errors.username = 'username tidak boleh kosong'
                if(password.trim() === '') errors.password = 'password tidak boleh kosong'
                if(confirmPassword.trim() === '') errors.confirmPassword = 'confirm password tidak boleh kosong'
                if(roles.trim() === '') errors.roles = 'roles tidak boleh kosong'
                if(password !== confirmPassword) errors.confirmPassword = 'Password dan Confirm Password Tidak sama'
                const userByUsername = await User.findOne({where: {username}})
                if(userByUsername) errors.username = 'Username sudah ada'
                if(Object.keys(errors).length > 0){
                    throw errors;
                }
                password = await bcrypt.hash(password,6)
                const user = await User.create({
                    username, password, roles
                })
                return user;
            }catch(err){
                console.log(err)
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

        //Direktur

        //Staf Keuangan

        //Ketua Divisi

        //Anggota Divisi

    }
}
/*var html = fs.readFileSync('template.html', 'utf8');
                var options = {
                    format: "A4",
                    orientation: "portrait",
                    border: "10mm",
                    header: {
                        height: "45mm"
                    },
                    "footer": {
                        "height": "28mm",
                        "contents": {
                        first: 'Cover page',
                        2: 'Second page', // Any page number is working. 1-based index
                        default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                        last: 'Last Page'
                        }
                    }
                };
                console.log(process.cwd());
                console.log(__dirname);
                var gambar = 'file:///'+process.cwd()+'/public/kop/hjmb.jpg';
                var document = {
                    html: html,
                    data: {
                        no : '1234',
                        perihal : 'Tugas Akhir',
                        nama : 'Nathaniel Tjoa',
                        nrp : '217116640',
                        dospem : 'Amelia Alexandra',
                        gambar : gambar
                    },
                    path: "./output1.pdf"
                };
                pdf.create(document, options)
                    .then(res => {
                        console.log(res)
                    })
                    .catch(error => {
                        console.error(error)
                });*/