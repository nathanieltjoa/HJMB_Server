const { Permintaan, Jabatan, User, Karyawan } = require('../../models');
const {Op} = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { UserInputError, AuthenticationError} = require('apollo-server-express');
const {JWT_SECRET} = require('../../config/env.json');
const dayjs = require('dayjs');
const path = require('path');
const fs = require('fs');

module.exports={
    Query: {

    },
    Mutation: {
        uploadFile: async (_,args, { user }) => {
            var {file, id} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                const { createReadStream, filename, mimetype, encoding } = await file;

                const { ext } = path.parse(filename);
                var namaFile = user.userJWT.username + "_"+id + ext;

                    const storeUpload = async ({ stream, filename, mimetype, encoding }) => {
                        const pathName = path.join(__dirname, `../../public/images/${namaFile}`)
                    
                        return new Promise((resolve, reject) =>
                            stream
                                .pipe(fs.createWriteStream(pathName))
                                .on("finish", () => { 
                                    Permintaan.update({upload: `http://localhost:4000/images/${namaFile}`},{
                                        where: {id: {[Op.eq]: id}}
                                    });
                                })
                                .on("error", reject)
                        );
                    };

                    const processUpload = async (upload) => {
                        const { createReadStream, filename, mimetype, encoding } = await upload;
                        const stream = createReadStream();
                        const file = await storeUpload({ stream, filename, mimetype, encoding });
                    };

                    const upload = await processUpload(file);

                    return {
                        url: `http://localhost:4000/images/${namaFile}`,
                    };
            }catch(err){
                console.log(err)
            }
        },
        uploadFoto: async(_,{file},{user}) =>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                const { createReadStream, filename, mimetype, encoding } = await file;

                const { ext } = path.parse(filename);
                var namaFile = user.userJWT.username + ext;

                    const storeUpload = async ({ stream, filename, mimetype, encoding }) => {
                        const pathName = path.join(__dirname, `../../public/profile/${namaFile}`)
                    
                        return new Promise((resolve, reject) =>
                        stream
                            .pipe(fs.createWriteStream(pathName))
                            .on("error", reject)
                        );
                    };

                    const processUpload = async (upload) => {
                        const { createReadStream, filename, mimetype, encoding } = await upload;
                        const stream = createReadStream();
                        const file = await storeUpload({ stream, filename, mimetype, encoding });
                        return file;
                    };

                    const upload = await processUpload(file);

                    
                    return {
                        url: `http://localhost:4000/profile/${namaFile}`,
                    };
            }catch(err){
                throw err
            }
        }
    }
}