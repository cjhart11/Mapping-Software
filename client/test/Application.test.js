import './enzyme.config.js'
import React from 'react'
import {shallow} from 'enzyme'
import Application from '../src/components/Application/Application'


window.alert=function(){};
function testInitialState() {
  mockConfigResponse();

  const app = shallow(<Application/>);

  let actualConfig = app.state().serverConfig;
  let expectedConfig = null;
  expect(actualConfig).toEqual(expectedConfig);

  let actualOptions = app.state().planOptions;
  let expectedOptions = {
      units: {miles: 3959,kilometers:6371,'nautical miles':3440,units:1000},
      activeUnit: 'miles',
      optimizations: [],
      options: {},
      requestType: 'none',
      requestVersion: null,
      activeOptimization: 'none',
      attributes:[],
      countries:[],
      activeCountry: '',
      types: [],
      activeType : '',
  };

  expect(actualOptions).toEqual(expectedOptions);
}

test("Testing Application's initial state", testInitialState);

function mockConfigResponse() {
  fetch.mockResponse(JSON.stringify(
      {
        status: 200,
        statusText: 'OK',
        body: {
          placeAttributes: [
              "name",
              "id",
              "latitude",
              "longitude",
              "altitude",
              "municipality",
              "region",
              "country",
              "continent",
              "type"],
          requestType: "config",
          requestVersion: 4,
          serverName: "t20",
          filters: [
              {"name":"type",
                  "values" : ["airport", "heliport", "balloonPort", "closed"]},
              {"name": "country",
                  "values" : ["america", "australia"]}
          ]
        },
        type: 'basic',
        url: 'http://localhost:8088/api/config',
        redirected: false,
        ok: true
      }))
}

function testUpdateOption() {
  const app = shallow(<Application/>);
  window.alert= jest.fn();

  app.instance().updatePlanOption("activeUnit", "miles");

  let actualUnit = app.state().planOptions.activeUnit;
  let expectedUnit = "miles";
  expect(actualUnit).toEqual(expectedUnit);

  app.instance().alterPlaces([{name:"Fort Collins", latitude: 40.576179 , longitude: -105.080773}]);
  let actualPlaces = app.state().places;
  let expectedPlaces = [{name:"Fort Collins", latitude: 40.576179 , longitude: -105.080773}];
  let actualDistances = app.state().distances;
  let expectedDistances =  [];

  expect(actualPlaces).toEqual(expectedPlaces);
  expect(actualDistances).toEqual(expectedDistances);
}
test("Testing Application's updatePlanOption function", testUpdateOption);

function testUpdateKilometersOption() {
    const app = shallow(<Application/>);

    app.instance().updatePlanOption("activeUnit", "kilometers");

    let actualUnit = app.state().planOptions.activeUnit;
    let expectedUnit = "kilometers";
    expect(actualUnit).toEqual(expectedUnit);
}
test("Testing Application's updatePlanOption function with kilometers", testUpdateKilometersOption);

function testCreateApplicationPage(){
    const app = shallow(<Application/>);
    let requestResponse = true;
    let saveRequest = app.instance().createApplicationPage('calc');
    if(saveRequest.toString().indexOf('Calculator') == null){
        requestResponse = false;
    }
    saveRequest = app.instance().createApplicationPage('options');
    if(saveRequest.toString().indexOf('Options') == null){
        requestResponse = false;
    }
    saveRequest = app.instance().createApplicationPage('trip');
    if(saveRequest.toString().indexOf('Trip') == null){
        requestResponse = false;
    }
    saveRequest = app.instance().createApplicationPage('about');
    if(saveRequest.toString().indexOf('About') == null){
        requestResponse = false;
    }
    saveRequest = app.instance().createApplicationPage('settings');
    if(saveRequest.toString().indexOf('Settings') == null){
        requestResponse = false;
    }
    saveRequest = app.instance().createApplicationPage();
    if(saveRequest.toString().indexOf('Home') == null){
        requestResponse = false;
    }

    expect(requestResponse).toEqual(true);
}
test("Testing create applications page function", testCreateApplicationPage);

function testCreateErrorBanner(){
    const app = shallow(<Application/>);
    let saveRequest = app.instance().createErrorBanner();
    let requestResponse = false;
    if(saveRequest.toString().indexOf('ErrorBanner') !== null){
        requestResponse = true;
    }
    expect(requestResponse).toEqual(true);
}
test('Testing createErrorBanner function', testCreateErrorBanner);

