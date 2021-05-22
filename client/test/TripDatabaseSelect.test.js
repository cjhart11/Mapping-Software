import './enzyme.config.js'
import React from 'react'
import {shallow} from 'enzyme'
import TripDatabaseSelect from "../src/components/Application/Trip/TripModify/TripDatabaseSelect";

window.alert=function(){};
const updateOption = function(){ return true};
let mockActiveType = "airport";

const app = shallow(<TripDatabaseSelect type={"type"} values = {["airport", "heliport", "balloonport", "closed"]} updateOption = {updateOption}
                                        checkIndex = {updateOption} active = {mockActiveType}
/>);

function testRender(){
    let saveRequest = app.instance().render();
    let requestResponse = false;
    if(saveRequest.toString().indexOf('input') != null){
        requestResponse = true;
    }
    expect(requestResponse).toEqual(true);
}

function testOnSelect(){
    let mockE = {target: {id: "activeCountry", value:"hello"}};
    let requestResponse = app.instance().onSelect(mockE);
    expect(requestResponse).toEqual(true);
}

test('Testing render function', testRender);
test('Testing on select funtction', testOnSelect);

