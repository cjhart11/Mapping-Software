import React, {Component} from 'react';
import {Button, Form, Input, Table} from 'reactstrap'
import Pane from "../../Pane";
import TipVerification from "../../TipVerification";
import {sendServerRequestWithBody} from "../../../../api/restfulAPI";
import Checkbox from "./Checkbox";
import TripDatabaseSelect from "./TripDatabaseSelect";
import Modal from "react-modal";

export default class TripDatabase extends Component {

    constructor(props) {
        super(props);
        this.setBindings();
        this.state = {
            sources: ["local", "database"],
            activeSource: "database",
            newLocations: [],
            userInput: "",
            found: 0,
            updated: false,
            placeIndex: '',
            checkBoxArray: [],
            popupState: false,
            submitIndex: this.props.places.length,
            checkedArray: new Map()
        };

    }

    setBindings(){
        this.onInputChange = this.onInputChange.bind(this);
        this.searchDatabase = this.searchDatabase.bind(this);
        this.verifyRequest = this.verifyRequest.bind(this);
        this.submitSearch = this.submitSearch.bind(this);
        this.setLocationsFromData = this.setLocationsFromData.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.createDataIndex = this.createDataIndex.bind(this);
        this.pickList = this.pickList.bind(this);
        this.setDataIndex = this.setDataIndex.bind(this);
        this.resetIndex = this.resetIndex.bind(this);
        this.resetPlaces = this.resetPlaces.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
        this.displayFoundCount = this.displayFoundCount.bind(this);
    }

    render() {
        return(
            <div>
                {this.renderSelectionMenus()}
                {this.dataSelection()}
            </div>
        );
    }

    renderSelectionMenus(){
        let updateOnChange = (event) => {this.onInputChange(event.target.value)};
        if(this.props.options.types.length > 0 || this.props.options.countries.length > 0){
            return(
                  <Form>
                      <div>
                      <TripDatabaseSelect type={"Type"} values = {this.props.options.types} updateOption = {this.props.updateOption}
                                          active = {this.props.options.activeType}/>
                      <TripDatabaseSelect type={"Country"} values = {this.props.options.countries} updateOption = {this.props.updateOption}
                                          active = {this.props.options.activeCountry}/>

                      <Input
                          input type={"text"} placeholder={"Search..."}
                          className={"w100"} value={this.state.userInput}
                          onChange={updateOnChange} style={{width: "50%"}}/>
                          <div>
                        <Button className='btn-csu w-75 text-center' onClick={this.submitSearch}> Search for Location </Button>
                          </div>
                      </div>
                  </Form>);
        }
    }

    dataSelection(){
        return(
            <div>
                {this.renderList()}
            </div>);
    }

    renderList(){
        if(this.state.found > 0) {
            return(
                <div>
            <Modal
                isOpen={this.state.popupState}
                onRequestClose={this.togglePopup}
                shouldFocusAfterRender={true}
                shouldCloseOnEscape={true}
                style={modalStyle}>
                <Pane header={this.displayFoundCount()}
                      bodyJSX={
                          <div>
                              <Table striped responsive hover>
                                  <thead>
                                  <tr>
                                      <th>selected</th>
                                      <th>Location</th>
                                      <th>Country</th>
                                      <th>Region</th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                  {this.state.newLocations.map((place, index) =>
                                      this.renderChoicesList(place, index)
                                  )}
                                  </tbody>
                              </Table>
                              {this.createDataIndex()}
                          </div>

                      }/>
                <button onClick={this.togglePopup}>Close</button>
                <button onClick={this.pickList}>Submit</button>
                </Modal>
                   </div>
        );
        }
    }

    togglePopup(){
        this.setState(prevState => ({popupState: !prevState.popupState}));
        this.props.toggleMap();
    }

    setDataIndex(value){
        this.setState({placeIndex: value});
        this.setState({submitIndex: value})
    }

    createDataIndex(){
        let updateIndexVarOnChange = (event) => {
            this.setDataIndex(event.target.value)};

        return(<Form>
            <Input className='w100'
                   name={"index"} placeholder={"Insert index (optional)"}
                   id={`${this.state.placeIndex}` + "_dataIndex"}
                   key={`${this.state.placeIndex}` + "_dataIndex"}
                   value={this.state.placeIndex}
                   onChange={updateIndexVarOnChange}
                   style={{width: "50%"}}>
            </Input>
        </Form>);
    }

    pickList(){
        if(this.props.checkIndex(this.state.placeIndex)){
            let temp = [];
            for (let i = 0; i < this.state.newLocations.length; i++) {
                let spot = "check-box" + i;
                if (this.state.checkedArray.get(spot)) {
                    temp.push(this.state.newLocations[i]);
                }
            }
            this.props.insertPlaces(temp, this.state.submitIndex);
            this.togglePopup();
            return this.resetAll();
        }
        else{this.resetIndex();}
    }

