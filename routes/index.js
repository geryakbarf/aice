module.exports = (app) => {
    app.use('/admin', require('./admin'))
    app.use('/api', require('./api'))
    app.use('/hr', require('./hr'))
    app.use('/kpi', require('./kpi'))
    //404
    app.use((req, res) => {
        return res.render('404', {title: "404 Not Found :("})
    })
}
