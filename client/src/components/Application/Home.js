import React, {Component} from 'react';
import {Container, Row, Col} from 'reactstrap';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { Map, Marker, Popup, TileLayer} from 'react-leaflet';
import Pane from './Pane'

/*
 * Renders the home page.
 */

/*Client checks for geolocation before the page is rendered
  Updates latitude and longitude coordinates for map rendering
 */
export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: 0,
      longitude: 0,
      geoError: "none"
    };

    this.checkGeoStatus = this.checkGeoStatus.bind(this);
    this.getPosition = this.getPosition.bind(this);
    this.csuDefaultPosition = this.csuDefaultPosition.bind(this);
    this.setGeoError = this.setGeoError.bind(this);
    this.setDeniedState = this.setDeniedState.bind(this);
    this.setSupportState = this.setSupportState.bind(this);
    this.latitudeValidity = this.latitudeValidity.bind(this);
    this.longitudeValidity = this.longitudeValidity.bind(this);
  }

  setGeoError(word){
    this.setState({geoError: word});
  }

  setDeniedState(){
    this.csuDefaultPosition();
    this.setGeoError("geolocation denied");
  }

  setSupportState(){
    this.csuDefaultPosition();
    this.setGeoError("geolocation not supported");
  }

  checkGeoStatus() {
    const self = this;
    if(!navigator.geolocation){
      self.setSupportState();
    }
    else {
      navigator.permissions.query({name: 'geolocation'}).then(function (result) {
        if (result.state === 'granted') { //user has given permissions for geolocation on the page before
          navigator.geolocation.getCurrentPosition(self.getPosition);
        } else if (result.state === 'prompt') { //user has been prompted to accept permissions
          navigator.geolocation.getCurrentPosition(self.getPosition);
          self.csuDefaultPosition();
        } else if (result.state === 'denied') {//user denies permissions for geolocation
          self.setDeniedState();
        }
      });
    }
  }

  getPosition(position) {
    if(this.latitudeValidity(position) && this.longitudeValidity(position)){
      this.setState({latitude: position.coords.latitude });
      this.setState({longitude: position.coords.longitude });
    }
    else{
      this.csuDefaultPosition();
    }
  }

  latitudeValidity(position){
    let tempLat = position.coords.latitude;
    if (tempLat < -90 || tempLat > 90){
      this.setState({geoError: "invalid latitude" });
      return false;
    }
    else{
      return true;
    }
  }

  longitudeValidity(position){
    let tempLon = position.coords.longitude;
    if (tempLon < -180 || tempLon > 180){
      this.setState({geoError: "invalid longitude" });
      return false;
    }
    else{
      return true;
    }
  }

  csuDefaultPosition(){
    this.setState({latitude: 40.576179 });
    this.setState({longitude: -105.080773 });
  }

  componentDidMount() {
    this.checkGeoStatus();
  }

  componentWillUnmount() {
    this.checkGeoStatus();
  }

  render() {
    return (
      <Container xs={12} sm={12} md={7} lg={8} xl={9}>
        <Row>
          <Col>
            {this.renderMap()}
          </Col>
        </Row>
        <Row>
          <Col>
            {this.renderIntro()}
          </Col>
        </Row>
      </Container>
    );
  }

  renderMap() {
    return (
      <Pane header={'Where Am I?'}
            bodyJSX={this.renderLeafletMap()}/>
    );
  }

  renderLeafletMap() {
    let locName;
    if(this.state.latitude === 40.576179 && this.state.longitude === -105.080773){
      locName = "CSU Oval";
    }
    else{
      locName = "Your Location";
    }
    return (
      <Map center={L.latLng(this.state.latitude,this.state.longitude)} zoom={10}
           style={{height: 500, maxwidth: 700}}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                   attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        <Marker position={L.latLng(this.state.latitude,this.state.longitude)}
                icon={this.markerIcon()}>
          <Popup className="font-weight-extrabold">{locName}</Popup>
        </Marker>
      </Map>
    )
  }

  checkHeader() {
      let checkHead = this.state.geoError;
      if (checkHead === 'none') {
          return ("Bon Voyage!")
      } else if (checkHead === "geolocation denied") {
          return ("Map cannot get your location")
      } else {
          return ("An Error Occurred")
      }
  }

  checkMessage() {
      let check = this.state.geoError;
      if (check === "geolocation denied") {
          return ("Permission for geolocation was denied.")
      } else if (check === "geolocation not supported") {
          return ("Your browser does not support geolocation.")
      } else if (check === "invalid latitude") {
          return ("The latitude provided by your browser was incorrect.")
      } else if (check === "invalid longitude") {
          return ("The longitude provided by your browser was incorrect.")
      } else {
          return ("Let us help plan your next trip!")
      }
  }

  renderIntro() {
      let intro = this.checkHeader();
      let message = this.checkMessage();
      return(
          <Pane header={intro}
                bodyJSX={message}/>
      );
  }

  markerIcon() {
    // react-leaflet does not currently handle default marker icons correctly,
    // so we must create our own
    return L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow,
      iconAnchor: [12,40]  // for proper placement
    })
  }
}
