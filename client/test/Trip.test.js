import './enzyme.config.js'
import React from 'react'
import {shallow} from 'enzyme'
import Trip from '../src/components/Application/Trip/Trip'

window.alert = jest.fn();
const startProperties = {
    'options': {
        'units': {'miles': 3959, 'kilometers': 6371, 'nautical miles':3440,'units':1000},
        'activeUnit': 'miles',
        'serverPort': 'black-bottle.cs.colostate.edu:31400',
        'requestType': "trip",
        'requestVersion': 4,
        'options':{},
        'optimizations': [], 'activeOptimization': 'none',
        'fileTypes':{'JSON' : 0, 'CSV' : 1}, 'activeFileType': 'JSON',
        'attributes': [],
        'countries': [], 'activeCountry': '',
        'types': [], 'activeType': ''
    },
     'settings': {
        'mapOptions': {
            'showLines': true, 'showMarkers': true,
            'highlightedMarker': '',
            'markerColors': ["blue", "red", "green", "yellow"], 'activeMarkerColor': "blue",
            'lineColors': ["blue", "red", "green", "yellow"], 'activeLineColor': "blue"
        }
    } 
};
const mockAlterPlaces = function(){};
const app = shallow(<Trip options ={startProperties.options}
                          alterPlaces = {mockAlterPlaces}
                          getCoordinate = {mockAlterPlaces}
                          settings = {startProperties.settings}
                          places = {[{name:"Fort Collins", latitude: 40.576179 , longitude: -105.080773}]}
                          distances = {[10,10]}
/>);

function testInitialValues() {

    let actualsaveDropdownOpen = app.state().saveDropdownOpen;
    let actualActiveFileType = app.state().activeFileType;
    let actualErrorMessage = app.state().errorMessage;

    expect(actualsaveDropdownOpen).toEqual(false);
    expect(actualActiveFileType).toEqual("JSON");
    expect(actualErrorMessage).toEqual(null);

}

function testTripTotal(){
    const mockPlaces = [{name:"Fort Collins", latitude: 40.576179 , longitude: -105.080773},
        {name: "Riff Raff Brewing Company", latitude: 37.27,longitude: -107.01}];
    const mockDistances = [10,10];
    const app = shallow(<Trip options ={startProperties.options} distances = {mockDistances} places={mockPlaces} settings={startProperties.settings}
                              getCoordinate = {mockAlterPlaces}/>);
    app.instance().render();
    let actualDistance = app.instance().calculateTripTotal();
    expect(actualDistance).toEqual([10,20]);
}

const app2 = shallow(<Trip options ={startProperties.options}
                          alterPlaces = {mockAlterPlaces}
                          settings = {startProperties.settings}
                           getCoordinate = {mockAlterPlaces}
                           places = {[{'name':"Fort Collins", 'latitude': "40.576179" , 'longitude': "-105.080773"}]}
                          distances = {[]}/>);

//Tests if the file reader is successfully called with a mockfile
async function testReceiveFile() {
    let mockFile =
        {
            "requestType"    : "trip",
            "requestVersion" : 3,
            "options"        : {"title": "Lil Trip","earthRadius":"3959","optimization":"short"},
            "places"         : [
                {"name":"Denver","latitude":"39.7","longitude":"-105.0"}],
            "distances"      : [],
            "type" : "plain/text"
        };

    const event = {
        preventDefault() {},
        stopPropagation() {},
        target: {files: [mockFile]},
    };
    const readAsText = jest.fn();
    const addEventListener = jest.fn((_,evtHandler) => { evtHandler(); });
    const dummyFileReader = {addEventListener, readAsText, result: mockFile};
    window.FileReader = jest.fn(() => dummyFileReader);

    await app2.instance().onReceiveFile(event);
    expect(FileReader).toHaveBeenCalled();
}

/*
Insert, move, and reverse all testing to see if function gets called correctly
The actual usage of the functions is tested in Application
 */
function TestInsertPlaces(){
    const mockPlaces = [{name:"Fort Collins", latitude: 40.576179 , longitude: -105.080773},
        {name: "Riff Raff Brewing Company", latitude: 37.27,longitude: -107.01}];
    const mockDistances = [10,10];
    const mockInsertPlaces = function(){return true;};
    const mockUpdateDistances = function () {return true;};
    const app =shallow(<Trip updateDistances={mockUpdateDistances} options={startProperties.options}
                             distances={mockDistances} places={mockPlaces} alterPlaces={mockAlterPlaces}
                             getCoordinate = {mockAlterPlaces}
                             insertPlaces={mockInsertPlaces}/>);
    let returnVal = app.instance().insertPlaces(["hi"], 0);
    expect(returnVal).toEqual(true);
}

