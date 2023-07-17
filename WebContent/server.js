var config = require('./nodeConfig.js'),
    fs = require('fs'),
    http = require('http'),
    https = require('https'),
    mkdirp = require('mkdirp'),
    nodeStatic = require('node-static'),
    url = require('url'),
    request = require('request');

function getProjectDirectoryName() {
    return config.target.clientDirectory;
}

function getProjectStaticFileDirectoryName() {
    return config.target.staticFileDirectory || '';
}

function getServerRequestUrl(projectKey, requestedUrl) {
    return config.target.server + requestedUrl.replace('/' + projectKey, '');
}

function pathOfCacheFile(req, projectDirectoryName) {
    var a = req.url;
    a = a.replace(projectDirectoryName, '');
    a = a.replace(/\//g, '--').replace(/\?/g, '-').replace(/&/g, '-').replace(/</g, '-').replace(/>/g, '-').replace(/\./g, '-').replace(/\:/g, '-');
    a = a + '_' + req.method;
    return '.cache/' + projectDirectoryName + '/' + a + '.json';
}

function readFromServer(projectName, req, res) {
    let serverRequestUrl = getServerRequestUrl(projectName, req.url);
    var proxiedReq = req.pipe(request(serverRequestUrl));

    proxiedReq.on('response', function (response) {
        console.log('response ' + serverRequestUrl + ': ' + response.statusCode);
        if (response.statusCode === 200 && config.cacheFiles) {
            var cachedFile = fs.createWriteStream(pathOfCacheFile(req, getProjectDirectoryName()));
            proxiedReq.pipe(cachedFile);
        }
    }).on('error', function (error) {
        console.error('error ' + serverRequestUrl + ':\n' + error.stack);
        res.writeHead(598, error.message);
        res.write(error.stack);
        res.end();
    });

    proxiedReq.pipe(res);
    console.log('read form server ' + serverRequestUrl);
}

function makeCacheFolder(projectDirectoryName) {
    mkdirp('.cache/' + projectDirectoryName, function (err) {});
}

function requestListener(req, res) {
    var activeProxy = false;

    var serverContentUrls = [
        /\/(.*)\/api\/(.*)/,
        /\/(.*)\/login\.jsp/,
        /\/(.*)\/login\.html/,
		/\/(.*)\/login/,
        // /\/(.*)\/index\.html/,
        /(.*)\/j_spring_(.*)/,
        /(.*)\/auth(.*)\//,
        /\/(.*)\/files\/(.*)/,
        /\/(.*)\/cnodefiles\/(.*)/,
        /\/(.*)\/captcha\/(.*)/,
        /\/(.*)\/thumbnail\/(.*)/,
        /\/(.*)\/app\/authentication/,
        /\/(.*)\/app\/rest\/(.*)/,
        /\/(.*)\/logout/
    ];

    //activeProxy =  activeProxy || req.url.match(/\/(.*)\/api\/(.*)/) && !req.url.match(/\/(.*)\/api\/config/);
    for (var i = 0; i < serverContentUrls.length; i++) {
        activeProxy = activeProxy || req.url.match(serverContentUrls[i]);
        if (activeProxy) {
            break;
        }
    }

    var indexOfSecondSlash = req.url.indexOf('/', 1);
    if (indexOfSecondSlash < 0) {
        res.writeHead(302, {'location': req.url + '/'});
        res.end();
        return;
    }

    var strippedUrl = req.url.substring(indexOfSecondSlash);
    var projectName = 'Kateb'

    if (!config.target) {
        res.end();
    } else {
        if (config.cacheFiles)
            makeCacheFolder(getProjectDirectoryName());

        if (activeProxy) {
            //////////////////////// read from server /////////////////////////////
            if (config.readFromMock) {
                var foundCachedFileStream = fs.createReadStream(pathOfCacheFile(req, getProjectDirectoryName()));
                foundCachedFileStream.on('error', function (err) {
                    console.log('can\'t find cached file: ' + err);
                    if (!config.neverConnectToServer) {
                        readFromServer(projectName, req, res);
                    } else {
                        //req.abort();
                        res.setTimeout(5);
                    } //file.read();
                });
                foundCachedFileStream.pipe(res);
                console.log('read form cache= ' + pathOfCacheFile(req, getProjectDirectoryName()));
            } else {
                readFromServer(projectName, req, res);
            }
        } else {
            //////////////////////// read from local (static) /////////////////////
            req.addListener('end', function () {
                
                var staticFiles = new nodeStatic.Server('', {
                    cache: 0,
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    }
                });
                req.url = strippedUrl;
                staticFiles.serve(req, res, function (err, result) {
                    if (err) { // There was an error serving the file
                        console.log('Error serving ' + req.url + ' - ' + err.message + ' - ' + getProjectDirectoryName() + ' - ' + projectName);
                        // Respond to the client
                        res.writeHead(err.status, err.headers);
                        res.end();
                    }
                });
            }).resume();
        }
    }
}

// enable ssl in args
if (process.argv.slice(2).includes('ssl')) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    var sslOptions = {
        key: fs.readFileSync('key.pem'),
        cert: fs.readFileSync('cert.pem')
    };
    https.createServer(sslOptions, requestListener).listen(7443);
    console.log('Start all services on 7443 (ssl)');
} else {
    http.createServer(requestListener).listen(7080);
    console.log('Start all services on 7080');
}
