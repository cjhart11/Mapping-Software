import './enzyme.config.js'
import React from 'react'
import {shallow} from 'enzyme'
import TripItinerary from "../src/components/Application/Trip/TripItinerary/TripItinerary";

//large number of places to test that separate pages are rendered as well as the pagification values
const mockPlaces = [
    {name:"Fort Collins", latitude: 40.576179 , longitude: -105.080773},
    {name: "Riff Raff Brewing Company", latitude: 37.27,longitude: -107.01},
    {name:"Fort Collins", latitude: 40.576179 , longitude: -105.080773},
    {name: "Riff Raff Brewing Company", latitude: 37.27,longitude: -107.01},
    {name:"Fort Collins", latitude: 40.576179 , longitude: -105.080773},
    {name: "Riff Raff Brewing Company", latitude: 37.27,longitude: -107.01},
    {name:"Fort Collins", latitude: 40.576179 , longitude: -105.080773},
    {name: "Riff Raff Brewing Company", latitude: 37.27,longitude: -107.01},
    {name:"Fort Collins", latitude: 40.576179 , longitude: -105.080773},
    {name: "Riff Raff Brewing Company", latitude: 37.27,longitude: -107.01},
    {name:"Fort Collins", latitude: 40.576179 , longitude: -105.080773},
    {name: "Riff Raff Brewing Company", latitude: 37.27,longitude: -107.01},
    {name:"Fort Collins", latitude: 40.576179 , longitude: -105.080773},
    {name: "Riff Raff Brewing Company", latitude: 37.27,longitude: -107.01},
    {name:"Fort Collins", latitude: 40.576179 , longitude: -105.080773},
    {name: "Riff Raff Brewing Company", latitude: 37.27,longitude: -107.01},
    {name:"Fort Collins", latitude: 40.576179 , longitude: -105.080773},
    {name: "Riff Raff Brewing Company", latitude: 37.27,longitude: -107.01},
    {name:"Fort Collins", latitude: 40.576179 , longitude: -105.080773},
    {name: "Riff Raff Brewing Company", latitude: 37.27,longitude: -107.01},
    {name:"Fort Collins", latitude: 40.576179 , longitude: -105.080773},
    {name: "Riff Raff Brewing Company", latitude: 37.27,longitude: -107.01},
    {name:"Fort Collins", latitude: 40.576179 , longitude: -105.080773},
    {name: "Riff Raff Brewing Company", latitude: 37.27,longitude: -107.01}];
const mockDistances = [10,10];
const mockActiveUnit = "Miles";
const mockNullDistances = [null, null];
const mockTripTotal = function() {
    return([10,20]);
};
const mockGetName = function(){return true;};
const app = shallow(<TripItinerary places= {mockPlaces}
                                   distances={mockDistances}
                                   activeUnit={mockActiveUnit}
                                   getName = {mockGetName}
                                   calculateTripTotal={mockTripTotal}
/>);
const nullApp = shallow(<TripItinerary places= {mockPlaces}
                                     distances={mockNullDistances}
                                     activeUnit={mockActiveUnit}
                                       getName = {mockGetName}
                                     calculateTripTotal={mockTripTotal}
/>);

function testRenderItinerary(){
    let appItinerary = app.instance().renderItinerary();
    let requestResponse = false;
    if(appItinerary.toString().indexOf('table') != null){
        requestResponse = true;
    }
    expect(requestResponse).toEqual(true);
}

function testRenderNullDistances(){
    nullApp.instance().renderItinerary();
    let actualMissing = nullApp.find(<td>Not calculated</td>).length;
    expect(actualMissing).toEqual(0);
}

function testCommaSetValue(){
    let commaReturn = app.instance().commaSetNumber(1000);
    expect(commaReturn).toEqual("1,000");
}

function testSetPage(){
    let e = {
        preventDefault: () => {
        }};
    app.instance().setPage(1,e);
    expect(app.state().page).toEqual(1);
    app.instance().setPage("previous",e);
    expect(app.state().page).toEqual(0);
    app.instance().setPage("next",e);
    expect(app.state().page).toEqual(1);
}


function testRenderPlaces(){
    let emptyArray = [];
    let returnVal = app.instance().renderPlaces(emptyArray);
    expect(returnVal).toEqual(null);
}

test('Testing the renderItinerary function', testRenderItinerary);
test('Testing renderItineraryDistance Function with null values' , testRenderNullDistances);
test('Testing the comma set value function', testCommaSetValue);
test('Testing ste page state function ', testSetPage);
test('Testing RenderPlaces function ', testRenderPlaces);
