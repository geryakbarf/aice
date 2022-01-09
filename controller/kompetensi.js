const DB = require("./config")

const tambahKompetensi = async (req, res) => {
    try {
        let connect = DB.config
        let kompetensi = req.body.kompetensi
        let detail = null
        if (req.body.detail)
            detail = req.body.detail
        //query insert
        connect.query("INSERT INTO kompetensi_kerja(kompetensi,detail) VALUES(?,?)", [kompetensi, detail], (err, result, field) => {
            if (!err)
                return res.json({
                    code: 1,
                    message: "Berhasil menambahkan data kompetensi kerja!"
                })
            else
                return res.json({
                    code: 0,
                    message: "Terjadi kesalahan! Mohon periksa koneksi internet anda atau hubungi sysadmin!"
                })
        })
    } catch (e) {
        console.log(e)
    }
}

const updateKompetensi = async (req, res) => {
    try {
        let connect = DB.config
        let id = req.body.id
        let kompetensi = req.body.kompetensi
        let detail = null
        if (req.body.detail)
            detail = req.body.detail
        //Update database
        connect.query("UPDATE kompetensi_kerja SET kompetensi = ?, detail = ? WHERE id = ?", [kompetensi, detail, id], (err, result, field) => {
            if (!err)
                return res.json({
                    code: 1,
                    message: "Berhasil memperbarui data kompetensi kerja!"
                })
            else
                return res.json({
                    code: 0,
                    message: "Terjadi kesalahan!"
                })
        })
    } catch (e) {
        console.log(e)
    }
}

const getAllKompetensi = async (req, res) => {
    let connect = DB.config
    connect.query("SELECT * FROM kompetensi_kerja", (err, result) => {
        if (!err) {
            let data = []
            for(let i = 0; i < result.length; i++){
                let json = {
                    id : result[i].id,
                    kompetensi : result[i].kompetensi,
                    detail : result[i].detail,
                    skor : 0
                }
                data.push(json)
            }
            return res.json({
                code: 1,
                data: data
            })
        }
        else
            return res.json({
                code: 0,
                message: "Terjadi kesalahan! Harap hubungi admin!"
            })
    })
}

module.exports = {
    tambahKompetensi,
    updateKompetensi,
    getAllKompetensi
}