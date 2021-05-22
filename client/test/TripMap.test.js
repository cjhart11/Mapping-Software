import './enzyme.config.js'
import React from 'react'
import {shallow} from 'enzyme'
import TripMap from "../src/components/Application/Trip/TripMap";

const mockLatitude = 40.576179;
const mockLongitude = -105.080773;
const mockOptions = {};
const mockPlaces = [{name:"Fort Collins", latitude: 40.576179 , longitude: -105.080773},
                {name: "Riff Raff Brewing Company", latitude: 37.27,longitude: -107.01}];
const mockDistances = [10,10];
const mockActiveUnit = "Miles";
const mockSettings = {mapOptions: {
        showLines: true, showMarkers: true,
        highlightedMarker: 0,
        markerColors: ["blue","red","green","yellow"], activeMarkerColor: "blue",
        lineColors: ["blue","red","green","yellow"], activeLineColor: "blue"
    }};
const mockGetName = function(){return true;};
window.URL.createObjectURL=function(){};
const app = shallow(<TripMap latitude={mockLatitude}
                             longitude={mockLongitude}
                             options={mockOptions}
                             places= {mockPlaces}
                             distances={mockDistances}
                             activeUnit={mockActiveUnit}
                             getName = {mockGetName}
                             settings = {mockSettings}
/>);

function testRenderLine(){
    window.URL.createObjectURL = jest.fn();
    app.instance().renderMap();
    let pairs = app.instance().getPairwiseLocations();
    expect(pairs).toEqual([[0,1],[1,0]]);
}

function testMapToGeoJson(){
    app.instance().mapToGeoJson();
    let json = {"features": [{"geometry": {"coordinates": [-105.080773, 40.576179], "type": "Point"},
            "properties": {"name": "Fort Collins"}, "type": "Feature"},
            {"geometry": {"coordinates": [-107.01, 37.27], "type": "Point"},
                "properties": {"name": "Riff Raff Brewing Company"}, "type": "Feature"},
            {"geometry": {"coordinates": [[-105.080773, 40.576179], [-107.01, 37.27]], "type": "LineString"},
                "properties": {}, "type": "Feature"}, {"geometry": {"coordinates": [[-107.01, 37.27], [-105.080773, 40.576179]],
                    "type": "LineString"}, "properties": {}, "type": "Feature"}], "type": "FeatureCollection"};


    expect(app.state().geoJsonMap).toEqual(json);
}

function testFindCenter(){

    let returnVal = app.instance().findCenter();
    let object = {"_northEast": {"lat": 40.9067969, "lng": -104.8878503}, "_southWest": {"lat": 36.9393821, "lng": -107.2029227}};
    expect(returnVal).toEqual(object);
}

const emptyPlaces = [];
const app1 = shallow(<TripMap latitude={mockLatitude}
                             longitude={mockLongitude}
                             options={mockOptions}
                             places= {emptyPlaces}
                             distances={[]}
                             activeUnit={mockActiveUnit}
                             getName = {mockGetName}
                             settings = {mockSettings}
/>);

function testFindCenterEmptyPlaces(){

    let returnVal = app1.instance().findCenter();
    let object = {"_northEast": {"lat": 40.696179, "lng": -104.960773}, "_southWest": {"lat": 40.456179000000006, "lng": -105.200773}};
    expect(returnVal).toEqual(object);
}

const singlePlace = [{name:"Fort Collins", latitude: 40.576179 , longitude: -105.080773}];
const app2 = shallow(<TripMap latitude={mockLatitude}
                              longitude={mockLongitude}
                              options={mockOptions}
                              places= {singlePlace}
                              distances={[]}
                              activeUnit={mockActiveUnit}
                              getName = {mockGetName}
                              settings = {mockSettings}
/>);


function testFindCenterSinglePlace(){

    let returnVal = app2.instance().findCenter();
    let object = {"_northEast": {"lat": 40.69617900000001, "lng": -104.960773}, "_southWest": {"lat": 40.456179, "lng": -105.20077299999998}};
    expect(returnVal).toEqual(object);
}

test('Testing the renderLine function', testRenderLine);
test('Testing the map to geoJson function',testMapToGeoJson);
test('Testing the map to findCenter function',testFindCenter);
test('Testing the map to findCenter function with an empty places list',testFindCenterEmptyPlaces);
test('Testing the map to findCenter function with one place',testFindCenterSinglePlace);