const express = require('express');
const router = express.Router();
const Karyawan = require("../controller/karyawan")
const fetch = require("node-fetch");
const DB = require('../controller/config');
const auth = require('../middleware/sess_kpi_auth');

router.get('/login', (req, res) => {
    if (req.session.isKPIAuthenticated)
        return res.redirect('/kpi')
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
        return res.render('kpi/login', {title: "KPI - Login", loadJS, loadCSS})
    }
})

router.use(auth)

router.get('/karyawan', (req, res) => {
    const routePath = "/karyawan";
    const photo = "http://localhost:3000/assets/uploads" + req.session.photoKPI;
    const nama = req.session.namaKPI;
    const divisi = req.session.divisiKPI
    const nip = req.session.nipKPI
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
        {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"}
    ];
    return res.render('kpi/karyawan', {
        title: "KPI - Karyawan",
        loadJS,
        loadCSS,
        routePath,
        nama,
        photo,
        divisi,
        nip
    });
})

router.get('/statistik/:nip', (req, res) => {
    const routePath = "/karyawan";
    const photo = "http://localhost:3000/assets/uploads" + req.session.photoKPI;
    const nama = req.session.namaKPI;
    const divisi = req.session.divisiKPI
    const nip = req.session.nipKPI
    const id = req.params.nip
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
        {src: "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.1/chart.min.js"},
    ];
    return res.render('kpi/statistik', {
        title: "KPI - Statistik",
        loadJS,
        loadCSS,
        routePath,
        nama,
        photo,
        divisi,
        nip,
        id
    });
})

router.get("/", (req, res) => {
    const photo = "http://localhost:3000/assets/uploads" + req.session.photoKPI;
    const nama = req.session.namaKPI;
    const divisi = req.session.divisiKPI
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
    return res.render('kpi/index', {title: "KPI - Dashboard", loadJS, loadCSS, routePath, nama, photo, divisi})
})