const mockPlaces = [{name:"Fort Collins", latitude: "40.576179" , longitude: "-105.080773"},
    {name: "Riff Raff Brewing Company", latitude: "37.27",longitude: "-107.01"},
    {name: "Lakewood",latitude :"39.7047", longitude:"-105.0814"}];

function testReverse(){
    const mockReversePlaces = [{name:"Fort Collins", latitude: "40.576179" , longitude: "-105.080773"},
        {name: "Lakewood",latitude :"39.7047", longitude:"-105.0814"},
        {name: "Riff Raff Brewing Company", latitude: "37.27",longitude: "-107.01"}];
    const app = shallow(<Application/>);

    app.instance().alterPlaces(mockPlaces);
    app.instance().reversePlaces();

    expect(app.state().places).toEqual(mockReversePlaces);
}
test('Testing reversePlaces function', testReverse);

function testMove(){

    let mockSwappedPlaces = [{name: "Riff Raff Brewing Company", latitude: "37.27",longitude: "-107.01"},
        {name: "Lakewood",latitude :"39.7047", longitude:"-105.0814"},
        {name:"Fort Collins", latitude: "40.576179" , longitude: "-105.080773"}];

    const app = shallow(<Application/>);

    app.instance().alterPlaces(mockPlaces);
    app.instance().movePlaces(0,2);
    expect(app.state().places).toEqual(mockSwappedPlaces);


    mockSwappedPlaces = [{name: "Lakewood",latitude :"39.7047", longitude:"-105.0814"},
        {name:"Fort Collins", latitude: "40.576179" , longitude: "-105.080773"}];
    app.instance().movePlaces(0,'');
    expect(app.state().places).toEqual(mockSwappedPlaces);

    mockSwappedPlaces = [{name: "Riff Raff Brewing Company", latitude: "37.27",longitude: "-107.01"},
        {name: "Lakewood",latitude :"39.7047", longitude:"-105.0814"},
        {name:"Fort Collins", latitude: "40.576179" , longitude: "-105.080773"}];

    app.instance().alterPlaces(mockSwappedPlaces);
    mockSwappedPlaces = [
        {name: "Lakewood",latitude :"39.7047", longitude:"-105.0814"},
        {name:"Fort Collins", latitude: "40.576179" , longitude: "-105.080773"},
        {name: "Riff Raff Brewing Company", latitude: "37.27",longitude: "-107.01"}];
    app.instance().movePlaces(1,"start");
    expect(app.state().places).toEqual(mockSwappedPlaces);

}
test('Testing movePlaces function', testMove);

function testInsert(){

    const mockPlaces = [{name:"Fort Collins", latitude: "40.576179" , longitude: "-105.080773"},
        {name: "Riff Raff Brewing Company", latitude: "37.27",longitude: "-107.01"},
        {name: "Lakewood",latitude :"39.7047", longitude:"-105.0814"}];

    const mockInsertPlaces = [{name:"Fort Collins", latitude: "40.576179" , longitude: "-105.080773"},
        {name: "Riff Raff Brewing Company", latitude: "37.27",longitude: "-107.01"},
        {name:"Boulder",latitude:"40.0150",longitude:"-105.2705"},
        {name: "Lakewood",latitude :"39.7047", longitude:"-105.0814"}];

    const app = shallow(<Application/>);

    let newPlaces = {name:"Boulder",latitude:"40.0150",longitude:"-105.2705"};

    app.instance().alterPlaces(mockPlaces);
    app.instance().insertPlaces(newPlaces,2);

    expect(app.state().places).toEqual(mockInsertPlaces);
}
test('Testing insertPlaces function', testInsert);

function testEmptyInsert(){

    const emptyPlaces = [];

    const app = shallow(<Application/>);

    let newPlaces = {name:"Boulder",latitude:"40.0150",longitude:"-105.2705"};

    app.instance().alterPlaces(emptyPlaces);
    app.instance().insertPlaces(newPlaces,2);

    let expectedPlaces = {"latitude": "40.0150", "longitude": "-105.2705", "name": "Boulder"};

    expect(app.state().places).toEqual(expectedPlaces);
}
test('Testing insertPlaces function with an empty places array', testEmptyInsert);

