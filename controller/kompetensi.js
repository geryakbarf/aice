const DB = require("./config")

const tambahKompetensi = async (req, res) => {
    try {
        let connect = DB.config
        let kompetensi = req.body.kompetensi
        let id_bagian = req.body.id_bagian
        let count = 0
        //Pengecekan
        connect.query("SELECT * FROM kompetensi_kerja WHERE id_bagian = ?", [id_bagian], (err, result) => {
            if (result.length > 0)
                return res.json({
                    code: 0,
                    message: "Bagian ini sudah memili Kompetensi! Jikalau ingin menambahkan jumlah Kompetensi, harap menggunakan" +
                        " menu update!"
                })
            else {
                if (kompetensi.length > 0) {
                    let sql = 'INSERT INTO kompetensi_kerja VALUES'
                    kompetensi.forEach(kompetensi => {
                        sql += '(' + kompetensi.id + ',' + kompetensi.id_bagian + ',"' + kompetensi.kompetensi + '","' + kompetensi.detail + '"),'
                    })
                    sql = sql.slice(0, -1)
                    console.log(sql)
                    connect.query(sql, (err1, result1) => {
                        if (!err1)
                            return res.json({
                                code: 1,
                                message: "Berhasil menambahkan data Kompetensi!"
                            })
                        else {
                            console.log(err1)
                            return res.json({
                                code: 0,
                                message: "Terjadi kesalahan! Harap hubungi sysadmin!"
                            })
                        }
                    })
                } else
                    return res.json({
                        code: 0,
                        message: "Terjadi kesalahan! Harap hubungi sysadmin2!"
                    })
            }
        })
    } catch (e) {
        console.log(e)
    }
}

const updateKompetensi = async (req, res) => {
    try {
        let connect = DB.config
        let kompetensi = req.body.kompetensi
        let id_bagian = req.body.id_bagian
        let count = 0
        //Delete data lama
        connect.query("DELETE FROM kompetensi_kerja WHERE id_bagian = ?", [id_bagian], (err, result) => {
            if (!err) {
                if (kompetensi.length > 0) {
                    let sql = 'INSERT INTO kompetensi_kerja VALUES'
                    kompetensi.forEach(kompetensi => {
                        sql += '(' + kompetensi.id + ',' + kompetensi.id_bagian + ',"' + kompetensi.kompetensi + '","' + kompetensi.detail + '"),'
                    })
                    sql = sql.slice(0, -1)
                    console.log(sql)
                    connect.query(sql, (err1, result1) => {
                        if (!err1)
                            return res.json({
                                code: 1,
                                message: "Berhasil memperbarui data Kompetensi!"
                            })
                        else
                            return res.json({
                                code: 0,
                                message: "Terjadi kesalahan! Harap hubungi sysadmin!"
                            })
                    })
                } else
                    return res.json({
                        code: 0,
                        message: "Terjadi kesalahan! Harap hubungi sysadmin2!"
                    })
            }//endif
            else
                return res.json({
                    code: 0,
                    message: "Terjadi kesalahan! Harap hubungi sysadmin2!"
                })
        })//end delete query
    } catch (e) {
        console.log(e)
    }
}

const getAllKompetensi = async (req, res) => {
    let connect = DB.config
    connect.query("SELECT * FROM kompetensi_kerja WHERE id_bagian = ?", [req.params.id], (err, result) => {
        if (!err) {
            let data = []
            for (let i = 0; i < result.length; i++) {
                let json = {
                    id: result[i].id,
                    id_bagian: result[i].id_bagian,
                    kompetensi: result[i].kompetensi,
                    detail: result[i].detail,
                    skor: 0
                }
                data.push(json)
            }
            return res.json({
                code: 1,
                data: data
            })
        } else
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