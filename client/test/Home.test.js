import './enzyme.config.js'
import React from 'react'
import {shallow} from 'enzyme'
import Home from '../src/components/Application/Home'
import Pane from "../src/components/Application/Pane";


const app = shallow(<Home/>);

function testInitialValues() {

    let actualLat = app.state().latitude;
    let actualLon = app.state().longitude;
    let actualError = app.state().geoError;
    let expectedLat = 0;
    let expectedLon = 0;
    let expectedError = 'none';

    if(!navigator.geolocation) {
        expectedLat = 40.576179;
        expectedLon = -105.080773;
        expect(actualLat).toEqual(expectedLat);
        expect(actualLon).toEqual(expectedLon);
        expectedError = "geolocation not supported";
        expect(actualError).toEqual(expectedError);
    }
    else {
        expectedError = 'none';
        expect(actualLat).toEqual(expectedLat);
        expect(actualLon).toEqual(expectedLon);
        expect(actualError).toEqual(expectedError);
    }
}

function testGeoError() {
    app.instance().setGeoError('test');
    let actualItem = app.state().geoError;
    let expectedItem = 'test';
    expect(actualItem).toEqual(expectedItem);
}

function testSetSupportState() {
    app.instance().setGeoError('none');
    app.instance().setSupportState();
    let actualItem = app.state().geoError;
    let expectedItem = "geolocation not supported";
    expect(actualItem).toEqual(expectedItem);
}

function testSetDeniedState() {
    app.instance().setGeoError('none');
    app.instance().setDeniedState();
    let actualItem = app.state().geoError;
    let expectedItem = "geolocation denied";
    expect(actualItem).toEqual(expectedItem);
}


/*Uses geolocation mocking to test latitude and longitude*/
/*
* Utilizes a solution for mocking Geolocation data provided by User Madeo on stack overflow
* https://stackoverflow.com/a/51829561
*/
function testLongitudeValidity() {
    global.navigator.geolocation = {
        getCurrentPosition: jest.fn().mockImplementationOnce((success) => Promise.resolve(success({
            coords: {
                latitude: -90.0,
                longitude: -181.0,
            }
        })))
    };
    app.instance().setGeoError('none');
    global.navigator.geolocation.getCurrentPosition(app.instance().getPosition);
    let actualItem = app.state().geoError;
    let expectedItem = "invalid longitude";
    expect(actualItem).toEqual(expectedItem);
}

function testLatitudeValidity() {
    global.navigator.geolocation = {
        getCurrentPosition: jest.fn().mockImplementationOnce((success) => Promise.resolve(success({
            coords: {
                latitude: -91.0,
                longitude: -180.0,
            }
        })))
    };
    app.instance().setGeoError('none');
    global.navigator.geolocation.getCurrentPosition(app.instance().getPosition);
    let actualItem = app.state().geoError;
    let expectedItem = "invalid latitude";
    expect(actualItem).toEqual(expectedItem);
}

function testGetPosition() {
    global.navigator.geolocation = {
        getCurrentPosition: jest.fn().mockImplementationOnce((success) => Promise.resolve(success({
            coords: {
                latitude: -90.0,
                longitude: -180.0,
            }
        })))
    };
    app.instance().setGeoError('none');
    global.navigator.geolocation.getCurrentPosition(app.instance().getPosition);
    let actualLatitude = app.state().latitude;
    let expectedLatitude = -90.0;
    let actualLongitude = app.state().longitude;
    let expectedLongitude = 180.0;
    expect(actualLatitude).toEqual(expectedLatitude) && expect(actualLongitude).toEqual(expectedLongitude);
}

function testCheckMessage() {
    let message = [
        'geolocation denied',
        "geolocation not supported",
        "invalid latitude",
        "invalid longitude",
        "none"];
    let response =[
        "Permission for geolocation was denied.",
        "Your browser does not support geolocation.",
        "The latitude provided by your browser was incorrect.",
        "The longitude provided by your browser was incorrect.",
        "Let us help plan your next trip!"];
    for(let i =0; i < message.length; i++){
        app.instance().setGeoError(message[i]);
        let actualItem = app.instance().checkMessage();
        let expectedItem = response[i];
        expect(actualItem).toEqual(expectedItem);
    }

}

function testCheckHeader() {
    let message = ["none" , "geolocation denied", "other"];
    let response = ["Bon Voyage!", "Map cannot get your location", "An Error Occurred"];
    for(let i = 0; i < message.length; i++){
        app.instance().setGeoError(message[i]);
        let actualItem = app.instance().checkHeader();
        let expectedItem = response[i];
        expect(actualItem).toEqual(expectedItem);
    }
}

function testIntroRender() {
    let intro = app.instance().checkHeader();
    let message = app.instance().checkMessage();

    expect(app.contains(<Pane header={intro} bodyJSX={message}/>)).toEqual(true);
}

function testMapRender() {
    expect(app.contains(<Pane header={'Where Am I?'} bodyJSX={app.instance().renderLeafletMap()}/>)).toEqual(true);
}

function testCsuDefaultPosition() {
    app.instance().csuDefaultPosition();
    let actualLatitude = app.state().latitude;
    let expectedLatitude = 40.576179;
    let actualLongitude = app.state().longitude;
    let expectedLongitude =  -105.080773;
    expect(actualLatitude).toEqual(expectedLatitude) && expect(actualLongitude).toEqual(expectedLongitude);
}

test('Testing the default values for latitude/longitude/error',testInitialValues);
test('Testing setGeoError function',testGeoError);
test('Testing setDeniedState function', testSetDeniedState);
test('Testing setSupportState function', testSetSupportState);
test('Testing longitudeValidity function' , testLongitudeValidity);
test('Testing latitudeValidity function' , testLatitudeValidity);
test('Testing getPosition function' , testGetPosition);
test('Testing checkMessage function',testCheckMessage);
test('Testing checkHeader function' ,testCheckHeader);
test('Testing default intro function render' ,testIntroRender);
test('Testing map function render' ,testMapRender);
test('Testing csuDefaultPosition function', testCsuDefaultPosition);