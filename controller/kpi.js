const DB = require("./config")

const getOneKPI = async (req, res) => {
    try {
        let connect = DB.config
        let id = req.params.id
        connect.query("SELECT * FROM kpi WHERE id_divisi = ?", [id], (err, result) => {
            if (!err)
                return res.json({
                    code: 1,
                    message: "Succes!",
                    data: result
                })
            else
                return res.json({
                    code: 0,
                    message: "Maaf, telah terjadi kesalahan!"
                })
        })
    } catch (e) {
        console.log(e)
    }
}

const editKPI = async (req, res) => {
    try {
        let connect = DB.config
        let kpi = req.body.kpi
        let id_divisi = req.body.id_divisi
        let count = 0
        //Delete data lama
        connect.query("DELETE FROM kpi WHERE id_divisi = ?", [id_divisi], (err, result) => {
            if (!err) {
                if (kpi.length > 0) {
                    let sql = 'INSERT INTO kpi VALUES'
                    kpi.forEach(kpi => {
                        sql += '(' + kpi.id + ',' + kpi.id_divisi + ',"' + kpi.sasaran_kerja + '","' + kpi.kpi + '",' + kpi.bobot_kpi + ',' + kpi.target + '),'
                    })
                    sql = sql.slice(0, -1)
                    console.log(sql)
                    connect.query(sql, (err1, result1) => {
                        if (!err1)
                            return res.json({
                                code: 1,
                                message: "Berhasil memperbarui data KPI!"
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

const tambahKPI = async (req, res) => {
    try {
        let connect = DB.config
        let kpi = req.body.kpi
        let id_divisi = req.body.id_divisi
        let count = 0
        //Pengecekan
        connect.query("SELECT * FROM kpi WHERE id_divisi = ?", [id_divisi], (err, result) => {
            if (result.length > 0)
                return res.json({
                    code: 0,
                    message: "Divisi ini sudah memili KPI! Jikalau ingin menambahkan jumlah KPI, harap menggunakan" +
                        " menu update!"
                })
            else {
                if (kpi.length > 0) {
                    let sql = 'INSERT INTO kpi VALUES'
                    kpi.forEach(kpi => {
                        sql += '(' + kpi.id + ',' + kpi.id_divisi + ',"' + kpi.sasaran_kerja + '","' + kpi.kpi + '",' + kpi.bobot_kpi + ',' + kpi.target + '),'
                    })
                    sql = sql.slice(0, -1)
                    console.log(sql)
                    connect.query(sql, (err1, result1) => {
                        if (!err1)
                            return res.json({
                                code: 1,
                                message: "Berhasil menambahkan data KPI!"
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
            }
        })
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    tambahKPI,
    getOneKPI,
    editKPI
}