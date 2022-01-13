const express = require('express');
const router = express.Router();
const Karyawan = require("../controller/karyawan")
const fetch = require("node-fetch");
const DB = require('../controller/config');
const auth = require('../middleware/sess_hr_auth');

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

router.get('/kompetensi', (req, res) => {
    let connect = DB.config;
    const routePath = "/kompetensi";
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
    //Query SELECT
    connect.query("SELECT * FROM kompetensi_kerja", (err, result, field) => {
        if (!err)
            return res.render('hr/kompetensi', {
                title: "HR - Kompetensi Kerja",
                routePath,
                result,
                loadJS,
                loadCSS,
                nama,
                photo
            })
    });
})

router.get('/tambah-kompetensi', (req, res) => {
    const photo = "http://localhost:3000/assets/uploads" + req.session.photoHR;
    const nama = req.session.namaHR;
    const routePath = "/kompetensi";
    const loadCSS = [
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css"}
    ];
    const loadJS = [
        {src: "https://code.jquery.com/jquery-3.6.0.min.js"},
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/admin-lte/3.2.0-rc/js/adminlte.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"}
    ];
    return res.render('hr/tambah-kompetensi', {
        title: "HR - Tambah Kompetensi",
        loadJS,
        routePath,
        nama,
        photo,
        loadCSS
    })
})

router.get("/edit-kompetensi/:id", (req, res) => {
    let connect = DB.config;
    let id = req.params.id;
    const photo = "http://localhost:3000/assets/uploads" + req.session.photoHR;
    const nama = req.session.namaHR;
    const loadCSS = [
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css"}
    ];
    const loadJS = [
        {src: "https://code.jquery.com/jquery-3.6.0.min.js"},
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/admin-lte/3.2.0-rc/js/adminlte.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"}
    ];
    connect.query("SELECT * FROM kompetensi_kerja WHERE id = ?", [id], (error, result, field) => {
        if (!error) {
            return res.render("hr/edit-kompetensi", {
                title: "Admin - Edit Bagian",
                loadJS,
                id: result[0].id,
                kompetensi: result[0].kompetensi,
                detail: result[0].detail,
                nama,
                photo,
                loadCSS
            });
        } else
            return res.redirect("/hr/kompetensi")
    });
})

router.get('/kpi', (req, res) => {
    let connect = DB.config;
    const routePath = "/kpi";
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
    //Query SELECT
    connect.query("SELECT divisi.nama, divisi.id FROM divisi JOIN kpi ON divisi.id = kpi.id_divisi GROUP BY divisi.id", (err, result, field) => {
        if (!err)
            return res.render('hr/kpi', {
                title: "HR - Key Performance Index",
                routePath,
                result,
                loadJS,
                loadCSS,
                nama,
                photo
            })
    });
})

router.get('/tambah-kpi', (req, res) => {
    const photo = "http://localhost:3000/assets/uploads" + req.session.photoHR;
    const nama = req.session.namaHR;
    const routePath = "/kpi";
    const loadCSS = [
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css"}
    ];
    const loadJS = [
        {src: "https://code.jquery.com/jquery-3.6.0.min.js"},
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/admin-lte/3.2.0-rc/js/adminlte.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"}
    ];
    return res.render('hr/tambah-kpi', {
        title: "HR - Tambah KPI",
        loadJS,
        routePath,
        nama,
        photo,
        loadCSS
    })
})

router.get('/edit-kpi/:id/:nama', (req, res) => {
    let connect = DB.config
    const id = req.params.id
    const namaDivisi = req.params.nama
    const photo = "http://localhost:3000/assets/uploads" + req.session.photoHR;
    const nama = req.session.namaHR;
    const routePath = "/kpi";
    const loadCSS = [
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css"}
    ];
    const loadJS = [
        {src: "https://code.jquery.com/jquery-3.6.0.min.js"},
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/admin-lte/3.2.0-rc/js/adminlte.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"}
    ];
    //Query SELECT
    connect.query("SELECT * FROM kpi WHERE id_divisi = ?", [id], (err, result, field) => {
        if (!err)
            return res.render('hr/edit-kpi', {
                title: "HR - Edit KPI",
                routePath,
                result,
                loadJS,
                loadCSS,
                nama,
                photo,
                namaDivisi,
                id
            })
    });
})

