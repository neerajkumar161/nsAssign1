const cors = require('cors');
const path = require('path');
const config = require('config');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');

const utils = require('./utils');

const PORT = config.get('PORT');
const MONGO_URI = config.get('MONGODB_URL');

const app = express();

const route = require('./routes');
console.log('NODE_ENVIRONMENT', process.env.NODE_ENV);

//Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  config.get('PATHS.IMAGE.USER.STATIC'),
  express.static(path.join(__dirname, config.get('PATHS.IMAGE.USER.ACTUAL')))
);
app.use(
  config.get('PATHS.IMAGE.PRODUCT.STATIC'),
  express.static(path.join(__dirname, config.get('PATHS.IMAGE.PRODUCT.ACTUAL')))
);

app.use((req, res, next) => {
  const info = req.method + ' ' + res.statusCode + ' ' + req.originalUrl || req.url;
  console.log('API HIT -------------->', info, '\n|\nv\n|\nv\n');
  if (!req.header('lang') || req.header('lang') == '') req.lang = 'en';
  else req.lang = req.header('lang');
  next();
});
// Test Api
app.use('/test', async (req, res, next) => {
  utils.jwtSignRS256('randomId');
  res.status(200).send({ status: 200, message: 'TEST API' });
});

// Routes Api
app.use('/api', route);

// Error Middleware
app.use((error, req, res, next) => {
  console.log('Error Midleware=================================>', error, ' ==> ', error.message);
  let status = error.status || 400;
  if (error.message) error = error.message;
  return utils.errorResponse(res, status, error);
});

// Server Listening
app.listen(PORT, () => {
  console.log('=========== PORT ' + PORT + ' ================');
});

// Mongoose Connection
mongoose
  .connect(MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((result) => {
    console.log('=========== Connected to MongoDB ============');
  })
  .catch((err) => {
    throw new Error('MongoDB Connection Error!', err);
  });
