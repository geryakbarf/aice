const express = require('express');
const router = express.Router();
const Divisi = require('../controller/divisi');
const Bagian = require('../controller/bagian');
const Karyawan = require('../controller/karyawan');
const Upload = require('../upload');

//Area API Divisi
router.post('/divisi', Divisi.addDivisi);
router.put('/divisi', Divisi.editDivisi);
router.get('/divisi/:id', Divisi.getOneDivision)
router.get('/divisi', Divisi.getAllDivision)

//Area API bagian
router.post('/bagian', Bagian.addBagian);
router.post('/edit-bagian', Bagian.editBagian);
router.get('/get-bagian', Bagian.getAllBagian);

//Area Karyawan
router.post('/upload-image', Upload.uploadImage);
router.post('/tambah-karyawan', Karyawan.tambahKaryawan);
router.get('/get-karyawan/:nip', Karyawan.getKaryawan);
router.put('/update-karyawan', Karyawan.updateKaryawan);

module.exports = router;
