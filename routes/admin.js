const express = require('express');
const router = express.Router();
const Divisi = require('../controller/divisi');
const Bagian = require('../controller/bagian');
const Karyawan = require('../controller/karyawan');
const DB = require('../controller/config');
const auth = require('../middleware/sess_adm_auth');

router.get("/login", (req, res) => {
    const loadJS = [
        {src: "https://cdn.jsdelivr.net/npm/admin-lte@3.1/dist/js/adminlte.min.js"},
        {src: "https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js"}
    ];
    return res.render('admin/login', {title: "Admin - Login", loadJS})
})

router.post("/login", Karyawan.login);

router.use(auth);

router.get("/", (req, res) => {
    const photo = "http://localhost:3000/assets/uploads" + req.session.photoAdmin;
    const nama = req.session.namaAdmin;
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
    return res.render('admin/index', {title: "Admin - Dashboard", loadJS, loadCSS, routePath, nama, photo})
})

router.get('/karyawan', Karyawan.renderKaryawanPage);

router.get("/divisi", Divisi.renderAllDivisiPage);

router.get('/edit-divisi/:id', (req, res) => {
    const photo = "http://localhost:3000/assets/uploads" + req.session.photoAdmin;
    const nama = req.session.namaAdmin;
    const id = req.params.id
    const loadCSS = [
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css"}
    ];
    const loadJS = [
        {src: "https://code.jquery.com/jquery-3.6.0.min.js"},
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/admin-lte/3.2.0-rc/js/adminlte.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
        {src: "/assets/js/form-divisi.js"}
    ];
    const routePath = "/divisi";
    return res.render('admin/edit-divisi', {
        title: "Admin - Edit Divisi",
        loadJS,
        loadCSS,
        routePath,
        nama,
        photo,
        id
    })


});

router.get('/edit-bagian', Bagian.renderEditBagianPage);

router.get("/bagian", Bagian.renderAllBagianPage);

router.get('/tambah-divisi', (req, res) => {
    const photo = "http://localhost:3000/assets/uploads" + req.session.photoAdmin;
    const nama = req.session.namaAdmin;
    const loadCSS = [
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css"}
    ];
    const loadJS = [
        {src: "https://code.jquery.com/jquery-3.6.0.min.js"},
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/admin-lte/3.2.0-rc/js/adminlte.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
        {src: "/assets/js/form-divisi.js"}
    ];
    const routePath = "/divisi";
    if (req.query.id)
        aksi = req.query.id;
    return res.render('admin/tambah-divisi', {title: "Admin - Tambah Divisi", loadJS, loadCSS, routePath, nama, photo})
})

router.get('/tambah-karyawan', (req, res) => {
    const photo = "http://localhost:3000/assets/uploads" + req.session.photoAdmin;
    const nama = req.session.namaAdmin;
    const loadJS = [
        {src: "https://code.jquery.com/jquery-3.6.0.min.js"},
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/admin-lte/3.2.0-rc/js/adminlte.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
        {src: "/assets/js/form-karyawan.js"}
    ];
    const loadCSS = [
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css"}
    ];
    const routePath = "/karyawan";
    return res.render('admin/tambah-karyawan', {
        title: "Admin - Tambah Karyawan",
        loadJS,
        routePath,
        loadCSS,
        nama,
        photo
    })
})

router.get('/edit-karyawan', (req, res) => {
    let id = req.query.nip;
    const photo = "http://localhost:3000/assets/uploads" + req.session.photoAdmin;
    const nama = req.session.namaAdmin;
    const loadJS = [
        {src: "https://code.jquery.com/jquery-3.6.0.min.js"},
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/admin-lte/3.2.0-rc/js/adminlte.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
        {src: "/assets/js/form-karyawan-update.js"}
    ];
    const loadCSS = [
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css"}
    ];
    const routePath = "/karyawan";
    return res.render('admin/edit-karyawan', {
        title: "Admin - Edit Karyawan",
        loadJS,
        routePath,
        loadCSS,
        id,
        nama,
        photo
    })
})

router.get('/tambah-bagian', (req, res) => {
    const photo = "http://localhost:3000/assets/uploads" + req.session.photoAdmin;
    const nama = req.session.namaAdmin;
    const routePath = "/bagian";
    const loadCSS = [
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css"}
    ];
    const loadJS = [
        {src: "https://code.jquery.com/jquery-3.6.0.min.js"},
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/admin-lte/3.2.0-rc/js/adminlte.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
        {src: "/assets/js/form-bagian.js"}
    ];
    return res.render('admin/tambah-bagian', {
        title: "Admin - Tambah Bagian",
        loadJS,
        routePath,
        nama,
        photo,
        loadCSS
    })
})

router.get('/logout', (req, res) => {
    delete req.session.isAuthenticated;
    delete req.session.nipAdmin;
    delete req.session.namaAdmin;
    delete req.session.photoAdmin;
    delete req.session.emailAdmin;
    return res.redirect("/admin/login");
})

module.exports = router;
