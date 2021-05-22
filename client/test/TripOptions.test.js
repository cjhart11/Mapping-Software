import './enzyme.config.js'
import React from 'react'
import {shallow} from 'enzyme'
import TripOptions from "../src/components/Application/Trip/TripOptions";

const mockFile = "hello";//change to file if necessary

const app = shallow(<TripOptions file ={mockFile}
                                 planOptions = {{
                                     units: {'miles':3959,'kilometers':6371},
                                     activeUnit: 'miles',
                                     optimizations: [],
                                     activeOptimization: 'none',
                                     fileTypes:{'JSON' : 0, 'CSV' : 1},
                                     activeFileType: 'JSON'
                                 }}

/>);

function testTripOptionsRender(){
    let saveRequest = app.instance().renderTripOptions();
    let requestResponse = false;
    if(saveRequest.toString().indexOf('dropdown') != null){
        requestResponse = true;
    }
    expect(requestResponse).toEqual(true);
}
function testTripOptionsToggle(){
    let initialState = app.state().tripDropdownOpen;
    app.instance().toggleOptions();
    expect(initialState).not.toEqual(app.state().tripDropdownOpen);
}

test('Testing rendering dropDown trip options menu' , testTripOptionsRender);
test('Testing TripOptions toggleOption function' , testTripOptionsToggle);
