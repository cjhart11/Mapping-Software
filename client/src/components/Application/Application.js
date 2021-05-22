import React, {Component} from 'react';
import {Container} from 'reactstrap'
import Home from './Home';
import Trip from "./Trip/Trip";
import About from './About/About'
import Options from './Options/Options';
import Calculator from './Calculator/Calculator';
import Settings from './Settings/Settings';
import {getOriginalServerPort, sendServerRequest} from '../../api/restfulAPI';
import ErrorBanner from './ErrorBanner';
import TipVerification from "./TipVerification";

/* Renders the application.
 * Holds the destinations and options state shared with the trip.
 */
export default class Application extends Component {
  constructor(props){ super(props);
    this.setBindings();
    this.state = {
      serverConfig: null,
      places: [],
      file: null, distances: [], errorMessage: null,
      planOptions: {
        requestType: "none", requestVersion: null, options:{},
        units: {'miles':3959,'kilometers':6371,'nautical miles':3440, 'units':1000}, activeUnit: 'miles',
        optimizations: [], activeOptimization: 'none',
        attributes: [], countries: [], activeCountry: '', types: [], activeType: ''},
      clientSettings: {
        serverPort: getOriginalServerPort(),
        mapOptions: {
          showLines: true, showMarkers: true, highlightedMarker: '',
          markerColors: ["blue","red","green","yellow"], activeMarkerColor: "blue",
          lineColors: ["blue","red","green","yellow"], activeLineColor: "blue"}
      },
    };
    this.updateServerConfig();
  }

  setBindings(){
    this.updatePlanOption = this.updatePlanOption.bind(this);
    this.updateClientSetting = this.updateClientSetting.bind(this);
    this.createApplicationPage = this.createApplicationPage.bind(this);
    this.setOptionsFromConfig = this.setOptionsFromConfig.bind(this);
    this.alterPlaces = this.alterPlaces.bind(this);
    this.insertPlaces = this.insertPlaces.bind(this);
    this.reversePlaces = this.reversePlaces.bind(this);
    this.movePlaces = this.movePlaces.bind(this);
    this.updateFile = this.updateFile.bind(this);
    this.updateDistances = this.updateDistances.bind(this);
    this.updateTripSettings = this.updateTripSettings.bind(this);
    this.updateClientMapOptions = this.updateClientMapOptions.bind(this);
    this.getCoordinate = this.getCoordinate.bind(this);
    this.detectUnit = this.detectUnit.bind(this);
  }

  render() {
    let pageToRender = this.state.serverConfig ? this.props.page : 'settings';

    return (
      <div className='application-width'>
        { this.state.errorMessage }{ this.createApplicationPage(pageToRender) }
      </div>);
  }

  updateClientSetting(field, value) {
    if(field === 'serverPort')
      this.setState({clientSettings: {serverPort: value}}, this.updateServerConfig);
    else {
      let newSettings = Object.assign({}, this.state.planOptions);
      newSettings[field] = value;
      this.setState({clientSettings: newSettings});
    }
  }

  updateClientMapOptions(field, value){
    let settings = this.state.clientSettings;
    switch (field){
      case "showLines":
        settings.mapOptions.showLines=  value;
        break;
      case "showMarkers":
        settings.mapOptions.showMarkers = value;
        break;
      case "highlightedMarker":
        settings.mapOptions.highlightedMarker = value;
        break;
      case "activeLineColor":
        settings.mapOptions.activeLineColor = value;
        break;
      default:
        settings.mapOptions.activeMarkerColor = value;
        break;
    }
    this.setState({clientSettings: settings})
  }

  updatePlanOption(option, value) {
    let optionsCopy = Object.assign({}, this.state.planOptions);
    if(option !== 'tripName'){
      optionsCopy[option] = value;
    }
    else {
      optionsCopy.options['title'] = value;
    }
    this.setState({'planOptions': optionsCopy});
  }

  alterPlaces(value){this.setState({places: value});}

  updateFile(value){this.setState({file: value});}

  updateDistances(value){this.setState({distances: value});}

  reversePlaces() {
    let placesHolder = this.state.places;
    let tempHolder = placesHolder.splice(0,1);
    placesHolder.reverse();
    placesHolder.splice(0,0, tempHolder[0]);
    this.setState({places: placesHolder});
  }

  movePlaces(indexOne, indexTwo){
    let placesHolder = this.state.places;
    switch(indexTwo){
      case '':
        placesHolder.splice(indexOne ,1);
        break;
      case "start":{
        let locationTemp = this.state.places;
        let insertLocations = [];
        for(let i = indexOne; i < locationTemp.length; i++){
          insertLocations.push(locationTemp[i]);
        }
        for(let i = 0; i < indexOne; i++){
          insertLocations.push(locationTemp[i]);
        }
        placesHolder = insertLocations;
        break;
      }
      default: {
        let locationTemp = this.state.places[indexOne];
        placesHolder[indexOne] = this.state.places[indexTwo];
        placesHolder[indexTwo] = locationTemp;
        break;
      }
    }
    this.alterPlaces(placesHolder);
  }

