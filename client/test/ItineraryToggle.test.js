import './enzyme.config.js'
import React from 'react'
import {shallow} from 'enzyme'
import ItineraryToggle from "../src/components/Application/Trip/TripItinerary/ItineraryToggle";

const mockMovePlaces = function() {
    return true;
};

const app = shallow(<ItineraryToggle places={[
    {name:"hello", id: "12345", latitude: "25" ,
           longitude: "50", altitude: "16", municipality:"Denver",
           region:"Colorado", country: "United states", continent: "NA",
           type:"closed"},
    {name:"goodbye", id: "54321", latitude: "52" ,
            longitude: "5", altitude: "61", municipality:"Denver",
            region:"Colorado", country: "United states", continent: "NA",
            type:"heliport"}
]}
                                     index = {1}
                                     movePlaces  = {mockMovePlaces}/>);


function testClosedDropdown(){
    app.state().isOpen = false;
    let appDropdown = app.instance().render();
    let requestResponse = false;
    if(appDropdown.toString().indexOf('{isOpen={false}') !== null){
        requestResponse = true;
    }
    expect(requestResponse).toEqual(true);
}

function testOpenDropdown(){
    app.state().isOpen = true;
    let appDropdown = app.instance().render();
    let requestResponse = false;
    if(appDropdown.toString().indexOf('{isOpen={true}') !== null){
        requestResponse = true;
    }
    expect(requestResponse).toEqual(true);
}

function testToggle(){
    app.state().isOpen = true;
    app.instance().toggle();
    expect(app.state().isOpen).toEqual(false);
}

function testRemoveListing(){
    let appRemove = app.instance().removeListing();
    expect(appRemove).toEqual(true);
}

function testMoveListingUp(){
    let appUp = app.instance().moveListingUp();
    expect(appUp).toEqual(true);
}

function testMoveListingDown(){
    let appDown = app.instance().moveListingDown();
    expect(appDown).toEqual(true);
}

test('Testing closed dropdown render', testClosedDropdown);
test('Testing open dropdown render', testOpenDropdown);
test('Testing toggle function', testToggle);
test('Testing remove listing function', testRemoveListing);
test('Testing the move up function', testMoveListingUp);
test('Testing the move down function', testMoveListingDown);

