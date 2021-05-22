import React, {Component} from 'react';
import {Container, Button, Input, ButtonGroup} from 'reactstrap'
import Pane from '../Pane'
import {sendServerRequestWithBody} from "../../../api/restfulAPI";
import Coordinates from "../Coordinates";
import TripMap from "./TripMap";
import TripItinerary from "./TripItinerary/TripItinerary";
import TripOptions from "./TripOptions";
import TripSave from "./TripSave";
import TipVerification from "../TipVerification";
import TripModify from "./TripModify/TripModify";
import reverseButton from "../../../../client images/reverseSmall.png";

/*
 * Renders the home page.
 */

/*Client checks for geolocation before the page is rendered
  Updates latitude and longitude coordinates for map rendering
 */
export default class Trip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            latitude: this.getCoordinate(props.places,"latitude"),
            longitude: this.getCoordinate(props.places,"longitude"),
            errorMessage: null,
            saveDropdownOpen: false,
            toggleMapState: true,
            activeFileType: "JSON",
        };

        this.insertPlaces = this.insertPlaces.bind(this);
        this.movePlaces = this.movePlaces.bind(this);
        this.calculateTripTotal = this.calculateTripTotal.bind(this);
        this.reversePlaces = this.reversePlaces.bind(this);
        this.updatePlaces = this.updatePlaces.bind(this);
        this.updateFile = this.updateFile.bind(this);
        this.updateDistances = this.updateDistances.bind(this);
        this.setTripSettings = this.setTripSettings.bind(this);
        this.getCoordinate = this.getCoordinate.bind(this);
        this.toggleMap = this.toggleMap.bind(this);
    }

    planTrip() {
        if(this.props.file === null){ alert("No file has been loaded yet."); }
        else{
            const tipConfigRequest = {
                'requestType'        : this.props.options.requestType,
                'requestVersion'     : this.props.options.requestVersion,
                'options'     : this.props.options.options,
                'places'      : this.props.places,
                'distances'   : this.props.distances
            };
            tipConfigRequest.options.optimization = this.props.options.activeOptimization;
            let active = this.props.options.activeUnit;
            tipConfigRequest.options.earthRadius = this.props.options.units[active].toString();
            const validator = new TipVerification();
            if(validator.verifyRequest(tipConfigRequest)) {
                sendServerRequestWithBody('trip', tipConfigRequest, this.props.settings.serverPort)
                    .then((response) => {
                        if(validator.validateApiResponse(response)) {
                            if (response.statusCode >= 200 && response.statusCode <= 299) {
                                this.updatePlaces(response.body.places);
                                this.updateDistances(response.body.distances);
                                this.setState({
                                    errorMessage: null
                                });
                            } else {
                                this.setState({
                                    errorMessage: this.props.createErrorBanner(
                                        response.statusText, response.statusCode,
                                        `Request to ${this.props.settings.serverPort} failed.`)
                                });
                            }
                        }
                        else { alert("Invalid Trip API Response");}
                    });
            }
            else {alert("Invalid Tip Request");}
        }
        return true;
    }

    onReceiveFile(event){
        event.stopPropagation();
        event.preventDefault();
        let file = event.target.files[0];
        let readFileContents = new FileReader();
        const coords = new Coordinates();
        if(file.type.match(/json.*/) || file.type.match(/JSON.*/)){
            readFileContents.readAsText(file);
            readFileContents.onloadend = () => {
                try{
                    let trip = readFileContents.result.toString();
                    trip = JSON.parse(trip);
                    let places = trip.places;
                    for(let i = 0; i < places.length; i++){
                        coords.addCoordinates(places[i].name, [places[i].latitude, places[i].longitude]);
                        places[i].latitude = coords.state.coordinates[i].latitude.toString();
                        places[i].longitude = coords.state.coordinates[i].longitude.toString();
                    }
                    this.setFileLoad(trip, places , file);
                }
                catch(e){alert('Improper file formatting.');}
            }
        }
        else{ alert('Improper file type.');}
    }

    setFileLoad(trip, places , file){
        this.updatePlaces(places);
        this.updateFile(file);
        this.setTripSettings(trip);
        this.setState(
            {
                latitude: this.getCoordinate(places, "latitude"),
                longitude: this.getCoordinate(places, "longitude")});
        if (trip.distances != null){
            this.updateDistances(trip.distances)
        }
        else{this.updateDistances([]);}
        this.props.updateOption("activeOptimization", this.props.options.options.optimization);
        return true;
    }

    getCoordinate(places, type){
        if(places.length === 0){
            if(type === "latitude") {
                return 40.576179;}
            else { return -105.080773;}
        }
        else{
            return(this.props.getCoordinate(type));
        }
    }

    render() {
        return (
            <Container sm={12} xs={12} md={7} lg={8} xl={9}>
                {this.callTripMap()}
                {this.renderModifyTrip()}
                {this.renderTripItinerary()}
            </Container>);
    }

    renderTripItinerary(){
        if (this.props.file !== null) {
            return (<div>
                        <Pane header={
                            <div>Trip locations <Button color={"#C8C372"} onClick={this.props.reversePlaces} type={"submit"}>
                                <img src={reverseButton} alt={"reverseButton"}/></Button>
                            </div>
                        }
                              bodyJSX={
                                  <div>
                                      <ButtonGroup>
                                          <Button className='btn-csu w-65 text-left' type="submit" id="submitItinerary"
                                                  onClick={this.planTrip.bind(this)}>Calculate distances</Button>
                                          <TripOptions file ={this.props.file} planOptions={this.props.options}
                                                       updateOption={this.props.updateOption}/>
                                      </ButtonGroup>
                                      <TripItinerary file={this.props.file} places={this.props.places}
                                                     distances={this.props.distances} activeUnit={this.props.options.activeUnit}
                                                     calculateTripTotal={this.calculateTripTotal} getName={this.getName} movePlaces={this.movePlaces}
                                                     updateClientMapOptions={this.props.updateClientMapOptions}/>
                                  </div>
                              }/>
                    </div>);
        }
        return null;
    }


    calculateTripTotal(){
        let totalDistance = 0;
        let distanceIncrements = [];
        for(let i =0; i < this.props.distances.length; i++){
            totalDistance += this.props.distances[i];
            distanceIncrements.push(totalDistance);
        }
        return(distanceIncrements);
    }

    toggleMap(){
        this.setState(prevState => ({toggleMapState: !prevState.toggleMapState}));
    }

    callTripMap(){
        let updateTripNameOnChange = (event) => {this.props.updateOption('tripName',event.target.value)};
        if(this.state.toggleMapState === true) {
              return(
                  <Pane header={
                      <div>
                          <input placeholder={"My Trip"} value={this.props.options.options.title} style={{width: "75%"}} id="title" onChange={updateTripNameOnChange}/>
                          <Input type="file" id="file" onChange={this.onReceiveFile.bind(this)}/>
                      </div>}
                        bodyJSX={
                            <div>
                                <TripMap latitude={this.state.latitude} longitude={this.state.longitude}
                                         options={ this.props.options.options} places= {this.props.places}
                                         distances={this.props.distances} getName={this.getName} settings={this.props.settings}
                                         updateClientMapOptions={this.props.updateClientMapOptions} activeUnit={this.props.options.activeUnit}/>
                                {this.renderIntro()}
                            </div>}/>);
        }
    }

    renderIntro() {
        return(
              <TripSave file = {this.props.file}
                        requestType ={this.state.requestType} requestVersion={this.state.requestVersion}
                        options = {this.props.options.options} planOptions={this.props.options}
                        places = {this.props.places} distances = {this.props.distances}
                        updateOption={this.props.updateOption} calculateTripTotal = {this.calculateTripTotal}/>
        );
    }

    renderModifyTrip(){
        if(this.state.file !== null){
            return(
                  <div>
                      <TripModify file ={this.props.file} options={this.props.options}
                                  settings={this.props.settings} places={this.props.places} toggleMap={this.toggleMap}
                                  updateOption = {this.props.updateOption} updatePlaces={this.props.insertPlaces}
                                  reversePlaces = {this.reversePlaces} insertPlaces={this.insertPlaces}
                                  movePlaces={this.movePlaces} createErrorBanner={this.props.createErrorBanner}/>
                  </div>);
        }
    }

    insertPlaces(newLocations, index){
        this.props.insertPlaces(newLocations,index);
        return(this.updateDistances([]));
    }

    movePlaces(indexOne, indexTwo){
        this.props.movePlaces(indexOne,indexTwo);
        return(this.updateDistances([]));
    }

    reversePlaces(){
        return(this.props.reversePlaces());
    }

    updatePlaces(value){
       return this.props.alterPlaces(value);
    }

    updateFile(file){
        return this.props.updateFile(file);
    }

    updateDistances(value){
        return this.props.updateDistances(value);
    }

    setTripSettings(trip){
        return this.props.updateTripSettings(trip);
    }

    getName(place){
        let name = place.name;
        if(name === ""){
            name = parseFloat(place.latitude).toFixed(2) + ", "
                + parseFloat(place.longitude).toFixed(2);
        }
        return name;
    }
}


