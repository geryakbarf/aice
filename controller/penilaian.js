const DB = require('./config')

function getTodayDate() {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let today = year + "-" + month + "-" + date;
    return today
}

const insertPenialain = async (req, res) => {
    let connect = DB.config
    let data = req.body
    try {
        connect.query("INSERT INTO penilaian VALUES(?,?,?,?,?,?,?)", [data.id, data.nip, getTodayDate(), data.total_skor_kpi, data.rata_rata, data.total_skor_kompetensi, data.skor_akhir], (error, result) => {
            if (!error) {
                data.kpi.forEach(item => {
                    connect.query("INSERT INTO detail_penilaian_kpi VALUES(?,?,?,?,?,?,?,?)", [data.id, item.sasaran_kerja, item.kpi, item.bobot_kpi, item.target, item.realisasi, item.skor, item.skor_akhir], (error1, result1) => {
                        //TODO Nothing
                    })
                })
                data.kompetensi.forEach(item => {
                    connect.query("INSERT INTO detail_penilaian_kompetensi_kerja VALUES(?,?,?,?)", [data.id, item.kompetensi, item.detail, item.nilai], (error1, result1) => {
                        //TODO Nothing
                    })
                })
                return res.json({
                    code: 1,
                    message: "Berhasil!"
                })
            } else
                return res.json({
                    code: 0,
                    message: "Terjadi Kesalahan!"
                })
        })
    } catch (e) {
        console.log(e)
        return res.json({
            code: 0,
            message: "Terjadi Kesalahan!"
        })
    }
}

const getOnePenilaian = async (req, res) => {
    let connect = DB.config
    let id = req.params.id
    try {
        connect.query("SELECT * FROM penilaian WHERE id = ?", [id], (error, result) => {
            return res.json({
                data: result
            })
        })
    } catch (e) {
        console.log(e)
    }
}

const getPenilaianKPI = async (req, res) => {
    let connect = DB.config
    let id = req.params.id
    try {
        connect.query("SELECT * FROM detail_penilaian_kpi WHERE id_penilaian = ?", [id], (error, result) => {
            return res.json({
                data: result
            })
        })
    } catch (e) {
        console.log(e)
    }
}

const getPenilaianKompetensi = async (req, res) => {
    let connect = DB.config
    let id = req.params.id
    try {
        connect.query("SELECT * FROM detail_penilaian_kompetensi_kerja WHERE id_penilaian = ?", [id], (error, result) => {
            return res.json({
                data: result
            })
        })
    } catch (e) {
        console.log(e)
    }
}

const validasiPenilaian = async (req, res) => {
    let connect = DB.config
    let nip = req.params.nip
    try {
        connect.query("SELECT * FROM penilaian WHERE nip = ? AND MONTH(tanggal) = MONTH(CURRENT_DATE()) AND YEAR(tanggal) = YEAR(CURRENT_DATE())", [nip], (error, result) => {
            if (result.length > 0)
                return res.json({code: 0, message: "Karyawan ini sudah dinilai pada bulan ini!"})
            else {
                //Mengambil id_bagian dari tabel karyawan
                connect.query("SELECT * FROM karyawan WHERE nip = ?", [nip], (error1, result1) => {
                    //Mengecek apakah bagian sudah memiliki KPI dan Kompetensi Kerja Belum
                    connect.query("SELECT kompetensi_kerja.id_bagian, kpi.id_bagian FROM kompetensi_kerja JOIN kpi ON kompetensi_kerja.id_bagian = kpi.id_bagian WHERE kpi.id_bagian = ?", [result1[0].id_bagian], (error2, result2) => {
                        if (result2.length > 0)
                            return res.json({code: 1})
                        else
                            return res.json({
                                code: 0,
                                message: "Maaf, bagian karyawan ini belum memiliki KPI atau kompetensi kerja, silahkan tambahkan terlebih dahulu!"
                            })
                    })
                })
            }
        })
    } catch (e) {
        console.log(e)
    }
}

const getAverageKPI = async (req, res) => {
    let connect = DB.config
    try {
        connect.query("SELECT AVG(kesimpulan_skor) AS average FROM penilaian WHERE MONTH(tanggal) = MONTH(CURRENT_DATE() - INTERVAL 1 MONTH) AND YEAR(tanggal) = YEAR(CURRENT_DATE())", (error, result) => {
            return res.json({data: result[0]})
        })
    } catch (e) {
        console.log(e)
    }
}

const getHighestKPI = async (req, res) => {
    let connect = DB.config
    try {
        connect.query("SELECT kesimpulan_skor, karyawan.nama FROM penilaian JOIN karyawan ON karyawan.nip = penilaian.nip WHERE MONTH(tanggal) = MONTH(CURRENT_DATE() - INTERVAL 1 MONTH) AND YEAR(tanggal) = YEAR(CURRENT_DATE()) ORDER BY kesimpulan_skor DESC", (error, result) => {
            return res.json({data: result[0]})
        })
    } catch (e) {
        console.log(e)
    }
}

const getLowestKPI = async (req, res) => {
    let connect = DB.config
    try {
        connect.query("SELECT kesimpulan_skor, karyawan.nama FROM penilaian JOIN karyawan ON karyawan.nip = penilaian.nip WHERE MONTH(tanggal) = MONTH(CURRENT_DATE() - INTERVAL 1 MONTH) AND YEAR(tanggal) = YEAR(CURRENT_DATE()) ORDER BY kesimpulan_skor ASC", (error, result) => {
            return res.json({data: result[0]})
        })
    } catch (e) {
        console.log(e)
    }
}

const getStatistikKPI = async (req, res) => {
    let connect = DB.config
    try {
        connect.query("SELECT AVG(kesimpulan_skor) AS statistik FROM penilaian WHERE YEAR(tanggal) = YEAR(CURRENT_DATE()) GROUP BY MONTH(tanggal) ASC", (error, result) => {
            return res.json({data: result})
        })
    } catch (e) {
        console.log(e)
    }
}

const getEmployeStatistikKPI = async (req, res) => {
    let connect = DB.config
    let {nip} = req.params
    try {
        connect.query("SELECT AVG(kesimpulan_skor) AS statistik FROM penilaian WHERE YEAR(tanggal) = YEAR(CURRENT_DATE()) AND nip = ? GROUP BY MONTH(tanggal) ASC", [nip], (error, result) => {
            return res.json({data: result})
        })
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    insertPenialain,
    getOnePenilaian,
    getPenilaianKPI,
    getPenilaianKompetensi,
    validasiPenilaian,
    getAverageKPI,
    getHighestKPI,
    getLowestKPI,
    getStatistikKPI,
    getEmployeStatistikKPI
}
