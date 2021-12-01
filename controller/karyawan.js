const DB = require('./config');
const {error} = require("winston");

const renderKaryawanPage = async (req, res) => {
    let connect = DB.config;
    const routePath = "/karyawan";
    const photo = "http://localhost:3000/assets/uploads" + req.session.photoAdmin;
    const nama = req.session.namaAdmin;
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
            return res.render('admin/karyawan', {
                title: "Admin - Karyawan",
                loadJS,
                loadCSS,
                routePath,
                result,
                nama,
                photo
            });
    })
}

const tambahKaryawan = async (req, res) => {
    let data = req.body;
    let nama = null;
    let email = null;
    let jabatan = null;
    let photo = null;
    //
    if (req.body.nama)
        nama = data.nama;
    if (req.body.email)
        email = data.email;
    if (req.body.jabatan)
        jabatan = data.jabatan;
    if (req.body.photo)
        photo = data.photo;
    //
    let connect = DB.config;
    //Pengecekan nip
    connect.query("SELECT * FROM karyawan WHERE nip = ?", [data.nip], (err, result, field) => {
        if (result.length > 0)
            return res.json({code: 0, message: "Data nip sudah ada!"})
    });
    connect.query("INSERT INTO karyawan(nip,id_bagian,nama,email,jabatan,photo) VALUES(?,?,?,?,?,?)", [data.nip, data.id_bagian, nama, email, jabatan, photo], (err, result, field) => {
        if (!err)
            return res.json({code: 1, message: "Berhasil menambahkan data karyawan baru!"})
        else
            return res.json({code: 0, message: "Terjadi kesalahan, harap hubungi super admin!"})
    })
}

const updateKaryawan = async (req, res) => {
    let data = req.body;
    let nama = null;
    let email = null;
    let jabatan = null;
    let photo = null;
    let alamat = null;
    let nomor_kontak = null;
    //
    if (req.body.nama)
        nama = data.nama;
    if (req.body.email)
        email = data.email;
    if (req.body.jabatan)
        jabatan = data.jabatan;
    if (req.body.photo)
        photo = data.photo;
    if (req.body.alamat)
        alamat = data.alamat;
    if (req.body.nomor_kontak)
        nomor_kontak = data.nomor_kontak;
    //
    let connect = DB.config;
    connect.query("UPDATE karyawan SET id_bagian = ?, nama = ?, email = ?, alamat = ?, nomor_kontak = ?, jabatan = ?, photo = ? WHERE nip = ?", [data.id_bagian, nama, email, alamat, nomor_kontak, jabatan, photo, data.nip], (err, result, field) => {
        if (!err)
            return res.json({code: 1, message: "Berhasil memperbarui data karyawan!"})
        else
            return res.json({code: 0, message: "Terjadi kesalahan, harap hubungi super admin!"})
    })
}

const getKaryawan = async (req, res) => {
    let connect = DB.config;
    let {nip} = req.params;
    connect.query("SELECT * FROM karyawan WHERE nip = ?", [nip], (err, result, field) => {
        return res.json({
            nip: nip,
            id_bagian: result[0].id_bagian,
            nama: result[0].nama,
            email: result[0].email,
            jabatan: result[0].jabatan,
            photo: result[0].photo,
            alamat: result[0].alamat,
            nomor_kontak: result[0].nomor_kontak
        });
    });
}

const login = async (req, res) => {
    const loadJS = [
        {src: "https://cdn.jsdelivr.net/npm/admin-lte@3.1/dist/js/adminlte.min.js"},
        {src: "https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js"}
    ];
    let connect = DB.config;
    const {email, password} = req.body;
    try {
        //Pengecekan Email
        connect.query("SELECT * FROM karyawan WHERE email = ?", [email], (err, result, field) => {
            if (result.length <= 0)
                return res.render('admin/login', {title: "Admin - Login", loadJS, error: 1})
        });
        //Pengecekan akun
        connect.query("SELECT * FROM karyawan WHERE email = ? AND password = PASSWORD(?)", [email, password], (err, result, field) => {
            if (result.length > 0) {
                req.session.isAuthenticated = true;
                req.session.nipAdmin = result[0].nip;
                req.session.emailAdmin = result[0].email;
                req.session.namaAdmin = result[0].nama;
                req.session.photoAdmin = result[0].photo;
                return res.redirect('/admin');
            } else
                return res.render('admin/login', {title: "Admin - Login", loadJS, error: 2});
        });

    } catch (e) {
        console.log(e)
    }
}

const loginKaryawan = async (req, res) => {
    let connect = DB.config
    let {email} = req.body
    //Pengecekan email
    connect.query("SELECT * FROM karyawan WHERE email = ?", [email], (error, result, field) => {
        if (result.length > 0) {
            connect.query("SELECT * FROM karyawan WHERE email = ? AND alamat IS NOT NULL", [email], (err, hasil) => {
                if (hasil.length > 0) {
                    return res.json({
                        code: 1,
                        nip: hasil[0].nip,
                        nama: hasil[0].nama,
                        email: hasil[0].email,
                        id_bagian: hasil[0].id_bagian,
                        photo: hasil[0].photo
                    })
                } else
                    return res.json({code: 0, message: "Silahkan melengkapi data diri anda"})
            })
        } else
            return res.json({code: 0, message: "Silahkan melengkapi data diri anda"})
    })
}

const registerKaryawan = async (req, res) => {
    let connect = DB.config
    let {email, nip, nama, alamat, nomor_kontak} = req.body
    //Pengecekan NIP
    connect.query("SELECT * FROM karyawan WHERE nip = ? AND status = ?", [nip, "Inactive"], (err, result) => {
        if (result.length === 0) {
            return res.json({
                code: 0,
                message: "NIP Tidak terdaftar! Hanya karyawan Aice yang bisa menggunakan aplikasi ini!"
            })
        } else {
            //Update Data Karyawan
            connect.query("UPDATE karyawan SET nama = ?, alamat = ?, nomor_kontak = ?, email = ?, status = ? WHERE nip = ?", [nama, alamat, nomor_kontak, email, "Active", nip], (err, result) => {
                if (err) {
                    return res.json({
                        code: 0,
                        message: "Terjadi kesalahan, periksa koneksi internet anda atau hubungi admin!"
                    })
                } else {
                    //Select Data Diri Karyawan
                    connect.query("SELECT * FROM karyawan WHERE nip = ?", [nip], (err, result) => {
                        return res.json({
                            code: 1,
                            message: "Berhasil melengkapi data anda! Selamat datang di Aice Apps!",
                            nip: result[0].nip,
                            nama: result[0].nama,
                            email: result[0].email,
                            id_bagian: result[0].id_bagian,
                            photo: result[0].photo
                        })
                    })
                }
            })
        }
    })
}

module.exports = {
    renderKaryawanPage,
    tambahKaryawan,
    getKaryawan,
    updateKaryawan,
    login,
    loginKaryawan,
    registerKaryawan
}
