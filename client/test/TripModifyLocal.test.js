import './enzyme.config.js'
import React from 'react'
import {shallow} from 'enzyme'
import TripModifyLocal from "../src/components/Application/Trip/TripModify/TripModifyLocal";

const mockFile = "hello";//change to file if necessary

window.alert=function(){};
const updatePlaces = function(){};

const app = shallow(<TripModifyLocal file ={mockFile}
                                     checkIndex = {updatePlaces}
                                 options = {{
                                     units: {'miles':3959,'kilometers':6371},
                                     activeUnit: 'miles',
                                     optimizations: [],
                                     activeOptimization: 'none',
                                     fileTypes:{'JSON' : 0, 'CSV' : 1},
                                     activeFileType: 'JSON',
                                     attributes: [ "name",
                                         "latitude",
                                         "longitude",
                                         "id",
                                         "municipality",
                                         "type"]
                                 }}
                                updatePlaces={updatePlaces}
                                places = {[]}

/>);

function testResetLocations(){
    app.state().newLocations = [1];
    app.instance().resetLocations();
    expect(app.state().newLocations).toEqual([]);
}

function testSubmitLocalTrip(){
    app.state().activeLocation.name = "name";
    app.state().activeLocation.latitude = 67;
    app.state().activeLocation.longitude = 90;
    app.state().startIndex = 0;
    app.instance().submitLocalTrip();
    window.alert= jest.fn();
    expect(app.state().activeLocation.latitude).toEqual(67);
}

function testUpdateLocationOnChange(){
    app.instance().updateLocationOnChange("name","new");
    expect(app.state().activeLocation.name).toEqual("new");
}

function testCreateInputField(){
    let saveRequest = app.instance().createInputField("name", 1);
    let requestResponse = false;
    if(saveRequest.toString().indexOf('input') != null){
        requestResponse = true;
    }
    expect(requestResponse).toEqual(true);
}

function testUpdateIndex(){
    app.instance().updateIndexOnChange(6);
    expect(app.state().startIndex).toEqual(6);
}

function testResetIndex(){
    app.instance().updateIndexOnChange(6);
    app.setState({startIndex: ''});
    expect(app.state().startIndex).toEqual('');
}

function testUpdatingCoords(){
    let coords = {state: {coordinates:[{latitude: 0 , longitude:0}]}};
    app.instance().setUpdatedCoordinates(coords);
    expect(app.state().activeLocation.latitude).toEqual("0");
    expect(app.state().activeLocation.longitude).toEqual("0");
}

function testCheckInputs(){

    app.setState().activeLocation = {name: "Toronto", latitude: '12', longitude: '15'};
    let checkInput = app.instance().checkInputs();
    expect(checkInput).toEqual(true);

}

test('Testing update location on change function', testUpdateLocationOnChange);
test('Testing local trip submission function' , testSubmitLocalTrip);
test('Testing resetting locations array', testResetLocations);
test('TesTing create input field Function',testCreateInputField);
test('Testing update index function',testUpdateIndex);
test('Testing reset index function',testResetIndex);
test('Testing updating local coordinates function', testUpdatingCoords);
test('Testing checkInputs function', testCheckInputs);