function testUpdateTripSettings(){

    let newOptions = {
        units: {miles: 3959,kilometers:6371,'nautical miles':3440,units:1000},
        activeUnit: 'miles',
        optimizations: [],
        options: {title: "Temp", earthRadius:"3959",optimization:"short"},
        requestType: 4,
        requestVersion: "trip",
        activeOptimization: 'none',
        attributes:[],
        countries:[],
        activeCountry: '',
        types: [],
        activeType : '',
    };

    const app = shallow(<Application/>);
    app.instance().updateTripSettings(newOptions);
    let newSettings = app.state().planOptions;

    expect(newSettings).toEqual(newOptions);
}
test('Testing updateTripSettings function', testUpdateTripSettings);

function testUpdateDistances(){

    let mockDistances = [10,20,30];
    const app = shallow(<Application/>);
    app.instance().updateDistances(mockDistances);

    expect(app.state().distances).toEqual(mockDistances);
}
test('Testing updateDistances function', testUpdateDistances);

function testUpdateFile(){
    let mockFile =
        {
            "requestType"    : "trip",
            "requestVersion" : 3,
            "options"        : {"title": "Lil Trip","earthRadius":"3959","optimization":"short"},
            "places"         : [
                {"name":"Denver","latitude":"39.7","longitude":"-105.0"},
                {"name":"Fort Morgan","latitude":"40.2503","longitude":"-103.80"},
                {"name":"Boulder","latitude":"40.0150","longitude":"-105.2705"},
                {"name":"Fort Collins","latitude":"40.5853","longitude":"-105.0844"},
                {"name":"New Orleans","latitude":"29.95","longitude":"-90.07"},
                {"name":"Eaton","latitude":"40.5194","longitude":"-104.7025"},
                {"name":"Lakewood","latitude":"39.7047","longitude":"-105.0814","altitude": "498"}],
            "distances"      : []
        };

    const app = shallow(<Application/>);
    app.instance().updateFile(mockFile);

    expect(app.state().file).toEqual(mockFile);
}
test('Testing updateFile function', testUpdateFile);

function testAlterPlaces(){

    let mockPlaces = [{name:"Denver",latitude:"39.7",longitude:"-105.0"},
        {name:"Fort Morgan",latitude:"40.2503",longitude:"-103.80"},
        {name:"Boulder",latitude:"40.0150",longitude:"-105.2705"}];
    const app = shallow(<Application/>);
    app.instance().alterPlaces(mockPlaces);

    expect(app.state().places).toEqual(mockPlaces);
}
test('Testing alterPlaces function', testAlterPlaces);

function testUpdateMapOptions(){
    const app = shallow(<Application/>);
    app.instance().updateClientMapOptions("showLines", false);
    expect(app.state().clientSettings.mapOptions.showLines).toEqual(false);
    app.instance().updateClientMapOptions("showMarkers", false);
    expect(app.state().clientSettings.mapOptions.showMarkers).toEqual(false);
    app.instance().updateClientMapOptions("highlightedMarker", 10);
    expect(app.state().clientSettings.mapOptions.highlightedMarker).toEqual(10);
    app.instance().updateClientMapOptions("activeLineColor", "red");
    expect(app.state().clientSettings.mapOptions.activeLineColor).toEqual("red");
    app.instance().updateClientMapOptions("activeMarkerColor", "green");
    expect(app.state().clientSettings.mapOptions.activeMarkerColor).toEqual("green");
}

test('Tesing update client map options function', testUpdateMapOptions);

function testGetCoordinates(){
    const app = shallow(<Application/>);
    let mockPlaces = [{name:"Denver",latitude:"39.7",longitude:"-105.0"}];

    app.instance().alterPlaces(mockPlaces);

    let actualLat = app.instance().getCoordinate("latitude");
    let actualLon = app.instance().getCoordinate("longitude");

    let expectedLat = "39.7";
    let expectedLon = "-105.0";

    expect(actualLat).toEqual(expectedLat);
    expect(actualLon).toEqual(expectedLon);
}

test('Testing getLatitude and getLongitude functions for updated values', testGetCoordinates);

function testDetectUnit(){

    const app = shallow(<Application/>);
    let unit = app.instance().detectUnit("");
    expect(unit).toEqual("units");

    unit = app.instance().detectUnit("3959");
    expect(unit).toEqual("miles");

    unit = app.instance().detectUnit("6362");
    expect(unit).toEqual("kilometers");

    unit = app.instance().detectUnit("3435");
    expect(unit).toEqual("nautical miles");
}
test('Testing detectUnit function', testDetectUnit);