router.get('/penilaian', (req, res) => {
    let connect = DB.config;
    const routePath = "/penilaian";
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
    //Query SELECT
    connect.query("SELECT karyawan.nip, karyawan.nama, bagian.nama AS bagian, divisi.nama AS divisi, penilaian.id, penilaian.tanggal, penilaian.total_skor_kpi, penilaian.rata_rata, penilaian.skor_kompetensi, penilaian.kesimpulan_skor FROM penilaian JOIN karyawan ON karyawan.nip = penilaian.nip JOIN bagian ON karyawan.id_bagian = bagian.id JOIN divisi ON divisi.id = bagian.id_divisi ORDER BY penilaian.tanggal DESC", (err, result, field) => {
        if (!err)
            return res.render('hr/penilaian', {
                title: "HR - Penilaian",
                routePath,
                result,
                loadJS,
                loadCSS,
                nama,
                photo
            })
    });
})

router.get('/penilaian/:nip', (req, res) => {
    let connect = DB.config
    const nip = req.params.nip
    const photo = "http://localhost:3000/assets/uploads" + req.session.photoHR;
    const nama = req.session.namaHR;
    const routePath = "/penilaian";
    const loadCSS = [
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css"}
    ];
    const loadJS = [
        {src: "https://code.jquery.com/jquery-3.6.0.min.js"},
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/admin-lte/3.2.0-rc/js/adminlte.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"}
    ];
    //Query SELECT
    connect.query("SELECT karyawan.nip, karyawan.nama, karyawan.id_bagian, bagian.nama AS nama_bagian, divisi.id AS id_divisi, divisi.nama AS nama_divisi, email, alamat, nomor_kontak, jatah_cuti, jabatan, photo FROM karyawan JOIN bagian ON karyawan.id_bagian = bagian.id JOIN divisi ON divisi.id = bagian.id_divisi WHERE karyawan.nip = ?", [nip], (err, result, field) => {
        if (!err)
            return res.render('hr/tambah-penilaian', {
                title: "HR - Penilaian Karyawan",
                routePath,
                result,
                loadJS,
                loadCSS,
                nama,
                photo,
                nip
            })
    });
})

router.get('/penilaian/detail/:id/:nip', (req, res) => {
    let connect = DB.config
    const nip = req.params.nip
    const idNilai = req.params.id
    const photo = "http://localhost:3000/assets/uploads" + req.session.photoHR;
    const nama = req.session.namaHR;
    const routePath = "/penilaian";
    const loadCSS = [
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css"}
    ];
    const loadJS = [
        {src: "https://code.jquery.com/jquery-3.6.0.min.js"},
        {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
        {src: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/admin-lte/3.2.0-rc/js/adminlte.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"}
    ];
    //Query SELECT
    connect.query("SELECT karyawan.nip, karyawan.nama, karyawan.id_bagian, bagian.nama AS nama_bagian, divisi.id AS id_divisi, divisi.nama AS nama_divisi, email, alamat, nomor_kontak, jatah_cuti, jabatan, photo FROM karyawan JOIN bagian ON karyawan.id_bagian = bagian.id JOIN divisi ON divisi.id = bagian.id_divisi WHERE karyawan.nip = ?", [nip], (err, result, field) => {
        if (!err)
            return res.render('hr/detail-penilaian', {
                title: "HR - Detail Penilaian Karyawan",
                routePath,
                result,
                loadJS,
                loadCSS,
                nama,
                photo,
                nip,
                idNilai
            })
    });
})

router.get('/logout', (req, res) => {
    delete req.session.isHRAuthenticated
    delete req.session.nipHR
    delete req.session.bagianHR
    delete req.session.emailHR
    delete req.session.namaHR
    delete req.session.photoHR
    return res.redirect("/hr/login");
})

module.exports = router;
