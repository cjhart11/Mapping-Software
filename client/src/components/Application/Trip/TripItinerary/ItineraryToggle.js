import React, {Component} from 'react';
import {Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Button, ButtonGroup} from "reactstrap";
import infoButton from "../../../../../client images/infoSmall.png";
import trashButton from "../../../../../client images/trashSmall.png";
import topButton from "../../../../../client images/TopSmall.png";
import downButton from "../../../../../client images/DownSmall.png";
import upButton from "../../../../../client images/UpSmall.png";

export default class ItineraryToggle extends Component {

    constructor(props) {
        super(props);

        this.toggle= this.toggle.bind(this);
        this.removeListing = this.removeListing.bind(this);
        this.moveListingToStart = this.moveListingToStart.bind(this);
        this.moveListingDown = this.moveListingDown.bind(this);
        this.moveListingUp = this.moveListingUp.bind(this);

        this.state = {
            isOpen: false,
        };


    }

    toggle(){
        this.setState(prevState => ({
            isOpen: !prevState.isOpen
        }));
    }

    render() {
        return (<td>
                    <Dropdown isOpen={this.state.isOpen} toggle={this.toggle}>
                        <DropdownToggle color="white">
                            <img src={infoButton} alt={"infoButton"}/>
                        </DropdownToggle>
                        <DropdownMenu style={{fontWeight: 500, color: 'black'}}>
                            <DropdownItem>{this.props.places[this.props.index].name}</DropdownItem>
                            <DropdownItem divider/>
                            <DropdownItem>Id: {this.props.places[this.props.index].id}</DropdownItem>
                            <DropdownItem>Latitude: {this.coordinatesToDecimal("latitude")}</DropdownItem>
                            <DropdownItem>Longitude: {this.coordinatesToDecimal("longitude")}</DropdownItem>
                            <DropdownItem>Altitude: {this.props.places[this.props.index].altitude}</DropdownItem>
                            <DropdownItem>Municipality: {this.props.places[this.props.index].municipality}</DropdownItem>
                            <DropdownItem>Region: {this.props.places[this.props.index].region}</DropdownItem>
                            <DropdownItem>Country: {this.props.places[this.props.index].country}</DropdownItem>
                            <DropdownItem>Continent: {this.props.places[this.props.index].continent}</DropdownItem>
                            <DropdownItem>Type: {this.props.places[this.props.index].type}</DropdownItem>
                            <DropdownItem divider/>
                            {this.renderAlterButtons()}
                        </DropdownMenu>
                    </Dropdown>
                </td>);
    }

    coordinatesToDecimal(latLon){
        let value = this.props.places[this.props.index].longitude;
        if(latLon === "latitude"){
            value = this.props.places[this.props.index].latitude;
        }
        return parseFloat(value).toFixed(2);
    }

    renderAlterButtons(){
        return(
            <div>
                <ButtonGroup>
                    {this.renderMoveToStart()}
                    {this.renderMoveDown()}
                    <Button color="white" onClick={this.removeListing}> <img src={trashButton} alt={"trashButton"}/></Button>
                </ButtonGroup>
                <DropdownItem>
                    <Button onClick={this.highlightListing.bind(this)}> Highlight on map</Button>
                </DropdownItem>
            </div>
        );
    }

    renderMoveToStart(){
        if(this.props.index !== 0){
            return(
                <ButtonGroup>
                    <Button onClick={this.moveListingToStart} color="white" ><img src={topButton} alt={"topButton"}/></Button>
                    <Button color="white" onClick={this.moveListingUp} ><img  alt={"upButton"} src={upButton}/></Button>
                </ButtonGroup>

            );
        }
    }

    renderMoveDown(){
        if(this.props.index !== this.props.places.length-1){
            return(
                <Button onClick={this.moveListingDown} color="white" ><img  alt={"downButton"} src={downButton}/></Button>
            );
        }
    }

    removeListing(){
        return this.props.movePlaces(this.props.index, '');
    }

    moveListingToStart(){
        return this.props.movePlaces(this.props.index, 'start');
    }

    highlightListing(){
        return this.props.updateClientMapOptions("highlightedMarker", this.props.index);
    }

    moveListingDown(){
        return this.props.movePlaces(this.props.index, this.props.index+1);
    }

    moveListingUp(){
        return this.props.movePlaces(this.props.index, this.props.index-1);
    }
}
