const http = require('http')
const https = require('https');
const fs = require('fs');
const app = require('./bootstrap')
const port = 3000
const portSecure = 443

http.createServer(app).listen(port, () => {
    console.log(`Listen the app at :${port}`)
})
