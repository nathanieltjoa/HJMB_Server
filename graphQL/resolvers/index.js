const userResolvers = require('./users');
const jabatanResolvers = require('./jabatan');
const karyawanResolvers = require('./karyawan');
const permintaanResolvers = require('./permintaan');
const uploadResolvers = require('./upload');
const targetKerjaResolvers = require('./targetKerja');
const divisiResolvers = require('./divisi');
const tipeMesinResolvers = require('./tipeMesin');
const laporanMixerPipaResolvers = require('./laporanMixerPipa');
const laporanProduksiPipaResolvers = require('./laporanProduksiPipa');
const laporanQualityControlPipaResolvers = require('./laporanQualityControlPipa');
const laporanStokistPipaResolvers = require('./laporanStokistPipa')
const laporanArmada = require('./laporanArmada');
const laporanCatTegel = require('./laporanCatTegel');
const laporanSpandek = require('./laporanSpandek');
const gudang = require('./gudang');
const laporanSekuriti = require('./laporanSekuriti');
const laporanSales = require('./laporanSales')
const absensi = require('./absensi')
const jamKerja = require('./jamKerja');
const kuisioner = require('./kuisioner');
const penilaian = require('./penilaian');
const pinjaman = require('./pinjaman');
const izin = require('./izin');
const profile = require('./profile');
const kontrak = require('./kontrak');
const {GraphQLScalarType, Kind} = require('graphql');
const dayjs = require('dayjs');

module.exports = {
    Query: {
        ...userResolvers.Query,
        ...jabatanResolvers.Query,
        ...karyawanResolvers.Query,
        ...permintaanResolvers.Query,
        ...uploadResolvers.Query,
        ...targetKerjaResolvers.Query,
        ...divisiResolvers.Query,
        ...tipeMesinResolvers.Query,
        ...laporanMixerPipaResolvers.Query,
        ...laporanProduksiPipaResolvers.Query,
        ...laporanQualityControlPipaResolvers.Query,
        ...laporanStokistPipaResolvers.Query,
        ...laporanArmada.Query,
        ...laporanCatTegel.Query,
        ...laporanSpandek.Query,
        ...gudang.Query,
        ...laporanSekuriti.Query,
        ...laporanSales.Query,
        ...absensi.Query,
        ...jamKerja.Query,
        ...kuisioner.Query,
        ...penilaian.Query,
        ...pinjaman.Query,
        ...izin.Query,
        ...profile.Query,
        ...kontrak.Query,
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...jabatanResolvers.Mutation,
        ...karyawanResolvers.Mutation,
        ...permintaanResolvers.Mutation,
        ...uploadResolvers.Mutation,
        ...targetKerjaResolvers.Mutation,
        ...divisiResolvers.Mutation,
        ...tipeMesinResolvers.Mutation,
        ...laporanMixerPipaResolvers.Mutation,
        ...laporanProduksiPipaResolvers.Mutation,
        ...laporanQualityControlPipaResolvers.Mutation,
        ...laporanStokistPipaResolvers.Mutation,
        ...laporanArmada.Mutation,
        ...laporanCatTegel.Mutation,
        ...laporanSpandek.Mutation,
        ...gudang.Mutation,
        ...laporanSekuriti.Mutation,
        ...laporanSales.Mutation,
        ...absensi.Mutation,
        ...jamKerja.Mutation,
        ...kuisioner.Mutation,
        ...penilaian.Mutation,
        ...pinjaman.Mutation,
        ...izin.Mutation,
        ...profile.Mutation,
        ...kontrak.Mutation,
    },
    MyDate: new GraphQLScalarType({
        name: "Date",
        description:"Date custom scalar type",
        parseValue(value){
            return dayjs(value);
        },
        serialize(value){
            //return dayjs(value).format("MM-DD-YYYY");
            return dayjs(value).format("YYYY-MM-DD HH:mm:ss");
        },
        parseLiteral(ast){
            if(ast.kind === Kind.INT){
                return dayjs(parseInt(ast.value, 10));
            }
            return null
        }
    })
}