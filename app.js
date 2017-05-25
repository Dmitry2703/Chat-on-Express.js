const express = require('express');
const http = require('http');
const path = require('path');
const debug = require('debug')('app');
const config = require('./config');

const app = express();
app.engine('ejs', require('ejs-locals'));

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(express.favicon());
if (app.get('env') === 'development') {
  app.use(express.logger('dev'));
} else {
  app.use(express.logger('default'));
}
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));

app.use((err, req, res, next) => {
  if (app.get('env') === 'development') {
    const errorHandler = express.errorHandler();
    errorHandler(err, req, res, next);
  } else {
    res.send(500);
  }
});

app.get('/', (req, res) => res.render('index'));

http.createServer(app).listen(config.get('port'), () => {
  debug(`Express server listening on port ${config.get('port')}`);
});
