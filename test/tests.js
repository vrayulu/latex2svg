var expect  = require('chai').expect;
var request = require('request');

it('Mock test', function(done) {
    request('http://localhost/convert?equation=%5Csin%5Ctheta' , function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
    });
});