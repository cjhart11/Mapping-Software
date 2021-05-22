import './enzyme.config.js';
import React from 'react';
import Coordinates from '../src/components/Application/Coordinates';


function testCoordinateValidationAndConversion() {
    const coordinates = new Coordinates();

    coordinates.addCoordinates('Denver',['40:7:22.8N', '74:7:22.8W']);

    let expectedLatitude = 40.123;
    let expectedLongitude = -74.12299999999999;
    let expectedName = 'Denver';
    let coords = coordinates.state.coordinates;
    let actualLatitude = coords[0].latitude;
    let actualLongitude = coords[0].longitude;
    let actualName = coords[0].name;

    expect(actualLatitude).toEqual(expectedLatitude);
    expect(actualLongitude).toEqual(expectedLongitude);
    expect(actualName).toEqual(expectedName);
}

test('Testing the validation and conversion of the coordinates', testCoordinateValidationAndConversion);