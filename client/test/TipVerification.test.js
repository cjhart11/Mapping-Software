import './enzyme.config.js';
import React from 'react';
import TipVerification from "../src/components/Application/TipVerification";
import testConfig from './TESTJSONResponses/testConfigResponse.json'
import testDistance from './TESTJSONResponses/testDistanceResponse.json'
import testTrip from './TESTJSONResponses/testTripResponse.json'
import testLocations from './TESTJSONResponses/testLocationsResponse.json'

function testConfigRequestVerification(){
    const validator = new TipVerification();

    const configRequest = {
        'requestType': 'config',
        'requestVersion': 3,
        'serverName': "T20",
        'placeAttributes': ["latitude","longitude"],
        'optimizations': ["none","automatic"],
        'filters': [],
    };
    const result = validator.verifyRequest(configRequest);
    expect(result).toEqual(true);
}

test('Testing to check config request validation', testConfigRequestVerification);

function testDistanceRequestVerification() {
    const validator = new TipVerification();

    const distanceRequest = {
        'requestType': 'distance',
        'requestVersion': 1,
        'origin': {'latitude': 'test'},
        'destination': {'latitude': 'test'},
        'earthRadius': 3958.8
    };
    const result = validator.verifyRequest(distanceRequest);
    expect(result).toEqual(true);
}

test('Testing to check distance request validation', testDistanceRequestVerification);

function testTripRequestVerification() {
    const validator = new TipVerification();

    const tripRequest = {
        'requestType': 'trip',
        'requestVersion': 2,
        'options': {
            'title':'My Trip',
            'earthRadius':'3958.8',
            'optimization':'none'
        },
        'places': [
            {'name':'Denver',       'latitude': '39.7', 'longitude': '-105.0'},
            {'name':'Boulder',      'latitude': '40.0', 'longitude': '-105.4'},
            {'name':'Fort Collins', 'latitude': '40.6', 'longitude': '-105.1'}
        ],
        'distances': []
    };

    expect(validator.verifyRequest(tripRequest)).toEqual(true);
}

test('Testing to check trip request validation', testTripRequestVerification);

function testLocationsRequestVerification() {
    const validator = new TipVerification();

    const locationsRequest = {
        'requestType': 'locations',
        'requestVersion': 3,
        'match': 'test',
        'narrow': [{"name":"type","values":[""]}, {"name":"country","values":["Canada"]}],
        'limit': 0,
        'found': 0,
        'places': []
    };

    expect(validator.verifyRequest(locationsRequest)).toEqual(true);
}

test('Testing to check location request validation', testLocationsRequestVerification);

function testAPIResponseValidation() {
    const validator = new TipVerification();

    const results = [];
    results.push(validator.validateApiResponse(testConfig));
    results.push(validator.validateApiResponse(testDistance));
    results.push(validator.validateApiResponse(testTrip));
    results.push(validator.validateApiResponse(testLocations));
    expect(results[0]).toEqual(true);
    expect(results[1]).toEqual(true);
    expect(results[2]).toEqual(true);
    expect(results[3]).toEqual(true);
}

test('Testing the validation of API Responses', testAPIResponseValidation);