  insertPlaces(newLocations, index){
    let placesHolder = this.state.places;
    if(this.state.places.length === 0){
      placesHolder = newLocations;
    }
    else{
      placesHolder.splice.apply(placesHolder,[index,0].concat(newLocations));
    }
    this.alterPlaces(placesHolder);
  }

  updateTripSettings(trip){
    let optionsHolder = this.state.planOptions;
    optionsHolder.requestType = trip.requestType;
    optionsHolder.requestVersion = trip.requestVersion;
    optionsHolder.options = trip.options;
    optionsHolder.activeUnit = this.detectUnit(parseFloat(trip.options.earthRadius));
    optionsHolder.units[optionsHolder.activeUnit] = parseFloat(trip.options.earthRadius);
    if(optionsHolder.activeUnit === "unit"){
      optionsHolder.units["unit"] = trip.options.earthRadius.toString();
    }
    this.setState({planOptions: optionsHolder});
  }

  detectUnit(tripRadius){
    if(tripRadius >= 3949 && tripRadius <= 3969){return "miles";}
    else if(tripRadius >= 6361 && tripRadius <= 6381){return 'kilometers';}
    else if(tripRadius >= 3430 && tripRadius <= 3450) {return 'nautical miles';}
    else{return "units";}
  }

  updateServerConfig() {
    sendServerRequest('config', this.state.clientSettings.serverPort).then(config => {
      console.log(config);
      this.processConfigResponse(config);});
  }

  createErrorBanner(statusText, statusCode, message) {
    return (
      <ErrorBanner statusText={statusText} statusCode={statusCode} message={message}/>);
  }

  createApplicationPage(pageToRender) {
    switch(pageToRender) {
      case 'calc':
        return <Calculator options={this.state.planOptions} settings={this.state.clientSettings}
                           createErrorBanner={this.createErrorBanner}/>;
      case 'options':
        return <Options options={this.state.planOptions} config={this.state.serverConfig}
                        updateOption={this.updatePlanOption}/>;
      case 'trip':
        return <Trip options={this.state.planOptions} config={this.state.serverConfig}
                      settings={this.state.clientSettings} getCoordinate ={this.getCoordinate}
                      updateClientMapOptions={this.updateClientMapOptions}
                      updateOption={this.updatePlanOption} places={this.state.places}
                      alterPlaces={this.alterPlaces} insertPlaces={this.insertPlaces}
                      reversePlaces={this.reversePlaces} movePlaces={this.movePlaces}
                      distances={this.state.distances} updateDistances={this.updateDistances}
                      updateTripSettings={this.updateTripSettings} file = {this.state.file}
                      updateFile = {this.updateFile} createErrorBanner={this.createErrorBanner}/>;
      case 'about':
        return <About options={this.state.planOptions}
                        config={this.state.serverConfig} updateOption={this.updatePlanOption}/>;
      case 'settings':
        return <Settings settings={this.state.clientSettings}
                         serverConfig={this.state.serverConfig} updateSetting={this.updateClientSetting}/>;
      default: return <Home/>;
    }
  }
  /*
  optionsHolder preserves the current state of options and then grabs optimizations settings from the server config
  */
  processConfigResponse(config) {
    const validator = new TipVerification();
    if(validator.validateApiResponse(config)) {
      if (config.statusCode >= 200 && config.statusCode <= 299) {
        console.log("Switching to server ", this.state.clientSettings.serverPort);
        this.setState({
          serverConfig: config.body, errorMessage: null});
        //not written by dave starting here
        this.setOptionsFromConfig(config);
      } else {
        this.setState({
          serverConfig: null,
          errorMessage:
              <Container>
                {this.createErrorBanner(config.statusText, config.statusCode,
                    `Failed to fetch config from ${this.state.clientSettings.serverPort}. Please choose a valid server.`)}
              </Container>
        });
      }
    }
    else {
      alert("Invalid Config API Response")
    }
  }

  setOptionsFromConfig(config){
    if (config.body.requestVersion >= 3) {
      let optionsHolder = this.state.planOptions;
      optionsHolder.optimizations = config.body.optimizations;
      optionsHolder.activeOptimization = config.body.optimizations[0];
      optionsHolder.attributes = config.body.placeAttributes;
      if (config.body.requestVersion >= 4) {
        if (config.body.filters.length > 0) {
          optionsHolder.countries = config.body.filters[1].values;
          optionsHolder.types = config.body.filters[0].values;
          optionsHolder.countries.splice(0,0, "Select all Countries");
          optionsHolder.activeCountry = "Select all Countries";
          optionsHolder.types.splice(0,0, "Select all types");
          optionsHolder.activeType = "Select all types";
        }
      }
      this.setState(({options: optionsHolder}));
    }
  }
  getCoordinate(type){
    if(type === "latitude") {
      return (this.state.places[0].latitude);
    }
    else{
      return (this.state.places[0].longitude);
    }
  }

}