const express = require('express');
const http = require('http');
const path = require('path');
const debug = require('debug')('app');
const config = require('./config');

const app = express();
app.set('port', config.get('port'));

http.createServer(app).listen(app.get('port'), () => {
  debug('Express server listening on port ' + config.get('port'));
});

app.use((req, res, next) => {
  if (req.url === '/') {
    res.end('Hello!')
  } else {
    next();
  }
});

app.use((req, res, next) => {
  if (req.url === '/forbidden') {
    next(new Error('wops, access denied!'));
  } else {
    next();
  }
});

app.use((err, req, res, next) => {
  if (app.get('env') === 'development') {
    const errorHandler = express.errorHandler();
    errorHandler(err, req, res, next)
  } else {
    res.send(500);
  }
});
