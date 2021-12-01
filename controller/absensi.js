const DB = require("./config")

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

const addMainAbseni = async (req, res) => {
    const today = req.body.today
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
    addMainAbseni
}