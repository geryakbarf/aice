const DB = require("./config")

function formatDate() {
    let d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
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
    getDetailAbsensi
}