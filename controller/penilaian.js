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

module.exports = {
    insertPenialain,
    getOnePenilaian,
    getPenilaianKPI,
    getPenilaianKompetensi
}