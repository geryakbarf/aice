const DB = require('./config');
const {error} = require("winston");

const addDivisi = async (req, res) => {
    let data = req.body;
    let connect = DB.config;
    //Query Pengecekan
    connect.query("SELECT * FROM divisi WHERE nama LIKE ?", [data.nama], (err, result, field) => {
        if (!err) {
            //Jika divisi sudah ada di database
            if (result.length > 0)
                return res.json({code: 0, message: "Data divisi sudah ada di database!"})
            else {
                if (insertDivisi(data))
                    return res.json({code: 1, message: "Berhasil menambahkan data divisi!"})
                else
                    return res.json({code: 0, message: "Terjadi kesalahan, harap hubungi admin!"})
            }//endif
        } else
            return res.json({code: 0, message: "Terjadi kesalahan, harap hubungi adnmin!"})//endif
    })
}

const editDivisi = async (req, res) => {
    let data = req.body;
    let connect = DB.config;
    //Query Pengecekan
    connect.query("SELECT * FROM divisi WHERE nama LIKE ?", [data.nama], (err, result, field) => {
        if (!err) {
            //Jika nama divisi sudah ada di database
            if (result.length > 0)
                return res.json({code: 0, message: "Data divisi sudah ada di database!"})
            else {
                if (updateDivisi(data))
                    return res.json({code: 1, message: "Berhasil memperbarui data divisi!"})
                else
                    return res.json({code: 0, message: "Terjadi kesalahan, harap hubungi admin!"})
            }//endif
        } else
            return res.json({code: 0, message: "Terjadi kesalahan, harap hubungi admin!"})
    })
}

const renderAllDivisiPage = async (req, res) => {
    let connect = DB.config;
    const routePath = "/divisi";
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
    //Query SELECT
    connect.query("SELECT * FROM divisi ORDER BY nama ASC", (err, result, field) => {
        if (!err)
            return res.render('admin/division', {
                title: "Admin - Divisi",
                routePath,
                result,
                loadJS,
                loadCSS,
                nama,
                photo
            })
    });
}

const getAllDivision = async (req, res) => {
    let connect = DB.config
    connect.query('SELECT * FROM divisi ORDER BY nama ASC', (error, result, field) => {
        if (!error)
            return res.json({code: 1, data: result})
        else
            return res.json({code: 0, message: "Maaf terjadi kesalahan! Silahkan Hubungi admin!"})
    })
}

const getOneDivision = async (req, res) => {
    let connect = DB.config;
    let id = req.params.id;
    connect.query('SELECT * FROM divisi WHERE id = ?', [id], (error, result, field) => {
        if (!error) {
            let data = {
                id: result[0].id,
                nama: result[0].nama
            }
            return res.json({code: 1, data})
        } else
            return res.json({code: 0, message: "Terjadi kesalahan saat memuat data divisi!"})
    })
}

async function insertDivisi(data) {
    const connect = DB.config;
    let query = "INSERT INTO divisi(nama) VALUES(?)";
    connect.query(query, [data.nama], (err, result, field) => {
        if (!err)
            return true
        else
            return false
    })
}

async function updateDivisi(data) {
    const connect = DB.config;
    let query = "UPDATE divisi SET nama = ? WHERE id = ?";
    connect.query(query, [data.nama, data.id], (err, result, field) => {
        if (!err)
            return true
        else
            return false
    })
}

module.exports = {
    addDivisi,
    renderAllDivisiPage,
    getOneDivision,
    editDivisi,
    getAllDivision
}
