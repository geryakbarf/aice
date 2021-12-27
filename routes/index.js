module.exports = (app) => {
    app.use('/admin', require('./admin'))
    app.use('/api', require('./api'))
    app.use('/hr', require('./hr'))
    //404
    app.use((req, res) => {
        return res.render('404', {title: "404 Not Found :("})
    })
}
