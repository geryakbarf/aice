const express = require('express');
const router = express.Router();
const fetch = require("node-fetch");
const Divisi = require('../controller/divisi');
const Bagian = require('../controller/bagian');
const Karyawan = require('../controller/karyawan');
const auth = require('../middleware/sess_adm_auth');
const baseURL = "http://localhost:3000"

router.get("/login", (req, res) => {
    if (req.session.isAuthenticated)
        return res.redirect('/admin')
    else {
        const loadJS = [
            {src: "https://cdn.jsdelivr.net/npm/admin-lte@3.1/dist/js/adminlte.min.js"},
            {src: "https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js"}
        ];
        return res.render('admin/login', {title: "Admin - Login", loadJS})
    }
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

router.get("/absensi", async (req, res) => {
    const routePath = "/absensi"
    const photo = "http://localhost:3000/assets/uploads" + req.session.photoAdmin;
    const nama = req.session.namaAdmin;
    const loadCSS = [
        {src: "https://cdn.datatables.net/1.11.2/css/dataTables.bootstrap4.min.css"},
        {src: "https://cdn.datatables.net/responsive/2.2.9/css/responsive.bootstrap4.min.css"},
        {src: "https://cdn.datatables.net/buttons/2.0.0/css/buttons.bootstrap4.min.css"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css"}
    ];
    const loadJS = [
        {src: "https://code.jquery.com/jquery-3.6.0.min.js"},
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/admin-lte/3.2.0-rc/js/adminlte.min.js"},
        {src: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"},
        {src: "https://cdn.datatables.net/1.11.2/js/jquery.dataTables.min.js"},
        {src: "https://cdn.datatables.net/1.11.2/js/dataTables.bootstrap4.min.js"},
        {src: "https://cdn.datatables.net/responsive/2.2.9/js/dataTables.responsive.js"},
        {src: "https://cdn.datatables.net/responsive/2.2.9/js/responsive.bootstrap4.min.js"},
        {src: "https://cdn.datatables.net/buttons/2.0.0/js/buttons.bootstrap4.min.js"},
        {src: "https://cdn.datatables.net/buttons/2.0.0/js/dataTables.buttons.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
        {src: "/assets/js/form-absensi-main.js"}
    ];
    //
    let absensi = []
    let result = await fetch(baseURL + '/api/main-absensi')
    let data = await result.json()
    if (data.code > 0)
        absensi = data.data
    //
    return res.render('admin/absensi', {
        title: "Admin - Absensi",
        routePath,
        loadJS,
        absensi,
        loadCSS,
        nama,
        photo
    })
})

router.get("/absensi/detail/:id/:tanggal", async (req, res) => {
    const routePath = "/absensi"
    const id = req.params.id
    const photo = "http://localhost:3000/assets/uploads" + req.session.photoAdmin;
    const nama = req.session.namaAdmin;
    const loadCSS = [
        {src: "https://cdn.datatables.net/1.11.2/css/dataTables.bootstrap4.min.css"},
        {src: "https://cdn.datatables.net/responsive/2.2.9/css/responsive.bootstrap4.min.css"},
        {src: "https://cdn.datatables.net/buttons/2.0.0/css/buttons.bootstrap4.min.css"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css"}
    ];
    const loadJS = [
        {src: "https://code.jquery.com/jquery-3.6.0.min.js"},
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/admin-lte/3.2.0-rc/js/adminlte.min.js"},
        {src: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"},
        {src: "https://cdn.datatables.net/1.11.2/js/jquery.dataTables.min.js"},
        {src: "https://cdn.datatables.net/1.11.2/js/dataTables.bootstrap4.min.js"},
        {src: "https://cdn.datatables.net/responsive/2.2.9/js/dataTables.responsive.js"},
        {src: "https://cdn.datatables.net/responsive/2.2.9/js/responsive.bootstrap4.min.js"},
        {src: "https://cdn.datatables.net/buttons/2.0.0/js/buttons.bootstrap4.min.js"},
        {src: "https://cdn.datatables.net/buttons/2.0.0/js/dataTables.buttons.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"},
        {src: "/assets/js/form-absensi-detail.js"}
    ];
    //
    let absensi = []
    let result = await fetch(baseURL + '/api/detail-absensi/' + id)
    let data = await result.json()
    let tanggal = new Date(req.params.tanggal).toLocaleDateString('id-ID', {
        weekday: "long",
        year: "numeric", month: "short", day: "numeric"
    })
    if (data.code > 0)
        absensi = data.data
    //
    return res.render('admin/detail-absensi', {
        title: "Admin - Absensi",
        routePath,
        tanggal,
        loadJS,
        absensi,
        loadCSS,
        nama,
        photo
    })
})

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

router.post('/absensi/qr', (req, res) => {
    let idAbsensi = req.body.id
    const loadJS = [
        {src: "https://code.jquery.com/jquery-3.6.0.min.js"},
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://cdn.jsdelivr.net/combine/npm/qrcanvas@3,npm/qrcanvas-vue@2"},
        {src: "/assets/js/form-absensi-qr.js"}
    ]
    return res.render('admin/qr', {
        title: "Admin - QR Code Absensi",
        loadJS,
        idAbsensi
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