function testMovePlaces(){
    const mockPlaces = [{name:"Fort Collins", latitude: 40.576179 , longitude: -105.080773},
        {name: "Riff Raff Brewing Company", latitude: 37.27,longitude: -107.01}];
    const mockDistances = [10,10];
    const mockMovePlaces = function(){return true;};
    const mockUpdateDistances = function () {return true;};
    const app =shallow(<Trip updateDistances={mockUpdateDistances} options ={startProperties.options}
                             distances={mockDistances} places={mockPlaces} alterPlaces={mockAlterPlaces}
                             getCoordinate = {mockAlterPlaces}
                             movePlaces={mockMovePlaces}/>);
    let returnVal =app.instance().movePlaces(0,1);
    expect(returnVal).toEqual(true);
}

function testReverseTrip(){
    const mockReversePlaces = function () {return true;};
    const mockPlaces = [{name:"Fort Collins", latitude: 40.576179 , longitude: -105.080773},
        {name: "Riff Raff Brewing Company", latitude: 37.27,longitude: -107.01}];
    const app =shallow(<Trip options ={startProperties.options}
                             places = {mockPlaces}
                             alterPlaces={mockAlterPlaces}
                             getCoordinate = {mockAlterPlaces}
                             reversePlaces={mockReversePlaces}/>);
    let actualVal = app.instance().reversePlaces();
    expect(actualVal).toEqual(true);
}

function testSetFileLoad(){
    const mockFunction = function(){};
    let mockFile =
        {
            "requestType"    : "trip",
            "requestVersion" : 3,
            "options"        : {"title": "Lil Trip","earthRadius":"3959","optimization":"short"},
            "places"         : [],
            "distances"      : []
        };
    const mockPlaces = [{name:"Fort Collins", latitude: 40.576179 , longitude: -105.080773},
        {name: "Riff Raff Brewing Company", latitude: 37.27,longitude: -107.01}];
    const app =shallow(<Trip options ={startProperties.options}
                             alterPlaces={mockAlterPlaces}
                             updateFile={mockFunction}
                             updateTripSettings={mockFunction}
                             updateDistances={mockFunction}
                             updateOption={mockFunction}
                             getCoordinate = {mockAlterPlaces}
                             places = {mockPlaces}
                             />);

    let correctlyRan = app.instance().setFileLoad(mockFile,mockPlaces,mockFile);
    expect(correctlyRan).toEqual(true);
}

function testGetName(){
    const mockPlaces = [{name:"Fort Collins", latitude: 40.576179 , longitude: -105.080773},
        {name: "", latitude: 37.27,longitude: -107.01}];
    const app =shallow(<Trip options ={startProperties.options}
                             places = {mockPlaces}
                             getCoordinate = {mockAlterPlaces}
                             alterPlaces={mockAlterPlaces}
                             />);
    let actualVal = app.instance().getName(mockPlaces[0]);
    expect(actualVal).toEqual("Fort Collins");
    actualVal = app.instance().getName(mockPlaces[1]);
    expect(actualVal).toEqual("37.27, -107.01");
}
let mockPlaces = [];
function testGetCoordinate(){

    const app = shallow(<Trip
        options ={startProperties.options}
        getCoordinate = {mockAlterPlaces}
        places = {mockPlaces}/>);

    let actualLat = app.instance().getCoordinate(mockPlaces,"latitude");
    let actualLon = app.instance().getCoordinate(mockPlaces,"longitude");

    let expectedLat = 40.576179;
    let expectedLon = -105.080773;

    expect(actualLat).toEqual(expectedLat);
    expect(actualLon).toEqual(expectedLon);
}

function testUpdatePlaces(){

    const mockUpdatePlaces = function () {return true;};
    const mockPlaces = [{name:"Fort Collins", latitude: 40.576179 , longitude: -105.080773},
        {name: "Riff Raff Brewing Company", latitude: 37.27,longitude: -107.01}];
    const app =shallow(<Trip options ={startProperties.options}
                             places = {mockPlaces}
                             getCoordinate = {mockAlterPlaces}
                             alterPlaces={mockUpdatePlaces}/>);
    let actualVal = app.instance().updatePlaces();
    expect(actualVal).toEqual(true);
}

function testToggleMap(){

    const mockUpdatePlaces = function () {return true;};
    const mockPlaces = [{name:"Fort Collins", latitude: 40.576179 , longitude: -105.080773},
        {name: "Riff Raff Brewing Company", latitude: 37.27,longitude: -107.01}];
    const app =shallow(<Trip options ={startProperties.options}
                             places = {mockPlaces}
                             getCoordinate = {mockAlterPlaces}
                             alterPlaces={mockUpdatePlaces}/>);

    expect(app.state().toggleMapState).toEqual(true);
    app.instance().toggleMap();
    expect(app.state().toggleMapState).toEqual(false);
}

test('Testing the default values for Trip class',testInitialValues);
test('Testing renderTripTotal Function' , testTripTotal);
test('Testing insert places functions', TestInsertPlaces);
test('Testing move places function', testMovePlaces);
test('Testing onReceiveFile function', testReceiveFile);
test('Testing reverse trip function', testReverseTrip);
test('Testing setFileLoad function', testSetFileLoad);
test('Testing getName function', testGetName);
test('Testing getCoordinate function', testGetCoordinate);
test('Testing updatePlaces function', testUpdatePlaces);
test('Testing toggleMap function', testToggleMap);