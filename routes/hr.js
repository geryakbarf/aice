const express = require('express');
const router = express.Router();
const fetch = require("node-fetch");
const auth = require('../middleware/sess_hr_auth');

router.get('/login', (req, res) => {
    if (req.session.isHRAuthenticated)
        return res.redirect('/hr')
    else {
        const loadCSS = [
            {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css"}
        ];
        const loadJS = [
            {src: "https://code.jquery.com/jquery-3.6.0.min.js"},
            {src: "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"},
            {src: "https://cdn.jsdelivr.net/npm/admin-lte@3.1/dist/js/adminlte.min.js"},
            {src: "https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js"},
            {src: "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"}
        ];
        return res.render('hr/login', {title: "HR - Login", loadJS, loadCSS})
    }
})

router.use(auth)

router.get("/", (req, res) => {
    const photo = "http://localhost:3000/assets/uploads" + req.session.photoHR;
    const nama = req.session.namaHR;
    const loadJS = [
        {src: "https://code.jquery.com/jquery-3.6.0.min.js"},
        {src: "https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"},
        {src: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/admin-lte/3.2.0-rc/js/adminlte.min.js"},
        {src: "https://cdnjs.cloudflare.com/ajax/libs/tempusdominus-bootstrap-4/5.39.0/js/tempusdominus-bootstrap-4.min.js"}
    ];

    const loadCSS = [
        {src: "https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css"}
    ];
    const routePath = "/";
    return res.render('hr/index', {title: "HR - Dashboard", loadJS, loadCSS, routePath, nama, photo})
})

module.exports = router;