router.get('/kompetensi', (req, res) => {
    let connect = DB.config;
    const routePath = "/kompetensi";
    const photo = "http://localhost:3000/assets/uploads" + req.session.photoKPI;
    const nama = req.session.namaKPI;
    const idDivisi = req.session.divisiKPI
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
    connect.query("SELECT kompetensi_kerja.id, kompetensi_kerja.kompetensi, kompetensi_kerja.detail, kompetensi_kerja.id_bagian, bagian.nama AS bagian, divisi.id AS id_divisi, divisi.nama AS divisi FROM kompetensi_kerja JOIN bagian ON bagian.id = kompetensi_kerja.id_bagian JOIN divisi ON bagian.id_divisi = divisi.id WHERE divisi.id = ? GROUP BY kompetensi_kerja.id_bagian", [idDivisi], (err, result, field) => {
        if (!err)
            return res.render('kpi/kompetensi', {
                title: "KPI - Kompetensi Kerja",
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
    const photo = "http://localhost:3000/assets/uploads" + req.session.photoKPI;
    const nama = req.session.namaKPI;
    const idDivisi = req.session.divisiKPI
    const namaDivisi = req.session.namaDivisi
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
    return res.render('kpi/tambah-kompetensi', {
        title: "KPI - Tambah Kompetensi",
        loadJS,
        routePath,
        nama,
        photo,
        loadCSS,
        idDivisi,
        namaDivisi
    })
})

router.get("/edit-kompetensi/:id_divisi/:divisi/:id_bagian/:bagian", (req, res) => {
    let connect = DB.config
    const idDivisi = req.params.id_divisi
    const namaDivisi = req.params.divisi
    const idBagian = req.params.id_bagian
    const namaBagian = req.params.bagian
    const photo = "http://localhost:3000/assets/uploads" + req.session.photoKPI;
    const nama = req.session.namaKPI;
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
//Query SELECT
    connect.query("SELECT * FROM kompetensi_kerja WHERE id_bagian = ?", [idBagian], (err, result, field) => {
        if (!err)
            return res.render('kpi/edit-kompetensi', {
                title: "KPI - Edit Kompetensi",
                routePath,
                result,
                loadJS,
                loadCSS,
                nama,
                photo,
                namaDivisi,
                idDivisi,
                idBagian,
                namaBagian
            })
    });
})

router.get('/kpi', (req, res) => {
    let connect = DB.config;
    const routePath = "/kpi";
    const photo = "http://localhost:3000/assets/uploads" + req.session.photoKPI;
    const nama = req.session.namaKPI;
    const idDivisi = req.session.divisiKPI
    const namaDivisi = req.session.namaDivisi
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
    connect.query("SELECT kpi.id, kpi.id_bagian, divisi.id AS id_divisi, sasaran_kerja, kpi, bobot_kpi, target, bagian.nama AS bagian, divisi.nama AS divisi FROM kpi JOIN bagian ON bagian.id = kpi.id_bagian JOIN divisi ON divisi.id = bagian.id_divisi WHERE divisi.id = ? GROUP BY kpi.id_bagian", [idDivisi], (err, result, field) => {
        if (!err)
            return res.render('kpi/kpi', {
                title: "KPI - Key Performance Index",
                routePath,
                result,
                loadJS,
                loadCSS,
                nama,
                photo,
                namaDivisi,
                idDivisi
            })
    });
})

router.get('/tambah-kpi', (req, res) => {
    const photo = "http://localhost:3000/assets/uploads" + req.session.photoKPI;
    const nama = req.session.namaKPI;
    const idDivisi = req.session.divisiKPI
    const namaDivisi = req.session.namaDivisi
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
    return res.render('kpi/tambah-kpi', {
        title: "KPI - Tambah KPI",
        loadJS,
        routePath,
        nama,
        photo,
        loadCSS,
        idDivisi,
        namaDivisi
    })
})

router.get('/edit-kpi/:id_divisi/:divisi/:id_bagian/:bagian', (req, res) => {
    let connect = DB.config
    const idDivisi = req.params.id_divisi
    const namaDivisi = req.params.divisi
    const idBagian = req.params.id_bagian
    const namaBagian = req.params.bagian
    const photo = "http://localhost:3000/assets/uploads" + req.session.photoKPI;
    const nama = req.session.namaKPI;
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
    connect.query("SELECT * FROM kpi WHERE id_bagian = ?", [idBagian], (err, result, field) => {
        if (!err)
            return res.render('kpi/edit-kpi', {
                title: "KPI - Edit KPI",
                routePath,
                result,
                loadJS,
                loadCSS,
                nama,
                photo,
                namaDivisi,
                idDivisi,
                idBagian,
                namaBagian
            })
    });
})

router.get('/penilaian', (req, res) => {
    let connect = DB.config;
    const routePath = "/penilaian";
    const photo = "http://localhost:3000/assets/uploads" + req.session.photoKPI;
    const nama = req.session.namaKPI;
    const idDivisi = req.session.divisiKPI
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
    connect.query("SELECT karyawan.nip, karyawan.nama, bagian.nama AS bagian, divisi.nama AS divisi, penilaian.id, penilaian.tanggal, penilaian.total_skor_kpi, penilaian.rata_rata, penilaian.skor_kompetensi, penilaian.kesimpulan_skor FROM penilaian JOIN karyawan ON karyawan.nip = penilaian.nip JOIN bagian ON karyawan.id_bagian = bagian.id JOIN divisi ON divisi.id = bagian.id_divisi WHERE divisi.id = ? ORDER BY penilaian.tanggal DESC", [idDivisi], (err, result, field) => {
        if (!err)
            return res.render('kpi/penilaian', {
                title: "KPI - Penilaian",
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
    const photo = "http://localhost:3000/assets/uploads" + req.session.photoKPI;
    const nama = req.session.namaKPI;
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
            return res.render('kpi/tambah-penilaian', {
                title: "KPI - Penilaian Karyawan",
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
    const photo = "http://localhost:3000/assets/uploads" + req.session.photoKPI;
    const nama = req.session.namaKPI;
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
            return res.render('kpi/detail-penilaian', {
                title: "KPI - Detail Penilaian Karyawan",
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
    delete req.session.isKPIAuthenticated
    delete req.session.nipKPI
    delete req.session.divisiKPI
    delete req.session.namaDivisi
    delete req.session.emailKPI
    delete req.session.namaKPI
    delete req.session.photoKPI
    return res.redirect("/kpi/login");
})

module.exports = router;
