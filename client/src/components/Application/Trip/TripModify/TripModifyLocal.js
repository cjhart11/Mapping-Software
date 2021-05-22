import React, {Component} from 'react';
import {Button,InputGroup,Form,Input} from 'reactstrap'
import Coordinates from "../../Coordinates";

export default class TripModifyLocal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sources:["local", "database"],
            activeSource: "local",
            newLocations: [],
            activeLocation : {},
            startIndex: '',
            submitIndex: this.props.places.length
        };
        this.updateLocationOnChange = this.updateLocationOnChange.bind(this);
        this.submitLocalTrip = this.submitLocalTrip.bind(this);
        this.resetActiveLocation= this.resetActiveLocation.bind(this);
        this.setUpdatedCoordinates = this.setUpdatedCoordinates.bind(this);
        this.updateLocalLocationList= this.updateLocalLocationList.bind(this);
        this.updateIndexOnChange = this.updateIndexOnChange.bind(this);
    }

    render() {
        return (this.renderLocalSources());
    }

    componentDidMount() {
        this.resetActiveLocation();
    }

    renderLocalSources(){
        return(
              <div>
                  <InputGroup horizontal className='w100'>
                      {this.renderLocalInputs((this.props.options.attributes))}
                      {this.renderIndexInput()}
                      <Button className='btn-csu w-75 text-center' onClick={this.submitLocalTrip}> Add location </Button>
                  </InputGroup>
              </div>
        );
    }

    renderIndexInput(){
        let updateIndexVarOnChange = (event) => {this.updateIndexOnChange(event.target.value)};

        return(<Form>
            <Input className='w49'
                   name={"index"} placeholder={"Index (optional)"}
                   id={`${this.state.startIndex}` + "_index"}
                   value={this.state.startIndex}
                   onChange={updateIndexVarOnChange}
                   style={{width: "75%"}}>
            </Input>
        </Form>);
    }

    submitLocalTrip(){
        if(this.checkInputs() && this.props.checkIndex(this.state.startIndex)) {
            this.setCoordinates();
        }
        else {
            this.setState({startIndex: ''});
            this.setState({submitIndex: this.props.places.length});
        }
    }

    checkInputs(){
        if(this.state.activeLocation.name  === '' || this.state.activeLocation.latitude === '' ||
            this.state.activeLocation.longitude === '') {
            alert("Name, Latitude, and Longitude are required.");
            this.resetActiveLocation();
            return false;
        }
        return true;
    }

    setCoordinates(){
        const coords = new Coordinates();
        try {
            coords.addCoordinates(
                this.state.activeLocation.name,
                [this.state.activeLocation.latitude,
                    this.state.activeLocation.longitude]);
        } catch (e) {
            this.resetActiveLocation();
            return;
        }
        this.updateEverythingLocal(coords);
    }

    updateEverythingLocal(coords){
        this.setUpdatedCoordinates(coords);
        this.updateLocalLocationList();
        this.updatePlacesList();
    }

    resetEverythingLocal(){
        this.resetActiveLocation();
        this.setState({startIndex: ''});
        this.setState({submitIndex:this.props.places.length});
        this.resetLocations();
    }

    resetLocations(){
        this.setState({newLocations:[]});
    }

    updateLocalLocationList(){
        let localLocationHolder = this.state.newLocations.push(this.state.activeLocation);
        this.setState({newLocations: localLocationHolder});
    }

    updatePlacesList(){
        this.props.updatePlaces(this.state.newLocations, this.state.submitIndex);
        this.resetEverythingLocal();
    }

    setUpdatedCoordinates(coords){
        let locationHolder = this.state.activeLocation;
        locationHolder.latitude = coords.state.coordinates[0].latitude.toString();
        locationHolder.longitude = coords.state.coordinates[0].longitude.toString();
        this.setState({activeLocation: locationHolder})
    }

    resetActiveLocation(){
        this.setState({activeLocation: {
                "name": '',
                "latitude": '',
                "longitude": '' ,
                "altitude" : '',
                "id": '',
                "municipality": '',
                "type": '',
                "region": '',
                "country": '',
                "continent": ''
            }});
    }

    renderLocalInputs(tripAttributes){
        return tripAttributes.map((attribute, unit) =>
            <Form key ={`${attribute}${unit}`}>
                {this.createInputField(attribute,unit)}
            </Form>
        )
    }

    updateIndexOnChange(value){
        this.setState({startIndex: value});
        this.setState({submitIndex: value});
    }

    createInputField(stateAttrib , unit) {
        let updateStateVarOnChange = (event) => {
            this.updateLocationOnChange(stateAttrib, event.target.value)};

        let capitalizedStateAttrib = stateAttrib.toString().charAt(0).toUpperCase() + stateAttrib.toString().slice(1);
        capitalizedStateAttrib = this.checkRequired(capitalizedStateAttrib);
        return (
            <Input name={stateAttrib} placeholder={capitalizedStateAttrib}
                   id={`${unit}${capitalizedStateAttrib}`}
                   value={this.state.activeLocation[stateAttrib]}
                   onChange={updateStateVarOnChange}
                   style={{width: "100%"}}/>
        );

    }

    checkRequired(attrib){
        switch (attrib) {
            case "Name": attrib += " (required)"; break;
            case "Latitude": attrib += " (required)";break;
            case "Longitude": attrib += " (required)";break;
            default: attrib += " (optional)";break;
        }
        return attrib;
    }

    updateLocationOnChange(stateAttrib, value) {
        let location = Object.assign({}, this.state.activeLocation);
        location[stateAttrib] = value;
        this.setState({activeLocation: location});
    }
}
