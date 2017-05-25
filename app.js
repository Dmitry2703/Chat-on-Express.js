const express = require('express');
const http = require('http');
const path = require('path');
const debug = require('debug')('app');
const config = require('./config');
const HttpError = require('./error').HttpError;

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

// app.use(require('./middleware/sendHttpError'));

app.use(app.router);

require('./routes')(app);

app.use(express.static(path.join(__dirname, 'public')));

app.use((err, req, res, next) => {
  if (typeof err === 'number') {
    err = new HttpError(err);
  }

  if (err instanceof HttpError) {
    res.sendHttpError(err);
  } else {
    if (app.get('env') === 'development') {
      express.errorHandler()(err, req, res, next);
    } else {
      err = new HttpError(500);
      res.sendHttpError(err);
    }
  }
});

http.createServer(app).listen(config.get('port'), () => {
  debug(`Express server listening on port ${config.get('port')}`);
});
