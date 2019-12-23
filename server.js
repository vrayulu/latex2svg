const express = require('express'),
    helmet = require('helmet'),
    bodyParser = require('body-parser'),
    port = 80,
    threads = 1,
    compression = require('compression');

const createAppServer = () => {
    const app = express();

    app.use(helmet());

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        next();
    });

    app.use(bodyParser.json({
        limit: '1mb'
    }));

    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(express.json());

    //compresses the angular bundle size further by using gzipped encoding for faster loading
    app.use(compression());

    require('./routes')(app);
    module.exports = app;

    return app;
}
const app = createAppServer();
app.listen(port, () => console.log(`service is running on port ${port} with ${process.pid} pid`));