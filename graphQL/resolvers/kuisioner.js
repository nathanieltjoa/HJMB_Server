const {ListKuisioner, ListPertanyaan, ListJawaban, ListTanggapan, 
    ListDistribusiKuisioner, Jabatan, HPenilaianKuisioner, DPenilaianKuisioner, sequelize} = require('../../models');
const {Op} = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { UserInputError, AuthenticationError} = require('apollo-server-express');
const {JWT_SECRET} = require('../../config/env.json')
const dayjs = require('dayjs');

module.exports={
    Query: {
        getKuisioner: async (_, __, { user })=>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                const listKuisioner = await ListKuisioner.findAll()
                return listKuisioner;
            }catch(err){
                throw err
            }
        },
        getKuisionerMobile: async (_, __, { user })=>{
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var jabatan = await Jabatan.findOne({
                    where: { id: {[Op.eq]: user.userJWT.idJabatan}}
                })
                const listKuisioner = await ListKuisioner.findAll({
                    include: [{
                        model: ListDistribusiKuisioner,
                        as: 'listDistribusi',
                        where: {
                            TingkatJabatan: {[Op.eq]: jabatan.tingkatJabatan},
                            status: {[Op.eq]: 1}
                        }
                    }],
                    where: {
                        status: {[Op.eq]: 1},
                        divisi: {[Op.or]:['Semuanya', jabatan.namaJabatan]}
                    }
                })
                return listKuisioner;
            }catch(err){
                throw err
            }
        },
        getPertanyaan: async (_, args, { user })=>{
            var {KuisionerId} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                const listPertanyaan = await ListPertanyaan.findAll({
                    include: [{
                        model: ListJawaban,
                        as: 'listJawaban',
                    }],
                    where: {
                        ListKuisionerId: {[Op.eq]: KuisionerId},
                    }
                })
                return listPertanyaan;
            }catch(err){
                throw err
            }
        },
        getTanggapanMobile: async (_, args, { user })=>{
            var {KuisionerId} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var date = new Date(), y = date.getFullYear(), m = date.getMonth();
                var firstDay = dayjs(new Date(y, m, 1)).format('YYYY-MM-DD');
                var lastDay = dayjs(new Date(y, m + 1, 0)).format('YYYY-MM-DD');
                const listPertanyaan = await ListPertanyaan.findAll({
                    include: [{
                        model: ListJawaban,
                        as: 'listJawaban',
                    },{
                        model: ListTanggapan,
                        as: 'listTanggapan',
                        where: {
                            createdAt: {
                                [Op.between]: [firstDay, lastDay]
                            },
                            idKaryawan:{[Op.eq]: user.userJWT.id}
                        }
                    }],
                    where: {
                        ListKuisionerId: {[Op.eq]: KuisionerId},
                    }
                })
		        console.log(listPertanyaan);
                return listPertanyaan;
            }catch(err){
		        console.log(err);
                throw err
            }
        },
        getTanggapanWeb: async (_, args, { user })=>{
            var {KuisionerId, idKaryawan, tanggal} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var date = new Date(tanggal);
                var y = date.getFullYear(), m = date.getMonth();
                var firstDay = dayjs(new Date(y, m, 1)).format('YYYY-MM-DD');
                var lastDay = dayjs(new Date(y, m + 1, 0)).format('YYYY-MM-DD');
                const listPertanyaan = await ListPertanyaan.findAll({
                    include: [{
                        model: ListJawaban,
                        as: 'listJawaban',
                    },{
                        model: ListTanggapan,
                        as: 'listTanggapan',
                        where: {
                            idKaryawan: {[Op.eq]: idKaryawan},
                            createdAt: {
                                [Op.between]: [firstDay, lastDay]
                            },
                        }
                    }],
                    where: {
                        ListKuisionerId: {[Op.eq]: KuisionerId}
                    }
                })
                return listPertanyaan;
            }catch(err){
                throw err
            }
        },
        getDistribusi: async (_, args, { user })=>{
            var {KuisionerId} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                const laporans = await ListDistribusiKuisioner.findAll({
                    where: {
                        ListKuisionerId: {[Op.eq]: KuisionerId},
                    }
                })
                var laporanBaru = [];
                await Promise.all(laporans.map(async (element) =>
                { 
                    //Cek apakah divisi dari anggota yang request sudah sesuai apa belum
                    cekJabatan = await Jabatan.findOne({
                        where: {tingkatJabatan: {[Op.eq]: element.TingkatJabatan}}
                    })
                    element.namaJabatan = cekJabatan.jabatanKu;
                    laporanBaru.push(element);
                }))
                return laporanBaru;
            }catch(err){
                throw err
            }
        },
      },
    Mutation: {
        registerKuisioner: async (_,args, {user})=>{
            var {divisi, namaKuisioner, deskripsiKuisioner, jenisKuisioner} = args;
            var errors = {}
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')

                if(namaKuisioner.trim() === '') errors.namaKuisioner = 'Nama Kusioner tidak boleh kosong'
                if(deskripsiKuisioner.trim() === '') errors.deskripsiKuisioner = 'Deskripsi Kuisioner tidak boleh kosong'
                if(Object.keys(errors).length > 0){
                    throw new UserInputError('Bad Input', { errors })
                }
                const kuisioner = await ListKuisioner.create({
                    divisi, namaKuisioner, deskripsiKuisioner, jenisKuisioner, status: 1
                })
                return kuisioner;
            }catch(err){
                throw new UserInputError('Bad Input',{errors})
            }
        },
        registerPertanyaan: async (_,args, {user})=>{
            var {KuisionerId, teskPertanyaan, jenisPertanyaan, teskJawaban, jawabanRadio} = args;
            var errors = {}
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')

                if(teskPertanyaan.trim() === '') errors.teskPertanyaan = 'Tesk Pertanyaan tidak boleh kosong'
                if(teskJawaban.trim() === '') errors.teskJawaban = 'Tesk Jawaban tidak boleh kosong'
                if(KuisionerId === null) errors.KuisionerId = 'Kuisioner tidak boleh kosong'
                if(jenisPertanyaan.trim() === '') errors.jenisPertanyaan = 'Jenis Pertanyaan tidak boleh kosong'
                if(jenisPertanyaan === "Pilih Opsi"){
                    jawabanRadio.length > 0 ? null: errors.jawabanRadio = 'Pilihan Opsi tidak boleh kosong'
                }
                if(Object.keys(errors).length > 0){
                    throw new UserInputError('Bad Input', { errors })
                }
                const kuisioner = await ListPertanyaan.create({
                    ListKuisionerId: KuisionerId, teskPertanyaan, jenisPertanyaan, status: 1
                },{transaction: t})
                if(jenisPertanyaan === "Pilih Opsi"){
                    await Promise.all(jawabanRadio.map(async element=>{
                        await ListJawaban.create({
                            ListPertanyaanId: kuisioner.id, teskJawaban: element, benar: 1, status: 1
                        },{transaction: t})
                    }))
                }else{
                    await ListJawaban.create({
                        ListPertanyaanId: kuisioner.id, teskJawaban, benar: 1, status: 1
                    },{transaction: t})
                }
                t.commit();
                return kuisioner;
            }catch(err){
		console.log(err);
                t.rollback();
                throw new UserInputError('Bad Input',{errors})
            }
        },
        tambahTanggapanKuisioner: async (_,args, {user})=>{
            var {KuisionerId,answerText, answerRadio, answerPilihan, answerOpsi} = args;
            var errors = {}
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')

                //Cek Apa Sudah Ada Tanggapan Bulan Ini
                var date = new Date(), y = date.getFullYear(), m = date.getMonth();
                var firstDay = dayjs(new Date(y, m, 1)).format('YYYY-MM-DD');
                var lastDay = dayjs(new Date(y, m + 1, 0)).format('YYYY-MM-DD');
                var karyawan;
                await Promise.all(answerPilihan.map(async element =>{
                    karyawan = element.text;
                }))
                const listPenilaian = await HPenilaianKuisioner.findOne({
                    include: [{
                        model: DPenilaianKuisioner,
                        as: 'dPenilaianKuisioner',
                        where: {
                            idPenilai: {[Op.eq]: user.userJWT.id},
                            createdAt: {
                                [Op.between]: [firstDay, lastDay]
                            }
                        }
                    }],
                    where: {
                        idKaryawan: {[Op.eq]: karyawan},
                        ListKuisionerId: {[Op.eq]: KuisionerId},
                    }
                })
                if(listPenilaian !== null){
                    throw new UserInputError('Sudah Mengisi Kuisioner Ini Bulan Ini',  {errors: `Sudah Mengisi Kuisioner Ini Bulan Ini`} )
                }

                var tgl = dayjs(new Date()).format('DDMMYYYY');
                var ctrId = 'T' + tgl;
                var hPenilaianId = 'H' + tgl;
                var dPenilaianId = 'D' + tgl;
                var cekLaporan = await ListTanggapan.count({
                    where: {id: {[Op.startsWith]: ctrId}}
                })
                var id;
                var counterTgl = cekLaporan;
                var pad = "00000"
                if(answerText.length > 0){
                    await Promise.all(answerText.map(async element =>{
                        counterTgl = counterTgl + 1;
                        id = ctrId + pad.substring(0, pad.length - counterTgl.toString().length) + counterTgl.toString();
                        await ListTanggapan.create({
                            id, ListPertanyaanId: element.id, idKaryawan: user.userJWT.id, 
                            teskTanggapan: element.text, ListJawabanId: 0, status: 1
                        },{transaction: t})
                    }))
                }
                var jumlahRating = 0;
                var counterRating = 0;
                if(answerRadio.length > 0){
                    await Promise.all(answerRadio.map(async element =>{
                        counterTgl = counterTgl + 1;
                        id = ctrId + pad.substring(0, pad.length - counterTgl.toString().length) + counterTgl.toString();
                        jumlahRating += element.text;
                        counterRating += 1;
                        await ListTanggapan.create({
                            id, ListPertanyaanId: element.id, idKaryawan: user.userJWT.id, 
                            teskTanggapan: element.text, ListJawabanId: 0, status: 1
                        },{transaction: t})
                    }))
                }
                if(answerPilihan.length > 0){
                    await Promise.all(answerPilihan.map(async element =>{
                        counterTgl = counterTgl + 1;
                        id = ctrId + pad.substring(0, pad.length - counterTgl.toString().length) + counterTgl.toString();
                        await ListTanggapan.create({
                            id, ListPertanyaanId: element.id, idKaryawan: user.userJWT.id, 
                            teskTanggapan: element.text, ListJawabanId: 0, status: 1
                        },{transaction: t})
                    }))
                }
                if(answerOpsi.length > 0){
                    await Promise.all(answerOpsi.map(async element =>{
                        counterTgl = counterTgl + 1;
                        id = ctrId + pad.substring(0, pad.length - counterTgl.toString().length) + counterTgl.toString();
                        await ListTanggapan.create({
                            id, ListPertanyaanId: element.id, idKaryawan: user.userJWT.id, 
                            teskTanggapan: element.text, ListJawabanId: 0, status: 1
                        },{transaction: t})
                    }))
                }
                var nilai = jumlahRating / counterRating;
                var jabatan = await Jabatan.findOne({
                    where: { id: {[Op.eq]: user.userJWT.idJabatan}}
                })
                const distribusi = await ListDistribusiKuisioner.findOne({
                    where: {
                        TingkatJabatan: {[Op.eq]: jabatan.tingkatJabatan},
                        ListKuisionerId: {[Op.eq]: KuisionerId},
                        status: {[Op.eq]: 1}
                    }
                })
                var counter = await ListPertanyaan.findOne({
                    include: [{
                        model: ListJawaban,
                        as: 'listJawaban',
                    }],
                    where: {
                        ListKuisionerId: {[Op.eq]: KuisionerId},
                        jenisPertanyaan: {[Op.eq]: "Rating"}
                    }
                })
                nilai = (nilai * distribusi.persentaseNilai) / parseInt(counter.listJawaban[0].teskJawaban)
                //pake normalisasi
                /*
                var normalisasi = (100 / parseInt(counter.listJawaban[0].teskJawaban)) * nilai;
                nilai = normalisasi * (kuisioner.persentaseNilai / 100);
                */
                var hPenilaian = await HPenilaianKuisioner.findOne({
                    where: {
                        idKaryawan: {[Op.eq]: karyawan},
                        createdAt: {
                            [Op.between]: [firstDay, lastDay]
                        },
                        ListKuisionerId: {[Op.eq]: KuisionerId},
                    }
                })
                if(hPenilaian === null){
                    cekLaporan = await HPenilaianKuisioner.count({
                        where: {
                            id: {[Op.startsWith]: hPenilaianId}
                        }
                    })
                    hPenilaianId += pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();
                    await HPenilaianKuisioner.create({
                        id: hPenilaianId, ListKuisionerId: KuisionerId, idKaryawan: karyawan, totalNilai: nilai, 
                        jumlahNilai: nilai, jumlahKaryawan: 1
                    },{ transaction: t});
                }else{
                    hPenilaianId = hPenilaian.id;
                    /*cekLaporan = await DPenilaianKuisioner.findOne({
                        where: {
                            HPenilaianKuisionerId: {[Op.eq]: hPenilaian.id},
                            idPenilai: {[Op.eq]: user.userJWT.id}
                        }
                    })
                    if(cekLaporan !== null){
                        var jumlahNilai = hPenilaian.jumlahNilai + nilai;
                        var counterHNilai = jumlahNilai / hPenilaian.jumlahKaryawan;
                        await HPenilaianKuisioner.update({
                            totalNilai: counterHNilai, jumlahNilai
                        },{
                            where: {id: {[Op.eq]: hPenilaianId}},
                            transaction: t
                        })
                    }else{
                        var jumlahNilai = hPenilaian.jumlahNilai + nilai;
                        var jumlahKaryawan = hPenilaian.jumlahKaryawan + 1;
                        var counterHNilai = jumlahNilai/ jumlahKaryawan;
                        await HPenilaianKuisioner.update({
                            totalNilai: counterHNilai, jumlahNilai, jumlahKaryawan
                        },{
                            where: {id: {[Op.eq]: hPenilaianId}},
                            transaction: t
                        })
                    }*/
                    var jumlahNilai = hPenilaian.jumlahNilai + nilai;
                    var jumlahKaryawan = hPenilaian.jumlahKaryawan + 1;
                    var counterHNilai = jumlahNilai/ jumlahKaryawan;
                    await HPenilaianKuisioner.update({
                        totalNilai: counterHNilai, jumlahNilai, jumlahKaryawan
                    },{
                        where: {id: {[Op.eq]: hPenilaianId}},
                        transaction: t
                    })
                }
                cekLaporan = await DPenilaianKuisioner.count({
                    where: {
                        id: {[Op.startsWith]: dPenilaianId}
                    }
                })
                dPenilaianId += pad.substring(0, pad.length - cekLaporan.toString().length) + cekLaporan.toString();
                await DPenilaianKuisioner.create({
                    id: dPenilaianId, HPenilaianKuisionerId: hPenilaianId, 
                    idPenilai: user.userJWT.id, nilai
                },{transaction: t});
                t.commit()
                return id;
            }catch(err){
		console.log(err);
                t.rollback()
                throw err
            }
        },
        updateKuisioner: async (_,args,{user}) =>{
            var {id, divisi, namaKuisioner, deskripsiKuisioner, jenisKuisioner} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                
                var laporan = await ListKuisioner.update({
                    divisi,
                    namaKuisioner,
                    deskripsiKuisioner,
                    jenisKuisioner,
                },{
                    where: {id: {[Op.eq]: id}}
                });
                return laporan;
            }catch(err){
                throw err
            }
        },
        updatePertanyaan: async (_,args,{user}) =>{
            var {idJawaban, teskJawaban, jawabanRadio} = args;
            const t = await sequelize.transaction();
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporan = null;
                if(jenisPertanyaan === "Pilih Opsi"){
                    await Promise.all(jawabanRadio.map(async element=>{
                        await ListJawaban.update({
                            teskJawaban: element.teskJawaban
                        },{
                            where: {id: {[Op.eq]: element.id}},
                            transaction: t
                        })
                    }))
                }else{
                    await ListJawaban.update({
                        teskJawaban
                    },{
                        where: {id: {[Op.eq]: idJawaban}},
                        transaction: t
                    })
                }
                t.commit()
                return laporan;
            }catch(err){
                t.rollback()
                throw err
            }
        },
        updateStatusPertanyaan: async (_,args,{user}) =>{
            var {id, status} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporan = await ListPertanyaan.update({
                    status
                },{
                    where: {id: {[Op.eq]: id}},
                })
                return laporan;
            }catch(err){
                throw err
            }
        },
        updateStatusKuisioner: async (_,args,{user}) =>{
            var {id, status} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporan = await ListKuisioner.update({
                    status
                },{
                    where: {id: {[Op.eq]: id}},
                })
                return laporan;
            }catch(err){
                throw err
            }
        },
        updateStatusDistribusi: async (_,args,{user}) =>{
            var {id, status} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                var laporan = await ListDistribusiKuisioner.update({
                    status
                },{
                    where: {id: {[Op.eq]: id}},
                })
                return laporan;
            }catch(err){
                throw err
            }
        },
        registerDistribusi: async (_,args, {user})=>{
            var {ListKuisionerId, TingkatJabatan, persentaseNilai} = args;
            try{
                if(!user) throw new AuthenticationError('Unauthenticated')
                const kuisioner = await ListDistribusiKuisioner.create({
                    ListKuisionerId, TingkatJabatan, persentaseNilai, status: 1
                })
                return kuisioner;
            }catch(err){
                throw err
            }
        },
    }
}
