const DB = require('./config');
const {error} = require("winston");

const loginHR = async (req, res) => {
    let connect = DB.config;
    const {email, password} = req.body;
    try {
        //Pengecekan Email
        connect.query("SELECT * FROM karyawan WHERE email = ?", [email], (err, result, field) => {
            if (result.length <= 0)
                return res.json({
                    code: 0,
                    message: "Alamat email tidak terdaftar!"
                })
            else {
                //Pengecekan akun
                connect.query("SELECT * FROM karyawan WHERE email = ? AND password = PASSWORD(?)", [email, password], (err1, result1, field1) => {
                    if (result1.length > 0) {
                        //Pengecekan apakah hr atau bukan
                        connect.query("SELECT divisi.nama FROM divisi JOIN bagian ON bagian.id_divisi = divisi.id JOIN karyawan ON karyawan.id_bagian = bagian.id WHERE bagian.id = ?", [result1[0].id_bagian], (err2, result2, field2) => {
                            if (result2.length > 0 && result2[0].nama === "HR") {
                                req.session.isHRAuthenticated = true;
                                req.session.nipHR = result1[0].nip;
                                req.session.bagianHR = result1[0].id_bagian;
                                req.session.emailHR = result1[0].email;
                                req.session.namaHR = result1[0].nama;
                                req.session.photoHR = result1[0].photo;
                                return res.json({
                                    code: 1,
                                    message: "Selamat datang! Anda berhasil login!"
                                })
                            } else
                                return res.json({
                                    code: 0,
                                    message: "Maaf, hanya HR yang bisa masuk ke menu ini!"
                                })
                        })
                    } else
                        return res.json({
                            code: 0,
                            message: "Password anda salah!"
                        })
                });
            }
        });
    } catch (e) {
        console.log(e)
    }

}

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
    try {
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
    } catch (e) {
        console.log(e)
    }
}

const tambahKaryawan = async (req, res) => {
    try {
        let data = req.body;
        let nama = null;
        let email = null;
        let jabatan = null;
        let photo = null;
        let password = null;
        //
        if (req.body.nama)
            nama = data.nama;
        if (req.body.email)
            email = data.email;
        if (req.body.jabatan)
            jabatan = data.jabatan;
        if (req.body.photo)
            photo = data.photo;
        if (req.body.password)
            password = data.password
        //
        let connect = DB.config;
        //Pengecekan nip
        connect.query("SELECT * FROM karyawan WHERE nip = ?", [data.nip], (err, result, field) => {
            if (result.length > 0)
                return res.json({code: 0, message: "Data nip sudah ada!"})
            else {
                //Pengecekan apakah password Null
                if (password == null) {
                    connect.query("INSERT INTO karyawan(nip,id_bagian,nama,email,jabatan,photo) VALUES(?,?,?,?,?,?)", [data.nip, data.id_bagian, nama, email, jabatan, photo], (err, result, field) => {
                        if (!err)
                            return res.json({code: 1, message: "Berhasil menambahkan data karyawan baru!"})
                        else
                            return res.json({code: 0, message: "Terjadi kesalahan, harap hubungi super admin!"})
                    })
                } else {
                    connect.query("INSERT INTO karyawan(nip,id_bagian,nama,email,jabatan,photo,password) VALUES(?,?,?,?,?,?,PASSWORD(?))", [data.nip, data.id_bagian, nama, email, jabatan, photo, password], (err, result, field) => {
                        if (!err)
                            return res.json({code: 1, message: "Berhasil menambahkan data karyawan baru!"})
                        else
                            return res.json({code: 0, message: "Terjadi kesalahan, harap hubungi super admin!"})
                    })
                } //endif password
            } //endif pengecekan nip
        });
    } catch (e) {
        console.log(e)
    }
}

const updateKaryawan = async (req, res) => {
    let data = req.body;
    let nama = null;
    let email = null;
    let jabatan = null;
    let photo = null;
    let alamat = null;
    let nomor_kontak = null;
    let password = null;
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
    if (req.body.password)
        password = data.password
    //
    let connect = DB.config;
    try {
        if (password == null) {
            connect.query("UPDATE karyawan SET id_bagian = ?, nama = ?, email = ?, alamat = ?, nomor_kontak = ?, jabatan = ?, photo = ? WHERE nip = ?", [data.id_bagian, nama, email, alamat, nomor_kontak, jabatan, photo, data.nip], (err, result, field) => {
                if (!err)
                    return res.json({code: 1, message: "Berhasil memperbarui data karyawan!"})
                else
                    return res.json({code: 0, message: "Terjadi kesalahan, harap hubungi super admin!"})
            })
        } else {
            connect.query("UPDATE karyawan SET id_bagian = ?, nama = ?, email = ?, alamat = ?, nomor_kontak = ?, jabatan = ?, photo = ?, password = PASSWORD(?) WHERE nip = ?", [data.id_bagian, nama, email, alamat, nomor_kontak, jabatan, photo, password, data.nip], (err, result, field) => {
                if (!err)
                    return res.json({code: 1, message: "Berhasil memperbarui data karyawan!"})
                else
                    return res.json({code: 0, message: "Terjadi kesalahan, harap hubungi super admin!"})
            })
        }
    } catch (e) {
        console.log(e)
    }
}

