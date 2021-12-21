const DB = require("./config")
const moment = require("moment");

function formatDate() {
    let d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function getTodayTime() {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let currentTime = year + "-" + month + "-" + date + " " + hours + ":" + minutes;
    return currentTime
}

function getCurrentTime() {
    let date_ob = new Date();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let currentTime = hours + ":" + minutes;
    return currentTime
}

function getTodayDate() {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let today = year + "-" + month + "-" + date;
    return today
}

const getMainAbsensi = async (req, res) => {
    let connect = DB.config
    try {
        //Query SELECT
        connect.query("SELECT absensi.tanggal, absensi.id, COUNT(IF(detail_absensi.status='Hadir',1,null)) AS jumlah_hadir, COUNT(IF(detail_absensi.status='Izin',1,null)) AS jumlah_izin, COUNT(IF(detail_absensi.status='Hadir',1,null)) + COUNT(IF(detail_absensi.status='Izin',1,null)) - (SELECT COUNT(*)) AS jumlah_alfa, (SELECT COUNT(*) FROM karyawan) AS jumlah_karyawan FROM absensi LEFT JOIN detail_absensi ON absensi.id = detail_absensi.id_absensi GROUP BY absensi.id", (err, result, field) => {
            if (!err)
                return res.json({
                    code: 1,
                    message: "Berhasil mendapatkan data!",
                    data: result
                })
            else
                return res.json({
                    code: 0,
                    message: "Terjadi kesalahan saat mengambil data!"
                })
        })
    } catch (e) {
        console.log(e)
    }
}

const getDetailAbsensi = async (req, res) => {
    try {
        let connect = DB.config
        let id = req.params.id
        //Query
        connect.query("SELECT detail_absensi.id_absensi, karyawan.nip, karyawan.nama AS nama_karyawan, bagian.nama AS nama_bagian, detail_absensi.tipe_absensi, detail_absensi.jam_absensi, detail_absensi.cara_absensi, detail_absensi.status, detail_absensi.detail_status FROM karyawan JOIN bagian ON karyawan.id_bagian = bagian.id LEFT JOIN detail_absensi ON karyawan.nip = detail_absensi.nip AND detail_absensi.id_absensi = ?", [id], (err, result, field) => {
            if (!err) {
                console.log(result)
                return res.json({
                    code: 1,
                    message: "Berhasil mendapatkan data!",
                    data: result
                })
            } else
                return res.json({
                    code: 0,
                    message: "Terjadi kesalahan saat mengambil data!"
                })
        })
    } catch (e) {
        console.log(e)
    }
}

const absensiQR = async (req, res) => {
    const connect = DB.config
    try {
        let idBagian = req.body.idBagian
        let tipeabsensi = null
        let idAbsensi = req.body.idAbsensi
        let nip = req.body.nip
        //query
        connect.query("SELECT * FROM bagian WHERE id = ?", [idBagian], (err, result, field) => {
            //Seleksi Jam masuk
            if (!err) {
                let jamMasuk = result[0].jam_masuk
                let jamKeluar = result[0].jam_keluar
                let jamAbsensi = null
                let status = null
                //Pengecekan Apakah absensi masuk atau keluar
                connect.query("SELECT * FROM detail_absensi WHERE id_absensi = ? AND nip = ?", [idAbsensi, nip], (err1, result1, field1) => {
                    if (!err1) {
                        if (result1.length === 1) {
                            tipeabsensi = "Keluar"
                            jamAbsensi = jamKeluar
                        } else if (result1.length === 0) {
                            tipeabsensi = "Masuk"
                            jamAbsensi = jamMasuk
                        } else if (result1.length >= 2) {
                            return res.json({
                                code: 0,
                                message: "Anda sudah tidak bisa melakukan lagi absensi pada hari ini!"
                            })
                        }
                    }//endif
                    //Pengecekan tanggal absensi
                    connect.query("SELECT * FROM absensi WHERE id = ?", [idAbsensi], (err2, result2, field2) => {
                        if (!err2) {
                            if (moment(result2[0].tanggal).format('YYYY-MM-DD') !== getTodayDate())
                                return res.json({
                                    code: 0,
                                    message: "Tanggal absensi sudah tidak berlaku lagi!"
                                })
                            //Pengecekan apakah telat atau tepat
                            else {
                                let jamMasukAbsen = new Date(getTodayTime())
                                jamAbsensi = new Date(getTodayDate() + " " + jamAbsensi)
                                if (jamMasukAbsen.getTime() <= jamAbsensi.getTime() && tipeabsensi === "Masuk")
                                    status = "Hadir dengan tepat waktu menggunakan barcode QR"
                                else if (jamMasukAbsen.getTime() > jamAbsensi.getTime() && tipeabsensi === "Masuk")
                                    status = "Hadir dengan terlambat menggunakan barcode QR"
                                else if (jamMasukAbsen.getTime() < jamAbsensi.getTime() && tipeabsensi === "Keluar")
                                    status = "Absen pulang dengan jam pulang lebih awal dari jadwal"
                                else if (jamMasukAbsen.getTime() === jamAbsensi.getTime() && tipeabsensi === "Keluar")
                                    status = "Absen pulang dengan jam pulang tepat waktu"
                                else if (jamMasukAbsen.getTime() > jamAbsensi.getTime() && tipeabsensi === "Keluar")
                                    status = "Absen pulang dengan jam pulang melebihi jadwal"
                            }
                            //Insert data absensi ke database
                            connect.query("INSERT INTO detail_absensi VALUES(?,?,null,?,?,'QR',null,null,'Hadir',?)", [idAbsensi, nip, tipeabsensi, getCurrentTime(), status], (err3, result3, field3) => {
                                if (!err3)
                                    return res.json({code: 1, message: "Berhasil melakukan absensi!"})
                                else
                                    return res.json({
                                        code: 0,
                                        message: "Terjadi kesalahan! Periksa internet anda atau hubungi sysadmin"
                                    })
                            })
                        }//endif
                    })
                })
            }//endif
        })
    } catch (e) {
        console.log(e)
        return res.json({
            code: 0,
            message: "Terjadi kesalahan pada sistem!"
        })
    }
}

const addMainAbseni = async (req, res) => {
    const today = formatDate()
    const connect = DB.config
    try {
        connect.query("SELECT * FROM absensi WHERE tanggal = ?", [today], (err, result) => {
            if (!err)
                if (result.length <= 0) {
                    //Query menambahkan absensi
                    connect.query("INSERT INTO absensi (tanggal) VALUES (?)", [today], (err, result) => {
                        if (!err)
                            return res.json({code: 1, message: "Berhasil menambahkan absensi baru!"})
                        else
                            return res.json({
                                code: 0,
                                message: "Terjadi kesalahan! Periksa internet anda atau hubungi sysadmin"
                            })
                    })
                } else
                    return res.json({code: 0, message: "Data absensi sudah ada! Silahkan coba lagi di hari esok"})
        })
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    getMainAbsensi,
    addMainAbseni,
    getDetailAbsensi,
    absensiQR
}