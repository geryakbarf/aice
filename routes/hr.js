const express = require('express');
const router = express.Router();
const Karyawan = require("../controller/karyawan")
const fetch = require("node-fetch");
const auth = require('../middleware/sess_hr_auth');
const DB = require('../controller/config');

router.get('/login', (req, res) => {
    if (req.session.isHRAuthenticated)
        return res.redirect('/hr')
    else {
        const loadCSS = [
            {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css"}
        ];
        const loadJS = [
            {src: "https://code.jquery.com/jquery-3.6.0.min.js"},
            {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
            {src: "https://cdn.jsdelivr.net/npm/admin-lte@3.1/dist/js/adminlte.min.js"},
            {src: "https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js"},
            {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"}
        ];
        return res.render('hr/login', {title: "HR - Login", loadJS, loadCSS})
    }
})

router.use(auth)

router.get("/", (req, res) => {
    const photo = "http://localhost:3000/assets/uploads" + req.session.photoHR;
    const nama = req.session.namaHR;
    const loadJS = [
        {src: "https://code.jquery.com/jquery-3.6.0.min.js"},
        {src: "https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"},
        {src: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/admin-lte/3.2.0-rc/js/adminlte.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/tempusdominus-bootstrap-4/5.39.0/js/tempusdominus-bootstrap-4.min.js"}
    ];

    const loadCSS = [
        {src: "https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css"}
    ];
    const routePath = "/";
    return res.render('hr/index', {title: "HR - Dashboard", loadJS, loadCSS, routePath, nama, photo})
})

router.get('/karyawan', (req, res) => {
    let connect = DB.config;
    const routePath = "/karyawan";
    const photo = "http://localhost:3000/assets/uploads" + req.session.photoHR;
    const nama = req.session.namaHR;
    const loadCSS = [
        {src: "https://cdn.datatables.net/1.11.2/css/dataTables.bootstrap4.min.css"},
        {src: "https://cdn.datatables.net/responsive/2.2.9/css/responsive.bootstrap4.min.css"},
        {src: "https://cdn.datatables.net/buttons/2.0.0/css/buttons.bootstrap4.min.css"}
    ];
    const loadJS = [
        {src: "https://code.jquery.com/jquery-3.6.0.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/admin-lte/3.2.0-rc/js/adminlte.min.js"},
        {src: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"},
        {src: "https://cdn.datatables.net/1.11.2/js/jquery.dataTables.min.js"},
        {src: "https://cdn.datatables.net/1.11.2/js/dataTables.bootstrap4.min.js"},
        {src: "https://cdn.datatables.net/responsive/2.2.9/js/dataTables.responsive.js"},
        {src: "https://cdn.datatables.net/responsive/2.2.9/js/responsive.bootstrap4.min.js"},
        {src: "https://cdn.datatables.net/buttons/2.0.0/js/buttons.bootstrap4.min.js"},
        {src: "https://cdn.datatables.net/buttons/2.0.0/js/dataTables.buttons.js"}
    ];
    //Query Select
    connect.query("SELECT karyawan.nip, karyawan.nama, divisi.nama AS divisi, bagian.nama AS bagian, karyawan.jabatan FROM karyawan JOIN bagian ON bagian.id = karyawan.id_bagian JOIN divisi ON bagian.id_divisi = divisi.id ORDER BY karyawan.nip ASC;", (err, result, field) => {
        if (!err)
            return res.render('hr/karyawan', {
                title: "HR - Karyawan",
                loadJS,
                loadCSS,
                routePath,
                result,
                nama,
                photo
            });
    })
})

router.get('/tambah-karyawan', (req, res) => {
    const photo = "http://localhost:3000/assets/uploads" + req.session.photoHR;
    const nama = req.session.namaHR;
    const loadJS = [
        {src: "https://code.jquery.com/jquery-3.6.0.min.js"},
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/admin-lte/3.2.0-rc/js/adminlte.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
    ];
    const loadCSS = [
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css"}
    ];
    const routePath = "/karyawan";
    return res.render('hr/tambah-karyawan', {
        title: "HR - Tambah Karyawan",
        loadJS,
        routePath,
        loadCSS,
        nama,
        photo
    })
})

router.get('/edit-karyawan/:nip', (req, res) => {
    let id = req.params.nip;
    const photo = "http://localhost:3000/assets/uploads" + req.session.photoHR;
    const nama = req.session.namaHR;
    const loadJS = [
        {src: "https://code.jquery.com/jquery-3.6.0.min.js"},
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/admin-lte/3.2.0-rc/js/adminlte.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"}
    ];
    const loadCSS = [
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css"}
    ];
    const routePath = "/karyawan";
    return res.render('hr/edit-karyawan', {
        title: "HR - Edit Karyawan",
        loadJS,
        routePath,
        loadCSS,
        id,
        nama,
        photo
    })
})

module.exports = router;
