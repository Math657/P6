const https = require('https')
const app = require('./app')


app.set('port', process.env.PORT || 3000)
const server = https.createServer(app)

server.listen(process.env.PORT || 3000)