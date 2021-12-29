const DB = require('./config');

const renderAllBagianPage = async (req, res) => {
    let connect = DB.config;
    const routePath = "/bagian";
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
    connect.query("SELECT bagian.id, bagian.nama, bagian.jam_masuk, bagian.jam_keluar, bagian.lembur, divisi.nama AS divisi FROM bagian JOIN divisi ON bagian.id_divisi = divisi.id ORDER BY bagian.nama ASC;", (err, result, field) => {
        console.log(result);
        if (!err)
            return res.render('admin/bagian', {
                title: "Admin - Bagian",
                routePath,
                result,
                loadJS,
                loadCSS,
                nama,
                photo
            })
    });
}

const renderEditBagianPage = async (req, res) => {
    let connect = DB.config;
    let aksi = "";
    let id = req.query.id;
    const photo = "http://localhost:3000/assets/uploads" + req.session.photoAdmin;
    const nama = req.session.namaAdmin;
    const loadJS = [
        {src: "https://code.jquery.com/jquery-3.6.0.min.js"},
        {src: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/admin-lte/3.2.0-rc/js/adminlte.min.js"},
    ];
    connect.query("SELECT * FROM bagian WHERE id = ?", [id], (error, result, field) => {
        if (!error) {
            connect.query("SELECT * FROM divisi", (err, result2) => {
                if (!err) {
                    let json = {
                        id: result[0].id,
                        id_divisi: result[0].id_divisi,
                        nama: result[0].nama,
                        lembur: result[0].lembur,
                        jam_masuk: result[0].jam_masuk,
                        jam_keluar: result[0].jam_keluar,
                        jobdesk: result[0].jobdesk
                    };
                    return res.render("admin/edit-bagian", {
                        title: "Admin - Edit Bagian",
                        loadJS,
                        json,
                        result: result2,
                        nama,
                        photo
                    });
                }//endif kedua
            });
        }//endif pertama
        else
            return res.redirect("/admin/bagian")
    });
}

const addBagian = async (req, res) => {
    let data = req.body;
    let connect = DB.config;
    //Query Pengecekan
    connect.query("SELECT * FROM bagian WHERE nama = ?", [data.nama], (err, result, field) => {
        if (!err) {
            //Jika divisi sudah ada di database
            if (result.length > 0)
                return res.json({code: 0, message: "Data bagian sudah ada di database!"})
            else {
                if (insertBagian(data))
                    return res.json({code: 1, message: "Berhasil menyimpan data bagian!"})
                else
                    return res.json({code: 0, message: "Terjadi kesalahan, harap hubungi admin!"})
            }//endif
        } else
            return res.json({code: 0, message: "Terjadi kesalahan, harap hubungi admin!"})//endif
    })
}

const getAllBagian = async (req, res) => {
    let connect = DB.config;
    let id = req.params.id
    //query
    connect.query("SELECT bagian.id, bagian.nama, divisi.nama AS divisi FROM bagian JOIN divisi ON bagian.id_divisi = divisi.id WHERE divisi.id = ?",[id], (err, result, field) => {
        if (!err)
            res.json(result);
    })
}

const editBagian = async (req, res) => {
    let data = req.body;
    let connect = DB.config;
    //Query Pengecekan
    connect.query("SELECT * FROM bagian WHERE nama = ?", [data.nama], (err, result, field) => {
        if (!err) {
            //Jika nama divisi sudah ada di database
            if (result.length > 0)
                return res.redirect("/admin/edit-bagian?id=" + data.id + "&error=ada")
            else {
                if (updateBagian(data))
                    return res.redirect("/admin/bagian")
                else
                    return res.redirect("/admin/edit-bagian?id=" + data.id + "&error=db")
            }//endif
        } else
            return res.redirect("/admin/edit-bagian?id=" + data.id + "&error=db")
    })
}

async function insertBagian(data) {
    const connect = DB.config;
    let jobdesk = null;
    if (data.jobdesk != null || data.jobdesk != undefinied || data.jobdesk !== "")
        jobdesk = data.jobdesk;
    let query = "INSERT INTO bagian(nama,id_divisi,lembur,jam_masuk,jam_keluar, jobdesk) VALUES(?,?,?,?,?,?)";
    connect.query(query, [data.nama, data.id_divisi, data.lembur, data.jam_masuk, data.jam_keluar, jobdesk], (err, result, field) => {
        if (!err)
            return true
        else
            return false
    })
}

async function updateBagian(data) {
    const connect = DB.config;
    let jobdesk = null;
    if (data.jobdesk != null || data.jobdesk != undefinied)
        jobdesk = data.jobdesk;
    let query = "UPDATE bagian SET nama = ?, id_divisi = ?, lembur = ?, jam_masuk = ?, jam_keluar = ?, jobdesk = ? WHERE id = ?";
    connect.query(query, [data.nama, data.divisi, data.lembur, data.jam_masuk, data.jam_keluar, jobdesk, data.id], (err, result, field) => {
        if (!err)
            return true
        else
            return false
    })
}

module.exports = {
    renderAllBagianPage,
    addBagian,
    renderEditBagianPage,
    editBagian,
    getAllBagian
}