const getKaryawan = async (req, res) => {
    let connect = DB.config;
    let {nip} = req.params;
    connect.query("SELECT karyawan.nip, karyawan.id_bagian, karyawan.nama, karyawan.email, karyawan.jabatan, karyawan.photo, karyawan.alamat, karyawan.nomor_kontak, bagian.id_divisi FROM karyawan JOIN bagian ON karyawan.id_bagian = bagian.id WHERE karyawan.nip = ?", [nip], (err, result, field) => {
        return res.json({
            nip: nip,
            id_bagian: result[0].id_bagian,
            nama: result[0].nama,
            email: result[0].email,
            jabatan: result[0].jabatan,
            photo: result[0].photo,
            alamat: result[0].alamat,
            nomor_kontak: result[0].nomor_kontak,
            id_divisi: result[0].id_divisi
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
        connect.query("SELECT * FROM karyawan WHERE email = ? AND password = PASSWORD(?) AND is_admin = ?", [email, password, "true"], (err, result, field) => {
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
                        idBagian: hasil[0].id_bagian,
                        photo: hasil[0].photo,
                        message: "Berhasil login, selamat datang di Aice Apps!"
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

const getAllKaryawan = async (req, res) => {
    let connect = DB.config
    try {
        connect.query("SELECT karyawan.nip, karyawan.nama, divisi.nama AS divisi, bagian.nama AS bagian, karyawan.jabatan FROM karyawan JOIN bagian ON bagian.id = karyawan.id_bagian JOIN divisi ON bagian.id_divisi = divisi.id ORDER BY karyawan.nip ASC", (error, result) => {
            return res.json({
                data: result
            })
        })
    } catch (e) {
        console.log(e)
    }
}

const getDivisiKaryawan = async (req, res) => {
    let connect = DB.config
    let id = req.params.id
    try {
        connect.query("SELECT karyawan.nip, karyawan.nama, divisi.nama AS divisi, bagian.nama AS bagian, karyawan.jabatan FROM karyawan JOIN bagian ON bagian.id = karyawan.id_bagian JOIN divisi ON bagian.id_divisi = divisi.id WHERE divisi.id = ? ORDER BY karyawan.nip ASC", [id], (error, result) => {
            return res.json({
                data: result
            })
        })
    } catch (e) {
        console.log(e)
    }
}

const loginKPI = async (req, res) => {
    let connect = DB.config
    let {email, password} = req.body
    try {
        //Pengecekan Email
        connect.query("SELECT * FROM karyawan WHERE email = ?", [email], (err, result, field) => {
            if (result.length <= 0)
                return res.json({code: 0, message: "Alamat email tidak terdaftar!"})
        });
        //Pengecekan akun
        connect.query("SELECT karyawan.nip, karyawan.nama, karyawan.email, karyawan.photo, divisi.id, divisi.nama AS divisi FROM karyawan JOIN bagian ON bagian.id = karyawan.id_bagian JOIN divisi ON bagian.id_divisi = divisi.id WHERE karyawan.email = ? AND karyawan.password = PASSWORD(?)", [email, password], (err, result, field) => {
            if (result.length > 0) {
                req.session.isKPIAuthenticated = true;
                req.session.nipKPI = result[0].nip;
                req.session.emailKPI = result[0].email;
                req.session.namaKPI = result[0].nama;
                req.session.photoKPI = result[0].photo;
                req.session.divisiKPI = result[0].id;
                req.session.namaDivisi = result[0].divisi;
                return res.json({code: 1, message: "Berhasil login!"})
            } else
                return res.json({code: 0, message: "Terjadi kesalahan!"})
        });
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    renderKaryawanPage,
    tambahKaryawan,
    getKaryawan,
    updateKaryawan,
    login,
    loginKaryawan,
    registerKaryawan,
    loginHR,
    getAllKaryawan,
    loginKPI,
    getDivisiKaryawan
}
