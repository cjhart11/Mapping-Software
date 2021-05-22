import './enzyme.config.js'
import React from 'react'
import {shallow} from 'enzyme'
import TripMapOptions from "../src/components/Application/Trip/TripMapOptions";

const mockUpdateClientMapOptions = function(){ return true;};
const mockSettings = {mapOptions: {
        showLines: true, showMarkers: true,
        highlightedMarker: '',
        markerColors: ["blue","red","green","yellow"], activeMarkerColor: "blue",
        lineColors: ["blue","red","green","yellow"], activeLineColor: "blue"
    }};

const app = shallow(<TripMapOptions
                             settings = {mockSettings}
                             updateClientMapOptions = {mockUpdateClientMapOptions}
/>);

function testRender(){
    let appRender = app.instance().render();
    let requestResponse = false;
    let renderHolder = appRender.toString().indexOf('dropdown');
    if(renderHolder != null){
        requestResponse = true;
    }
    expect(requestResponse).toEqual(true);

    app.state().mapOptionsOpen = true;
    appRender = app.instance().render();
    requestResponse = false;
    renderHolder = appRender.toString().indexOf('dropdown');
    if(renderHolder != null){
        requestResponse = true;
    }
    expect(requestResponse).toEqual(true);
}

function testCreateButtons(){
    let appButtons = app.instance().createButtons(["red","blue", "lines"]);
    let requestResponse = false;
    let requestHolder = appButtons.toString().indexOf('line');
    if(requestHolder != null){
        requestResponse = true;
    }
    expect(requestResponse).toEqual(true);

    appButtons = app.instance().createButtons(["red","blue", "markers"]);
    requestResponse = false;
    requestHolder = appButtons.toString().indexOf('markers');
    if(requestHolder != null){
        requestResponse = true;
    }
    expect(requestResponse).toEqual(true);
}

function testOptionsToggle(){
    app.state().mapOptionsOpen = false;
    app.instance().toggleMapOptions();
    expect(app.state().mapOptionsOpen).toEqual(true);
}

function testSetMarkerState(){
    let returnVal = app.instance().setMarkerState();
    expect(returnVal).toEqual(true);
}

function testSetLineState(){
    let returnVal = app.instance().setLineState();
    expect(returnVal).toEqual(true);
}
test('Testing the render function', testRender);
test('Testing the create buttons function', testCreateButtons);
test('Testing options toggle function', testOptionsToggle);
test('Testing set marker state function', testSetMarkerState);
test('Testing set line state function', testSetLineState);