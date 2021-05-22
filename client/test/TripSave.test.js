import './enzyme.config.js'
import React from 'react'
import {shallow} from 'enzyme'
import TripSave from "../src/components/Application/Trip/TripSave";

const mockFile = "hello";//change to file if necessary
const mockCalcTripTotal = function(){
    return([10, 20]);
};

window.URL.createObjectURL=function(){};
const app = shallow(<TripSave file ={mockFile}
                              requestType={"trip"}
                              requestVersion = {3}
                              calculateTripTotal = {mockCalcTripTotal}
                              options = {{"title":"my trip", "earthRadius": "3958.8","optimization":"none"}}
                              places={[{"name": "Riff Raff Brewing Company", "latitude": "37.27","longitude": "-107.01"},
                              {"name":"Hall Brewing Company","latitude":"39.5172", "longitude":"-104.7631"}]}
                              distances = {[59,56]}
                              planOptions = {{units: {miles: 3959,kilometers:6371},
                                  activeUnit: 'miles',
                                  optimizations: {"none" : 0 , "short": 0},
                                  activeOptimization: "none",
                                  fileTypes: {"JSON" : 0, "CSV" : 0},
                                  activeFileType: "JSON"}}
/>);



function testTripSaveRender(){
    window.URL.createObjectURL = jest.fn();
    let saveRequest = app.instance().renderSave();
    let requestResponse = false;
    if(saveRequest.toString().indexOf('dropdown') != null){
        requestResponse = true;
    }
    expect(requestResponse).toEqual(true);
}

function testSaveToggle(){
    let initialState = app.state().saveDropdownOpen;
    app.instance().toggleSave();
    expect(initialState).not.toEqual(app.state().saveDropdownOpen);
}

function testSaveJSON(){
    window.URL.createObjectURL = jest.fn();
    expect(app.state.file).not.toEqual(null);
}

function testSaveCSV(){
    const app = shallow(<TripSave file ={mockFile}
                                  requestType={"trip"}
                                  requestVersion = {3}
                                  options = {{"title":"my trip", "earthRadius": "3958.8","optimization":"none"}}
                                  places={[{"name": "Riff Raff Brewing Company", "latitude": "37.27","longitude": "-107.01"},
                                      {"name":"Hall Brewing Company","latitude":"39.5172", "longitude":"-104.7631"}]}
                                  distances = {[59,56]}
                                  planOptions = {{units: {miles: 3959,kilometers:6371},
                                      activeUnit: 'miles',
                                      optimizations: {"none" : 0 , "short": 0},
                                      activeOptimization: "none",
                                      fileTypes: {"JSON" : 0, "CSV" : 0},
                                      activeFileType: "CSV"}} //changed to CSV
                                    calculateTripTotal={mockCalcTripTotal}
    />);
    app.instance().render();
    window.URL.createObjectURL = jest.fn();
    expect(app.state.file).not.toEqual(null);
}

test('Testing rendering dropDown trip options menu' , testTripSaveRender);
test('Testing TripOptions toggleOption function' , testSaveToggle);
test('Testing save button rendering function' , testSaveJSON);
test('Testing CSV file saving function', testSaveCSV);
