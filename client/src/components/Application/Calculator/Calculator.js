import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { Button } from 'reactstrap'
import { Form, Label, Input } from 'reactstrap'
import { sendServerRequestWithBody } from '../../../api/restfulAPI'
import Pane from '../Pane';
import Coordinates from "../Coordinates";
import TipVerification from "../TipVerification";

export default class Calculator extends Component {
  constructor(props) {
    super(props);

    this.updateLocationOnChange = this.updateLocationOnChange.bind(this);
    this.calculateDistance = this.calculateDistance.bind(this);
    this.createInputField = this.createInputField.bind(this);

    this.state = {
      origin: {latitude: '', longitude: ''},
      destination: {latitude: '', longitude: ''},
      distance: 0,
      errorMessage: null
    };
  }

  render() {
    return (
      <Container>
        { this.state.errorMessage }
        <Row>
          <Col>
            {this.createHeader()}
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={6} md={4} lg={3}>
            {this.createForm('origin')}
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            {this.createForm('destination')}
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            {this.createDistance()}
          </Col>
        </Row>
      </Container>
    );
  }

  createHeader() {
    return (
        <Pane header={'Calculator'}
              bodyJSX={<div>Determine the distance between the origin and destination.
                Change the units on the <b>Options</b> page.</div>}/>
    );
  }

  createInputField(stateVar, coordinate) {
    let updateStateVarOnChange = (event) => {
      this.updateLocationOnChange(stateVar, event.target.name, event.target.value)};

    let capitalizedCoordinate = coordinate.charAt(0).toUpperCase() + coordinate.slice(1);
    return (
      <Input name={coordinate} placeholder={capitalizedCoordinate}
             id={`${stateVar}${capitalizedCoordinate}`}
             value={this.state[stateVar][coordinate]}
             onChange={updateStateVarOnChange}
             style={{width: "100%"}} />
    );

  }

  createForm(stateVar) {
    return (
      <Pane header={stateVar.charAt(0).toUpperCase() + stateVar.slice(1)}
            bodyJSX={
              <Form >
                {this.createInputField(stateVar, 'latitude')}
                {this.createInputField(stateVar, 'longitude')}
              </Form>
            }
      />);
  }

  createDistance() {
    return(
      <Pane header={'Distance'}
            bodyJSX={
              <div>
              <h5>{this.state.distance} {this.props.options.activeUnit}</h5>
              <Button onClick={this.calculateDistance}>Calculate</Button>
            </div>}
      />
    );
  }

  calculateDistance() {
    const tipConfigRequest = {
      'requestType'        : 'distance',
      'requestVersion'     : 5,
      'origin'      : this.state.origin,
      'destination' : this.state.destination,
      'earthRadius' : this.props.options.units[this.props.options.activeUnit]
    };

    /*Coordinate validation and conversion*/
    const convertedTipConfigRequest = this.validateAndConvertCoordinates(tipConfigRequest);
    const validator = new TipVerification();
    if(validator.verifyRequest(convertedTipConfigRequest)){
      sendServerRequestWithBody('distance', convertedTipConfigRequest, this.props.settings.serverPort)
          .then((response) => {
            if(validator.validateApiResponse(response)) {
              if (response.statusCode >= 200 && response.statusCode <= 299) {
                this.setState({
                  distance: response.body.distance,
                  errorMessage: null
                });
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
              alert("Invalid Distance API Response")
            }
          });
    }
    else {
      alert("Invalid Tip Request");
    }
  }

  updateLocationOnChange(stateVar, field, value) {
    let location = Object.assign({}, this.state[stateVar]);
    location[field] = value;
    this.setState({[stateVar]: location});
  }

  validateAndConvertCoordinates(tipConfigRequest) {
    const coords = new Coordinates();
    coords.addCoordinates('', [tipConfigRequest.origin.latitude, tipConfigRequest.origin.longitude]);
    coords.addCoordinates('', [tipConfigRequest.destination.latitude, tipConfigRequest.destination.longitude]);
    return {
      'requestType': 'distance',
      'requestVersion': 5,
      'origin': {
        "latitude": (coords.state.coordinates[0].latitude).toString(),
        "longitude": (coords.state.coordinates[0].longitude).toString()
      },
      'destination': {
        "latitude": (coords.state.coordinates[1].latitude).toString(),
        "longitude": (coords.state.coordinates[1].longitude).toString()
      },
      'earthRadius': this.props.options.units[this.props.options.activeUnit]
    };
  }

}