    resetAll(){
        this.resetIndex();
        this.resetPlaces();
    }

    resetPlaces(){
        this.setState({newLocations: [],
                             userInput: '',
                             found: 0,
                             updated: false,
                             checkBoxArray: [],
                             checkedArray: new Map()});
    }

    resetIndex(){
        this.setState({placeIndex: '', submitIndex: this.props.places.length});
    }

    renderChoicesList(place, index){
        return (
            <tr key={`${index}` + "_tableIndex"}>
                <th class="text-center">{this.createCheckBox(index)}</th>
                <th>{place.name}</th>
                <th>{place.country}</th>
                <th>{place.region}</th>
            </tr>
        );
    }

    createCheckBox(index){
        let checkName = "check-box" + index;
        let CheckKey = "checkbox" + index;
        return(
            <Checkbox key = {CheckKey} name={checkName} checked={this.state.checkedArray.get(checkName)} onChange={this.handleChange.bind(this)}/>
        )
    }

    handleChange(e) {
        let item = e.target.name;
        let isChecked = e.target.checked;
        this.setState(prevState => ({checkedArray: prevState.checkedArray.set(item, isChecked)}));
    }

    onInputChange(value){
        this.setState({userInput: value});
    }


    displayFoundCount(){
        return "Showing " + this.state.newLocations.length + " of " + this.state.found + " matching locations";
    }

    submitSearch(){
        this.resetAll();
        this.searchDatabase();
        this.togglePopup();
    }

    searchDatabase(){

        if(this.checkString()) {
            let tipConfigRequest = {
                'requestType': "locations",
                'requestVersion': 5,
                'match': this.state.userInput,
                'narrow': [],
                'limit': 10,
                'found': 0,
                'places': []
            };
            tipConfigRequest = this.databaseRequestFilters(tipConfigRequest, "type");
            tipConfigRequest = this.databaseRequestFilters(tipConfigRequest, "countries");
            this.verifyRequest(tipConfigRequest);
        }
    }

    databaseRequestFilters(tipConfigRequest, type){
        let valueHolder = "";
        let nameHolder = "";
        let comparison = "";
        if(type === "type"){
             nameHolder = "type";
             comparison = "Select all types";
             valueHolder = this.props.options.activeType;
        }
        else{
            nameHolder = "country";
            comparison = "Select all Countries";
            valueHolder = this.props.options.activeCountry;
        }
        tipConfigRequest = this.setFilterValues(tipConfigRequest,nameHolder, valueHolder, comparison);
        return tipConfigRequest;
    }

    setFilterValues(tipConfigRequest, nameHolder, valueHolder, comparison){
        if (this.props.options.types.length > 0){
            if(valueHolder !== comparison){
                tipConfigRequest.narrow.push({"name":nameHolder,"values":[valueHolder]});
            }
            else{
                tipConfigRequest.narrow.push({"name":nameHolder,"values":[""]});
            }
        }
        return tipConfigRequest;
    }

    checkString(){
        let valid = /^[0-9a-zA-Z ]+$/;
        let check = this.state.userInput;

        if(this.state.userInput === null || this.state.userInput === ''){
            alert("Please input a search term");
            return false;
        }
        else if(!(check.match(valid))){
            alert("Please input only letters or numbers");
            return false;
        }
        return true;
    }

    verifyRequest(tipConfigRequest){
        const validator = new TipVerification();
        if(validator.verifyRequest(tipConfigRequest)) {
            sendServerRequestWithBody('location', tipConfigRequest, this.props.settings.serverPort)
                .then((response) => {
                    if(validator.validateApiResponse(response)) {
                        if (response.statusCode >= 200 && response.statusCode <= 299) {
                            this.setLocationsFromData(response);
                        } else {
                            this.setState({
                                errorMessage: this.props.createErrorBanner(
                                    response.statusText,
                                    response.statusCode,
                                    `Request to ${this.props.settings.serverPort} failed.`
                                )
                            });
                        }
                    }
                    else {
                        alert("Invalid Locations API Response")
                    }
                });
        }
        else{
            alert("Invalid Tip Request");
        }
    }

    setLocationsFromData(response){
        this.setState({
            newLocations: response.body.places,
            found: response.body.found,
            updated: true,
            errorMessage: null
        });
    }

}

let modalStyle ={
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 5,
    maxWidth: 100,
    minHeight: 300,
    margin: '0 auto',
    padding: 30
};