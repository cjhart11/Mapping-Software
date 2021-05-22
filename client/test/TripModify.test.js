import './enzyme.config.js'
import React from 'react'
import {shallow} from 'enzyme'
import TripModify from "../src/components/Application/Trip/TripModify/TripModify";

const mockFile = "hello";//change to file if necessary

window.alert=function(){};

const app = shallow(<TripModify file ={mockFile}
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
                                places = {[1,2]}

/>);

function testRender(){
    let saveRequest = app.instance().render();
    let requestResponse = false;
    if(saveRequest.toString().indexOf('input') != null){
        requestResponse = true;
    }
    expect(requestResponse).toEqual(true);
}

function testRenderDatabase(){
    app.state().activeSource = "add from database";
    let saveRequest = app.instance().render();
    let requestResponse = false;
    if(saveRequest.toString().indexOf('input') === null){
        requestResponse = true;
    }
    expect(requestResponse).toEqual(false);
}


function testRenderRemoveLocation(){
    app.state().activeSource = "remove location";
    let saveRequest = app.instance().render();
    let requestResponse = false;
    if(saveRequest.toString().indexOf('Remove location at index') !== null){
        requestResponse = true;
    }
    expect(requestResponse).toEqual(true);
}

function testRenderSwapLocations(){
    app.state().activeSource = "swap locations";
    let saveRequest = app.instance().render();
    let requestResponse = false;
    if(saveRequest.toString().indexOf('Swap Locations') !== null){
        requestResponse = true;
    }
    expect(requestResponse).toEqual(true);
}

function testRenderMoveToStart(){
    app.state().activeSource = "move to start";
    let saveRequest = app.instance().render();
    let requestResponse = false;
    if(saveRequest.toString().indexOf('Move location to start of trip') !== null){
        requestResponse = true;
    }
    expect(requestResponse).toEqual(true);
}

function testRenderReverseList(){
    app.state().activeSource = "reverse list";
    let saveRequest = app.instance().render();
    let requestResponse = false;
    if(saveRequest.toString().indexOf('Reverse locations list') !== null){
        requestResponse = true;
    }
    expect(requestResponse).toEqual(true);
}

function testSingleIndexCheck(){
    window.alert = jest.fn();
    app.state().indexOne = '';
    expect(app.instance().indexSingleCheck()).toEqual(false);
    app.state().indexOne = 'hello';
    expect(app.instance().indexSingleCheck()).toEqual(false);
    app.state().indexOne = '5';
    expect(app.instance().indexSingleCheck()).toEqual(false);
    app.state().indexOne = '0';
    expect(app.instance().indexSingleCheck()).toEqual(true);
}

function testIndexSwapCheck(){
    window.alert = jest.fn();
    app.state().indexOne = '0';
    expect(app.instance().indexSwapCheck()).toEqual(false);
    app.state().indexTwo = '';
    expect(app.instance().indexSwapCheck()).toEqual(false);
    app.state().indexTwo = 'hello';
    expect(app.instance().indexSwapCheck()).toEqual(false);
    app.state().indexTwo = '5';
    expect(app.instance().indexSwapCheck()).toEqual(false);
    app.state().indexTwo = '0';
    expect(app.instance().indexSwapCheck()).toEqual(false);
    app.state().indexTwo = '1';
    expect(app.instance().indexSwapCheck()).toEqual(true);
}

function testUpdateIndexOnChange(){
    app.instance().updateIndexOnChange("indexOne", 2);
    expect(app.state().indexOne).toEqual(2);
    app.instance().updateIndexOnChange("indexTwo", 4);
    expect(app.state().indexTwo).toEqual(4);
}

function testCheckIndex(){
    expect(app.instance().checkIndex(-1)).toEqual(false);
    expect(app.instance().checkIndex('a')).toEqual(false);
    expect(app.instance().checkIndex(-3)).toEqual(false);
    expect(app.instance().checkIndex(1)).toEqual(true);

}

test('Testing rendering local trip options menu' , testRender);
test('Testing rendering database options menu', testRenderDatabase);
test('Testing rendering of remove locations option', testRenderRemoveLocation);
test('Testing rendering of swap locations options', testRenderSwapLocations);
test('Testing rendering of move location to start', testRenderMoveToStart);
test('Testing rendering of revers list render', testRenderReverseList);
test('Testing single index check function', testSingleIndexCheck);
test('Testing swap index check function', testIndexSwapCheck);
test('Testing update index on change function', testUpdateIndexOnChange);
test('Testing Check Index Function', testCheckIndex);