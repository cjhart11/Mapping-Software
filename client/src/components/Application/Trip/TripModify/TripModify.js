import React, {Component} from 'react';
import {
    Button,
    ButtonGroup,
    Row,
    Col,
    Form,
    Input,
    DropdownToggle,
    DropdownMenu,
    Dropdown
} from 'reactstrap'
import TripModifyLocal from "./TripModifyLocal";
import TripDatabase from "./TripDatabase";
import Pane from "../../Pane";


export default class TripModify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sources:["add from database" , "add locally", "remove location", "swap locations","move to start", "reverse list"],
            activeSource: "add from database",
            indexOne: '',
            indexTwo: '',
            tripModifyDropdownOpen: false
        };
        this.updateSource = this.updateSource.bind(this);
        this.updateIndexOnChange = this.updateIndexOnChange.bind(this);
        this.processModifications = this.processModifications.bind(this);
        this.renderSingleButton= this.renderSingleButton.bind(this);
        this.renderReverseList = this.renderReverseList.bind(this);
        this.toggleModify = this.toggleModify.bind(this);
        this.checkIndex = this.checkIndex.bind(this);
    }

    render() {
        if (this.props.file !== null){
            return ( <Pane header={"Trip modifications"}
                           bodyJSX={<div>
                                   <Col xs={12} sm={12} md={7} lg={8} xl={9}>
                                       <Form>
                                           <Row>
                                               <Dropdown isOpen={this.state.tripModifyDropdownOpen} toggle={this.toggleModify}>
                                                   <DropdownToggle className='btn-csu w-100 text-left'>
                                                       Trip modifications
                                                   </DropdownToggle>
                                                   <DropdownMenu className='csu-text-header w-100 text-center'>
                                                       <ButtonGroup  vertical> {this.renderModificationSourceButtons(this.state.sources)}</ButtonGroup>
                                                   </DropdownMenu>
                                               </Dropdown>
                                           </Row>
                                       </Form>
                                       <Form>
                                           <Row>
                                               {this.renderModificationInputs()}
                                           </Row>
                                       </Form>
                                   </Col>
                           </div>}/>);
        }return null;
    }

    toggleModify() {
        this.setState(prevState => ({
            tripModifyDropdownOpen: !prevState.tripModifyDropdownOpen
        }));
    }

    renderModificationSourceButtons(names) {
        return names.map((unit,index) =>
            <Button
                className='btn-csu w-100 text-center'
                key={"button_"+unit+index}
                active={this.state.activeSource === unit}
                value={unit}
                onClick={(event) => this.updateSource(event.target.value)}
            >
                {unit.toString().charAt(0).toUpperCase() + unit.toString().slice(1)}
            </Button>
        );
    }

    updateSource(value) {
        this.setState({activeSource: value});
    }

    checkIndex(startIndex){
        if(startIndex > this.props.places.length ||
            startIndex < 0){
            alert("Index must be within the current location list.");
            return false;
        }
        else if(isNaN(startIndex)){
            alert("Index must be a number.");
            return false;
        }

        return true;
    }

    renderModificationInputs(){
        let activeRender = null;
        switch(this.state.activeSource){
            case 'add locally':
                activeRender = this.renderLocalAddition();
                break;
            case 'add from database':
                return(
                    <div>
                        <TripDatabase file ={this.props.file}
                                      options={this.props.options}
                                      places={this.props.places}
                                      settings={this.props.settings}
                                      updatePlaces={this.updatePlaces}
                                      insertPlaces={this.props.insertPlaces}
                                      updateOption = {this.props.updateOption}
                                      toggleMap={this.props.toggleMap}
                                      checkIndex={this.checkIndex}
                                      createErrorBanner={this.props.createErrorBanner}/>
                    </div>);
            case 'remove location':
                activeRender =this.renderRemoveLocation();
                break;
            case 'swap locations':
                activeRender =this.renderSwapLocation();
                break;
            case 'reverse list':
                activeRender = this.renderReverseList();
                break;
            default:
                activeRender= this.renderSetIndexToStart();
                break;
        }
        return activeRender;
    }

    renderReverseList(){
        return(
             <div>
                 <Button onClick={this.props.reversePlaces}
                         className='btn-csu w-75 text-center'>
                     Reverse locations list
                 </Button>
             </div>
        );
    }

    renderLocalAddition(){
        return(<div>
            <TripModifyLocal file ={this.props.file}
                             options={this.props.options}
                             places={this.props.places}
                             checkIndex={this.checkIndex}
                             updatePlaces={this.props.updatePlaces}/>
        </div>);
    }

    renderRemoveLocation(){
        return(
          <div>
              {this.renderSingleIndex()}
              {this.renderSingleButton()}
          </div>
        );
    }

    renderSwapLocation(){
        return(
              <div>
                {this.renderSwapIndex()}
                {this.renderSingleButton()}
              </div>
        );
    }

    renderSetIndexToStart(){
        return(
              <div>
                {this.renderSingleIndex()}
                {this.renderSingleButton()}
              </div>
        );
    }

    renderSingleButton(){
        let buttonText = '';
        if (this.state.activeSource === 'remove location'){
            buttonText = "Remove location at index";
        }
        else if (this.state.activeSource === 'swap locations'){
            buttonText = "Swap Locations";
        }
        else {
            buttonText = "Move location to start of trip";
        }
        return(
            <Button className='btn-csu w-100 text-center'
                    onClick={this.processModifications}>
                {buttonText}
            </Button>
        )
    }

    processModifications(){
        switch(this.state.activeSource){
            case 'remove location':{
                if(this.indexSingleCheck()){
                    this.updatePlaces();
                }
                break;
            }
            case 'swap locations':{
                if(this.indexSwapCheck()){
                    this.updatePlaces();
                }
                break;
            }
            default:{
                if(this.indexSingleCheck()){
                    this.props.movePlaces(this.state.indexOne, "start");
                }
                break;
            }
        }
        this.setState({indexOne: '' , indexTwo:''});
    }

    updatePlaces(){
        this.props.movePlaces(this.state.indexOne, this.state.indexTwo);
    }

    renderSingleIndex(){
        let updateIndexVarOnChange = (event) => {
            this.updateIndexOnChange(event.target.name , event.target.value)};

        let holder = '';
        if (this.state.activeSource === 'remove location'){
            holder = "Remove index";
        }
        else{
            holder = "Index to move";
        }

        return(<Form>
            <Input className='w100'
                   name={"indexOne"} placeholder={holder}
                   id={`${this.state.indexOne}` + "_index"}
                   value={this.state.indexOne}
                   onChange={updateIndexVarOnChange}
                   style={{width: "100%"}}>
            </Input>
        </Form>);
    }

    indexSingleCheck(){
        let returnVal = true;
        if(this.state.indexOne === ''){
            alert("Please choose an index to change.");
            returnVal = false;
        }
        else if (this.state.indexOne >= this.props.places.length || this.state.indexOne < 0){
            alert("Index must be within the current list.");
            returnVal = false;
        }
        else if (isNaN(this.state.indexOne)) {
            alert("Index must be an integer.");
            returnVal = false;
        }

        return returnVal;
    }

    indexSwapCheck(){
        let returnVal = true;
        if(this.state.indexTwo === '' || this.state.indexOne === ''){
            alert("Please choose indexes to swap.");
            returnVal = false;
        }
        else if(this.state.indexOne === this.state.indexTwo){
            alert("Swapped indexes must be different.");
            returnVal = false;
        }
        else if (this.state.indexTwo >= this.props.places.length || this.state.indexTwo < 0){
            alert("Indexes must be within the current list.");
            returnVal = false;
        }
        else if (isNaN(this.state.indexTwo || isNaN(this.state.indexOne))) {
            alert("Index must be an integer.");
            returnVal = false;
        }
        else if (this.state.indexOne >= this.props.places.length || this.state.indexOne < 0){
            alert("Indexes must be within the current list.");
            returnVal = false;
        }
        return returnVal;
    }

    renderSwapIndex(){
        let updateIndexVarOnChange = (event) => {
            this.updateIndexOnChange(event.target.name , event.target.value)};

        return(<Form>
            <Input className='w100'
                   name={"indexOne"} placeholder={"First index"}
                   id={`${this.state.indexOne}` + "_index"}
                   value={this.state.indexOne}
                   onChange={updateIndexVarOnChange}
                   style={{width: "100%"}}>
            </Input>
            <Input className='w100'
                   name={"indexTwo"} placeholder={"Second index"}
                   id={`${this.state.indexTwo}` + "_index"}
                   value={this.state.indexTwo}
                   onChange={updateIndexVarOnChange}
                   style={{width: "100%"}}>
            </Input>
        </Form>);
    }

    updateIndexOnChange(indexNumber ,value){
        if(indexNumber === "indexOne"){
            this.setState({indexOne: value});
        }
        else{
            this.setState({indexTwo: value});
        }
    }
}

