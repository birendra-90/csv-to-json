// BASE SETUP
// =============================================================================

// call the packages we need
var express       = require('express');
var bodyParser    = require('body-parser');
var app           = express();
var morgan        = require('morgan');
var ConvertToJSON = require('./app/models/ConvertToJSON');

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set our port
var port     = process.env.PORT || 8080;


// ROUTES FOR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    console.info('CSV to JSON are converting......');
    next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to Instarem assignment!' });   
});

// on routes that end in /convert/csv/to/json?q=link
// ----------------------------------------------------
router.route('/convert/csv/to/json?')
            // convert csv to json from csv file
      .get(function(req, res) {
        if (req.query.q) {
          ConvertToJSON.convertToJson(req.query.q, function(error, result) {
              if (error) {
                res.send('Error while converting csv to json. Error: ' + error);
              }
              res.json(result);
            });
        } else {
          res.send('Please enter valid url!');
        }
      });

// REGISTER OUR ROUTES -------------------------------
app.use('/', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.info('Server has been started.');
console.info('Server is listening on http://localhost:' + port + '/');
