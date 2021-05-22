import React, {Component} from 'react';
import 'leaflet/dist/leaflet.css';
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Button, ButtonGroup} from "reactstrap";

export default class TripMapOptions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mapOptionsOpen: false,
            geoJsonMap: null,
            file: null
        };
        this.toggleMapOptions = this.toggleMapOptions.bind(this);
    }

    toggleMapOptions(){
        this.setState(prevState => ({
            mapOptionsOpen: !prevState.mapOptionsOpen
        }));
    }

    render() {
        return (
            <Dropdown isOpen={this.state.mapOptionsOpen} toggle={this.toggleMapOptions}>
                <DropdownToggle className='btn-csu w-100 text-left'>
                    Map options
                </DropdownToggle>
                {this.renderDropdownMenu()}
            </Dropdown>
        )
    }

    renderDropdownMenu(){
        return (
            <DropdownMenu className={"text-center"} overflow={"visible"} header={"Map options"} style={{fontWeight: 500, color: 'black'}}>
                <DropdownItem onClick={this.setMarkerState.bind(this)}
                              className='btn-csu w-100 text-center'
                              type="submit" id="show Markers"
                >
                    Show markers
                </DropdownItem>
                {this.createButtonGroup("marker")}
                <DropdownItem className='btn-csu w-100 text-center'
                              onClick={this.setLineState.bind(this)}
                              type="submit" id="Show lines"
                >
                    Show lines
                </DropdownItem>
                {this.createButtonGroup("line")}
                <DropdownItem className={"text-center"} disabled={true} id="Download Map">
                    Download Map
                </DropdownItem>
                {this.createButtonGroup("download")}
            </DropdownMenu>
        );
    }

    createButtonGroup(type){
        let buttonValues = null;
        let objectType = '';
        if (type === "marker"){
            buttonValues = this.props.settings.mapOptions.markerColors;
            objectType = "marker";
        }
        else if (type === "line"){
            buttonValues = this.props.settings.mapOptions.lineColors;
            objectType = "line";
        }
        else {
            buttonValues = ["svg", "kml"];
            objectType= "download";
        }
        return(
            <ButtonGroup>
                {this.createButtons(buttonValues, objectType)}
            </ButtonGroup>);
    }

    createButtons(names, objectType) {
        let keyHolder = "";
        let activeUnitValue = null;
        let activeChangeUnit = '';
        if (objectType === "line"){
            keyHolder = "lineButton";
            activeUnitValue = this.props.settings.mapOptions.activeLineColor;
            activeChangeUnit = 'activeLineColor';
        }
        else if (objectType === "marker"){
            keyHolder = "markerButton";
            activeUnitValue = this.props.settings.mapOptions.activeMarkerColor;
            activeChangeUnit = 'activeMarkerColor';
        }
        else {
            keyHolder = "downloadButton";
            return names.map((unit) =>
            <Button
                className='btn-csu w-100 text-center'
                key={keyHolder+unit} value={unit}  style={{color:'white'}}
                href={unit === "kml" ? this.props.kml : this.props.svg}
                download={"map." + unit}
            >
                {unit}
            </Button>);
        }
        return names.map((unit) =>
            <Button
                className='btn-csu w-100 text-center'
                style={{color:'white'}} key={keyHolder+unit}
                active={activeUnitValue === unit} value={unit}
                onClick={(event) => this.props.updateClientMapOptions(activeChangeUnit, event.target.value)}
            >
                {unit.charAt(0).toUpperCase() + unit.slice(1)}
            </Button>);
    }

    setMarkerState(){
        return(this.props.updateClientMapOptions("showMarkers", !this.props.settings.mapOptions.showMarkers));
    }

    setLineState(){
        return(this.props.updateClientMapOptions("showLines", !this.props.settings.mapOptions.showLines));
    }
}
