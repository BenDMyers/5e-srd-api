const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const { bugsnagMiddleware } = require('./bugsnag');

// enable cors in preflight
app.options('*', cors());

// Middleware stuff
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bugsnagMiddleware.requestHandler);
app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('short'));
app.use(cors({ origin: '*' }));

// Register routes
app.get('/', require('./controllers/indexController'));
app.get('/docs', require('./controllers/docsController'));
app.use('/api', require('./routes/api'));

app.use(function(req, res, _next) {
  res.status(404);

  // TODO: Add a fun 404 page
  // // respond with html page
  // if (req.accepts('html')) {
  //   res.render('404', { url: req.url });
  //   return;
  // }

  // default respond with json
  return res.send({ error: 'Not found' });
});

app.use(bugsnagMiddleware.errorHandler);

module.exports = app;
