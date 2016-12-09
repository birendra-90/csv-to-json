// BASE SETUP
// =============================================================================

// call the packages we need
var express       = require('express');
var bodyParser    = require('body-parser');
var app           = express();
var morgan        = require('morgan');
var request = require('request');
var Converter = require("csvtojson").Converter;

var CsvConverter = new Converter({constructResult:false});

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
          var objects = [];
          CsvConverter.on("end_parsed", function (result) {
             res.json(objects);
          });
          //record_parsed will be emitted each time a row has been parsed.
          CsvConverter.on("record_parsed", function(result) {
              objects.push(result);
          });
          request.get(req.query.q).pipe(CsvConverter);
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
