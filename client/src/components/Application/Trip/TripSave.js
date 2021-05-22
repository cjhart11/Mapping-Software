import React, {Component} from 'react';
import {Dropdown, DropdownToggle, DropdownMenu, Button, ButtonGroup} from 'reactstrap'

export default class TripSave extends Component {
    constructor(props) {
        super(props);

        this.state = {
            saveDropdownOpen: false,
            fileTypes:{'JSON' : 0, 'CSV' : 1},
            fileCSV: null,
            fileJSON: null
        };

        this.toggleSave = this.toggleSave.bind(this);
        this.createJSONFile = this.createJSONFile.bind(this);
        this.createCSVFile = this.createCSVFile.bind(this);
    }

    render(){
        return(this.renderSave());
    }

    toggleSave(){
        this.setState(prevState => ({
            saveDropdownOpen: !prevState.saveDropdownOpen
        }));
    }

    renderSave(){
        if(this.props.file !== null){
            return (
                <Dropdown isOpen={this.state.saveDropdownOpen} toggle={this.toggleSave}>
                    <span>
                        <DropdownToggle className='btn-csu w-100 text-left'>
                            Trip file saving options
                        </DropdownToggle>
                        <DropdownMenu className='text-center' style={{fontWeight: 500, color: 'black'}}>
                            {this.createFileURL()}
                        </DropdownMenu>
                    </span>
                </Dropdown>
            );
        }
        else {
            return null;
        }
    }

    createJSONFile(){
        let typeHolder = {
            "requestType" : this.props.requestType,
            "requestVersion" : this.props.requestVersion,
            "options" : {
                "title": this.props.options.title,
                "earthRadius" : this.props.options.earthRadius,
                "optimization" : this.props.options.optimization,
            },

            "places": [],
            "distances": []
        };
        for(let i= 0 ; i < this.props.places.length; i++){
            typeHolder.places[i] = {
                "name": this.props.places[i].name,
                "latitude" : this.props.places[i].latitude,
                "longitude" : this.props.places[i].longitude
            };
        }

        for(let i= 0 ; i < this.props.distances.length; i++){
            typeHolder.distances[i] = this.props.distances[i];


        }
        this.state.fileJSON = typeHolder;
    }

    createCSVFile(){
        let CSVHolder= "\"index\",\"name\",\"latitude\",\"longitude\",\"Distance to next location\",\"Cumulative distance\"\n";
        let cDistances = this.props.calculateTripTotal();
        let lDistances = this.props.distances;
        for (let i = 0; i < this.props.places.length ; i++){
            CSVHolder += "\"" + i.toString() + "\",";
            CSVHolder += "\"" + this.props.places[i].name.toString() + "\",";

            //insert handling for types or other values we might want to include
            CSVHolder += "\"" + this.props.places[i].latitude.toString() + "\",";
            CSVHolder += "\"" + this.props.places[i].longitude.toString() + "\",";
            if(cDistances.length === this.props.places.length) {
                CSVHolder += "\"" + lDistances[i].toString() + "\",";
                CSVHolder += "\"" + cDistances[i].toString() + "\"\n";
            } else{
                CSVHolder += "\"\",\"\"\n"
            }
        }

        this.state.fileCSV = CSVHolder;
    }

    createFileURL(){

        this.createJSONFile();
        this.createCSVFile();
        return(
            <ButtonGroup>
                {Object.keys(this.state.fileTypes).map((unit) =>
                this.renderDownloadButton(unit))}
            </ButtonGroup>);
    }

    renderDownloadButton(type){
        let outputLocation = null;
        let outputFile = null;
        if(type === "JSON"){
            outputLocation = document.createElement("outputLocationJSON");
            outputFile = new Blob([JSON.stringify(this.state.fileJSON)], {type: "application/json"});

        }
        else{
            outputLocation = document.createElement("outputLocationCSV");
            outputFile = new Blob([this.state.fileCSV], {type: "text/csv"});
        }
        outputLocation.href = URL.createObjectURL(outputFile);
        return (
            <Button className='btn-csu w-100 text-left'
                    style={{color:'white'}}
                    href={outputLocation.href}
                    key={type+"_download"}
                    download={this.formatTitle() + "." + type}>{type}</Button>
        );
    }


    formatTitle(){
        if(this.props.options.title !== undefined){
            return this.props.options.title.replace(/[\W_]+/g,"_");
        }
        return "My_Trip";
    }
}


