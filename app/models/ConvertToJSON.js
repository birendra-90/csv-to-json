var request = require('request');
var Converter = require("csvtojson").Converter;

var CsvConverter = new Converter({constructResult:false});

module.exports = {
  /**
   * convertToJson() used for converting csv to json
   * @params: url
   * @return json objects
   */
  convertToJson: function(url, callback) {
    var objects = [];
  	CsvConverter.on("end_parsed", function (result) {
  	   callback(null, objects);
  	});
  	//record_parsed will be emitted each time a row has been parsed.
  	CsvConverter.on("record_parsed", function(result) {
        objects.push(result);
  	});
    request.get(url).pipe(CsvConverter);
  }
};