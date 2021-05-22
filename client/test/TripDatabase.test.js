import './enzyme.config.js'
import React from 'react'
import {shallow} from 'enzyme'
import TripDatabase from "../src/components/Application/Trip/TripModify/TripDatabase";

const mockFile = "hello";//change to file if necessary

window.alert=function(){};
const updatePlaces = function(){};
const app = shallow(<TripDatabase file ={mockFile}
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
                                          "type"],
                                      countries:["america", "australia"],
                                      activeCountry: "america",
                                      types:["heliport", "airport"],
                                      activeType:"airport"
                                  }}
                                  settings={{
                                      'units': {'miles': 3959, 'kilometers': 6371},
                                      'activeUnit': 'miles',
                                      'serverPort': 'black-bottle.cs.colostate.edu:31400'
                                  }}
                                  updatePlaces={updatePlaces}
                                  toggleMap={updatePlaces}
                                  places = {[1,2]}

/>);

function testRenderList(){
    app.state().found = 2;
    let saveRequest = app.instance().renderList();
    let requestResponse = false;
    if(saveRequest.toString().indexOf('Table') != null){
        requestResponse = true;
    }
    expect(requestResponse).toEqual(true);
}

function testSetDataIndex(){
    app.state().placeIndex = '';
    app.instance().setDataIndex(4);
    expect(app.state().placeIndex).toEqual(4);
}

function testCreateDataIndex(){
    let saveRequest = app.instance().createDataIndex();
    let requestResponse = false;
    if(saveRequest.toString().indexOf('input') != null){
        requestResponse = true;
    }
    expect(requestResponse).toEqual(true);
}

function testResetAll(){
    app.state().newLocations= ["hi", "lo"];
    app.state().userInput= "98";
    app.state().found= 10;
    app.state().updated= true;
    app.state().placeIndex= '7';
    app.state().checkBoxArray= ["check" ,"check"];

    app.instance().resetAll();

    expect(app.state().newLocations).toEqual([]);
    expect(app.state().userInput).toEqual("");
    expect(app.state().found).toEqual(0);
    expect(app.state().updated).toEqual(false);
    expect(app.state().placeIndex).toEqual('');
    expect(app.state().checkBoxArray).toEqual([]);
}

function testSetLocationsFromData(){
    const mockResponse= {body:{
            places:[{name:"neat", Latitude:"123",Longitude:"43"}],
            found: 4
        }};
    app.instance().setLocationsFromData(mockResponse);
    expect(app.state().newLocations).toEqual([{name:"neat", Latitude:"123",Longitude:"43"}]);
    expect(app.state().found).toEqual(4);
    expect(app.state().updated).toEqual(true);
}

function testCheckString(){
    window.alert = jest.fn();
    app.state().userInput = "hello";
    let actualVal = app.instance().checkString();
    expect(actualVal).toEqual(true);
    app.state().userInput = "";
    actualVal = app.instance().checkString();
    expect(actualVal).toEqual(false);
    app.state().userInput = "--";
    actualVal = app.instance().checkString();
    expect(actualVal).toEqual(false);
}

function testPickList(){
    const mockInsertPlaces = function(){return true;};
    const app2 = shallow(<TripDatabase file ={mockFile}
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
                                              "type"],
                                          countries:["america", "australia"],
                                          activeCountry: "america",
                                          types:["heliport", "airport"],
                                          activeType:"airport"
                                      }}
                                      settings={{
                                          'units': {'miles': 3959, 'kilometers': 6371},
                                          'activeUnit': 'miles',
                                          'serverPort': 'black-bottle.cs.colostate.edu:31400'
                                      }}
                                      updatePlaces={updatePlaces}
                                       insertPlaces = {mockInsertPlaces}
                                       toggleMap={updatePlaces}
                                      places = {[1,2]}

    />);
    app2.state().placeIndex = "2";
    app2.instance().pickList();
    expect(app2.state().placeIndex).toEqual("");
}

function testDatabaseRequestFilters(){
    let mockTipConfigRequest = {
        'requestType': "locations",
        'requestVersion': 4,
        'match': "hello",
        'narrow': [],
        'limit': 10,
        'found': 0,
        'places': []
    };
    const app = shallow(
        <TripDatabase  file ={mockFile}
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
                               "type"],
                           countries:["america", "australia"],
                           activeCountry: "america",
                           types:["heliport", "airport"],
                           activeType:"airport"
                       }}
                       settings={{
                           'units': {'miles': 3959, 'kilometers': 6371},
                           'activeUnit': 'miles',
                           'serverPort': 'black-bottle.cs.colostate.edu:31400'
                       }}
                       places = {[1,2]}

    />);
    mockTipConfigRequest = app.instance().databaseRequestFilters(mockTipConfigRequest, "type");
    mockTipConfigRequest = app.instance().databaseRequestFilters(mockTipConfigRequest, "countries");
    expect(mockTipConfigRequest.narrow[0].values).toEqual(["airport"]);
    expect(mockTipConfigRequest.narrow[1].values).toEqual(["america"]);
    mockTipConfigRequest = {
        'requestType': "locations",
        'requestVersion': 4,
        'match': "hello",
        'narrow': [],
        'limit': 10,
        'found': 0,
        'places': []
    };
    const app2 = shallow(
        <TripDatabase  file ={mockFile}
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
                               "type"],
                           countries:["Select all Countries","america", "australia"],
                           activeCountry: "Select all Countries",
                           types:["Select all types","heliport", "airport"],
                           activeType:"Select all types"
                       }}
                       settings={{
                           'units': {'miles': 3959, 'kilometers': 6371},
                           'activeUnit': 'miles',
                           'serverPort': 'black-bottle.cs.colostate.edu:31400'
                       }}
                       places = {[1,2]}

        />);
    mockTipConfigRequest = app2.instance().databaseRequestFilters(mockTipConfigRequest,"type");
    mockTipConfigRequest = app2.instance().databaseRequestFilters(mockTipConfigRequest, "countries");
    expect(mockTipConfigRequest.narrow[0].values).toEqual([""]);
    expect(mockTipConfigRequest.narrow[1].values).toEqual([""]);
}

test('Testing render List function',testRenderList);
test('Testing setting index value', testSetDataIndex);
test('Testing rendering index input', testCreateDataIndex);
test('Testing reset all function', testResetAll);
test('Testing setting locations from data', testSetLocationsFromData);
test('Testing string check function', testCheckString);
test('Testing pick list function', testPickList);
test('Testing database request filters function', testDatabaseRequestFilters);

