const async = require('async');
const expect  = require('chai').expect;
const request = require('request');
const latexService = require('../services/mainService');
const mock = require('mock-require');
const httpMocks = require('node-mocks-http');


var createGETRequest = function (eq, format) {
    if (format && format != '')
        eq = eq + '.' + format;
    let req = httpMocks.createRequest({
        query: {
          equation: eq
        }
    });
    return req;
};

var createPOSTRequest = function (eq, format) {
    if (format && format != '')
        eq = eq + '.' + format;
    let req = httpMocks.createRequest({
        body: {
          equation: eq
        }
    });
    return req;
};

var createResponse = function () {
    let res = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
    });
    return res;
};

it('GET request test', function(done) {
    const expectedOutput = '<?xml version="1.0" standalone="no" ?>                  <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">                <svg style="vertical-align: 0" xmlns="http://www.w3.org/2000/svg" width="0.002ex" height="0" role="img" focusable="false" viewBox="0 0 1 0" preserveAspectRatio="xMidYMid slice"><g stroke="currentColor" fill="black" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"></g></g></svg>';
    let req = createGETRequest('%5Csin%5Ctheta');
    let res = createResponse();
    latexService.convert(req, res);
    const responseData = res._getData();
    var str2 = responseData.replace(/\n|\r/g, "");
    expect(str2).to.eql(expectedOutput);
    expect(res.statusCode).to.eql(200);
    expect(res.getHeader('Content-Type')).to.eql('image/svg+xml');
    done();
});

it('Post request test', function(done) {
    const expectedOutput = '<?xml version="1.0" standalone="no" ?>                  <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">                <svg style="vertical-align: 0" xmlns="http://www.w3.org/2000/svg" width="0.002ex" height="0" role="img" focusable="false" viewBox="0 0 1 0" preserveAspectRatio="xMidYMid slice"><g stroke="currentColor" fill="black" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"></g></g></svg>';
    let req = createPOSTRequest('%5Csin%5Ctheta');
    let res = createResponse();
    latexService.convert(req, res);
    const responseData = res._getData();
    var str2 = responseData.replace(/\n|\r/g, "");
    expect(str2).to.eql(expectedOutput);
    expect(res.statusCode).to.eql(200);
    expect(res.getHeader('Content-Type')).to.eql('image/svg+xml');
    done();
});

it('Invalid request test', function(done) {
    let req = createPOSTRequest('');
    let res = createResponse();
    latexService.convert(req, res);
    const responseData = res._getData();
    expect(res.statusCode).to.eql(400);
    expect(responseData).to.eql('Bad Request');
    done();
});




