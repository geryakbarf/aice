const express = require('express');
const router = express.Router();
const Divisi = require('../controller/divisi');
const Bagian = require('../controller/bagian');
const Karyawan = require('../controller/karyawan');
const Upload = require('../upload');
const Absensi = require('../controller/absensi')
const Kompetensi = require('../controller/kompetensi')
const KPI = require('../controller/kpi')
const Penilaian = require('../controller/penilaian')

//Area API Divisi
router.post('/divisi', Divisi.addDivisi);
router.put('/divisi', Divisi.editDivisi);
router.get('/divisi/:id', Divisi.getOneDivision)
router.get('/divisi', Divisi.getAllDivision)

//Area API bagian
router.post('/bagian', Bagian.addBagian);
router.put('/bagian', Bagian.editBagian);
router.get('/get-bagian/:id', Bagian.getAllBagian);

//Area Karyawan
router.post('/upload-image', Upload.uploadImage);
router.post('/tambah-karyawan', Karyawan.tambahKaryawan);
router.get('/get-karyawan/:nip', Karyawan.getKaryawan);
router.put('/update-karyawan', Karyawan.updateKaryawan);
router.post('/login/hr', Karyawan.loginHR)
router.post('/login/kpi', Karyawan.loginKPI)
router.get('/karyawan/get-all-karyawan', Karyawan.getAllKaryawan)
router.get('/karyawan/get-divisi-karyawan/:id', Karyawan.getDivisiKaryawan)

//Area API Main Absensi
router.get('/main-absensi', Absensi.getMainAbsensi)
router.post('/main-absensi', Absensi.addMainAbseni)

//Area Detail Absensi
router.get('/detail-absensi/:id', Absensi.getDetailAbsensi)
router.post('/detail-absensi/qr', Absensi.absensiQR)

//Area API Android
router.post('/android/login', Karyawan.loginKaryawan)
router.post('/android/karyawan', Karyawan.registerKaryawan)

//Area kompetensi
router.post('/kompetensi', Kompetensi.tambahKompetensi)
router.put('/kompetensi', Kompetensi.updateKompetensi)
router.get('/kompetensi/:id', Kompetensi.getAllKompetensi)

//Area KPI
router.post('/kpi', KPI.tambahKPI)
router.get('/kpi/:id', KPI.getOneKPI)
router.put('/kpi', KPI.editKPI)

//Area Penilaian
router.post('/penilaian', Penilaian.insertPenialain)
router.get('/penilaian/:id', Penilaian.getOnePenilaian)
router.get('/penilaian/kpi/:id', Penilaian.getPenilaianKPI)
router.get('/penilaian/kompetensi/:id', Penilaian.getPenilaianKompetensi)
router.get('/penilaian/validasi/:nip', Penilaian.validasiPenilaian)

module.exports = router;
