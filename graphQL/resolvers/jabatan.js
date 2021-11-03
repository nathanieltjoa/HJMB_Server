const {Jabatan, Sequelize} = require('../../models');
const {Op} = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { UserInputError, AuthenticationError} = require('apollo-server-express');
const {JWT_SECRET} = require('../../config/env.json')

module.exports={
    Query: {
        //general
        getJabatan: async (_, __, { user })=>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                
                /*const tingkatan = await Jabatan.findAll({
                    where: {id: {[Op.like]: user.idJabatan}},
                })
                if(tingkatan[0].tingkatJabatan > 3){
                    throw new AuthenticationError('Tidak dapat Akses Karena Masalah Tingkatan Jabatan')
                }*/
                const listJabatan = await Jabatan.findAll()
                return listJabatan;
            }catch(err){
                throw err
            }
        },
        getDivisi: async (_, __, { user })=>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                const jabatan = await Jabatan.findOne({
                    where: {id: {[Op.eq] : user.userJWT.idJabatan}}
                })
                return jabatan;
            }catch(err){
                throw err
            }
        },
        getListJabatan: async (_, __, { user })=>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                const jabatan = await Jabatan.findAll({
                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.col('tingkatJabatan')) ,'tingkatJabatan'], 'jabatanKu'
                    ],
                })
                return jabatan;
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