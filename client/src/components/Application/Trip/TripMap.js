import React, {Component} from 'react';
import {Button} from 'reactstrap'
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import blueIcon from '../../../../client images/mapMarkers/marker-icon-blue.png'
import greenIcon from '../../../../client images/mapMarkers/marker-icon-green.png'
import redIcon from '../../../../client images/mapMarkers/marker-icon-red.png'
import yellowIcon from '../../../../client images/mapMarkers/marker-icon-yellow.png'
import orangeIcon from '../../../../client images/mapMarkers/marker-icon-orange.png'
import 'leaflet/dist/leaflet.css';
import {Map, Marker, Polyline, Popup, TileLayer} from 'react-leaflet';
import TripMapOptions from "./TripMapOptions";
import GeoJSON from 'geojson'
import tokml from 'tokml'
import geojsontosvg from 'geojson-to-svg'


export default class TripMap extends Component {
    constructor(props) {
        super(props);
        this.state= {
            geoJsonMap: null,
            kmlFile: null,
            svgFile: null
        };
        this.mapToGeoJson = this.mapToGeoJson.bind(this);
        this.createMapFile = this.createMapFile.bind(this);
        this.findCenter=this.findCenter.bind(this);
    }

    render(){
        return(this.renderMap());
    }

    renderMap() {
        return (<div>
                    {this.renderTripMap()}
                    {this.renderMapOptions()}
                </div>
        );
    }

    renderMapOptions(){
        if (this.props.places.length !== 0){
            this.mapToGeoJson();
            this.createMapFile();

            return (<TripMapOptions settings={this.props.settings}
                                    kml={this.state.kmlFile} svg={this.state.svgFile}
                                    title={this.props.options.title}
                                    updateClientMapOptions={this.props.updateClientMapOptions}
            />);
        }
        else {
            return null;
        }
    }

    renderTripMap() {
        const southWest = L.latLng(-180, -180),
            northEast = L.latLng(180, 180),
            bounds = L.latLngBounds(southWest, northEast);

        let zoomBounds = this.findCenter();
        let center = zoomBounds.getCenter();

        return (
            <Map
                id={"map"} maxBounds={bounds} maxBoundsViscosity={1.0} center={center} minZoom={1.5} zoom={10}
                style={{height: 500, maxwidth: 700, zIndex:1}} bounds={zoomBounds} worldCopyJump={true}>
                <TileLayer noWrap={false} url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                           attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                {this.renderMarkers()}
                {this.renderLine()}
            </Map>
        )
    }

    findCenter() {
        let newGroup;
        let markerGroup = [];
        if(this.props.places.length > 1){
            for (let i = 0; i < this.props.places.length; i++) {
                let currLat = this.props.places[i].latitude;
                let currLon = this.props.places[i].longitude;
                markerGroup.push(L.marker([currLat, currLon]));
            }
        }
        else if(this.props.places.length === 1){

            let currLon = parseFloat(this.props.places[0].longitude);
            let currLat = parseFloat(this.props.places[0].latitude);

            markerGroup.push(L.marker([(currLat+.1).toString(), (currLon-.1).toString()]));
            markerGroup.push(L.marker([(currLat-.1).toString(), (currLon+.1).toString()]));
        }
        else{
            markerGroup.push(L.marker([40.676179, -105.180773]));
            markerGroup.push(L.marker([40.476179, -104.980773]));
        }

        newGroup = L.featureGroup(markerGroup).getBounds().pad(.1);
        return newGroup;
    }

    mapToGeoJson(){
        let markerData = this.geoJsonAddMarkers();
        let lineData = this.getLineData();
        let totalData = markerData.concat(lineData);
        this.state.geoJsonMap = GeoJSON.parse(totalData, {Point: ['lat','lon'], LineString: 'line'});
    }

    geoJsonAddMarkers(){
        let markerArray = [];
        for(let i = 0; i < this.props.places.length; i++){
            let data = {name: this.props.places[i].name,
                        lat:parseFloat(this.props.places[i].latitude),
                        lon:parseFloat(this.props.places[i].longitude)};
            markerArray.push(data);
        }

        return markerArray;
    }

    getLineData(){
        let lineArray = [];
        for(let i = 0; i < this.props.places.length - 1; i++){
            let data = {
                line:[[parseFloat(this.props.places[i].longitude), parseFloat(this.props.places[i].latitude)],
                    [parseFloat(this.props.places[i+1].longitude),parseFloat(this.props.places[i+1].latitude)]]};
            lineArray.push(data);
        }

        let finalData = this.getFinal();
        lineArray.push(finalData);
        return lineArray;
    }

    getFinal(){
        let k = this.props.places.length - 1;
        return({
            line:[[parseFloat(this.props.places[k].longitude),parseFloat(this.props.places[k].latitude)],
            [parseFloat(this.props.places[0].longitude),parseFloat(this.props.places[0].latitude)]]});
    }

    renderMarkers(){
        if(this.props.settings.mapOptions.showMarkers){
            return(
                <div>
                    {this.props.places.map((location, index) =>
                        this.markerSelection(location,index)
                    )}
                </div>
            );
        }
    }

    markerSelection(place, index){
        let currentIcon;
        if(index === this.props.settings.mapOptions.highlightedMarker){
            currentIcon = this.highlightedMarkerIcon();
        }
       else{
           currentIcon = this.markerIcon();
        }
       return(
            <Marker key = {index.toString()}  position={L.latLng(place.latitude,place.longitude)}
                    icon={currentIcon}>
                <Popup className="font-weight-extrabold">
                    <div>{this.props.getName(place)}</div><div>Lat/Lon: {place.latitude}, {place.longitude}</div>
                    <div>Altitude: {place.altitude}</div><div>Municipality: {place.municipality}</div>
                    <div>Region: {place.region}</div><div>country: {place.country}</div>
                    <div>Continent: {place.continent}</div><div>Type: {place.type}</div>
                </Popup>
            </Marker>
        );
    }


    renderLine(){
        if (this.props.settings.mapOptions.showLines){
            if (this.props.places.length > 1) {
                const linePair = this.getPairwiseLocations();
                return (
                    <div>
                        {linePair.map((name, index) =>
                            <Polyline key={index}
                                      positions={
                                          [
                                              this.wrapCoordinates(linePair, index)
                                          ]}
                                      color={this.props.settings.mapOptions.activeLineColor}>
                                <div>
                                    {this.renderLinePopup(index)}
                                </div>
                            </Polyline>
                        )}
                    </div>
                );
            }
        }
    }

    getPairwiseLocations(){
        let LocationIndexes = [];
        for (let i =0; i < this.props.places.length-1; i++){
            LocationIndexes.push([i,i+1]);
        }
        LocationIndexes.push([this.props.places.length-1,0]);
        return LocationIndexes;
    }

    wrapCoordinates(linePair, index){
        let curLat = this.props.places[linePair[index][0]].latitude;
        let nextLat = this.props.places[linePair[index][1]].latitude;
        let curLong = this.props.places[linePair[index][0]].longitude;
        let nextLong = this.props.places[linePair[index][1]].longitude;
        
        if (Math.abs(nextLong - curLong) > 180){
            if(nextLong < curLong){
                return [[[curLat, curLong],
                    [nextLat, L.Util.wrapNum(nextLong, [0, 360], true)]],
                    [[nextLat, nextLong],
                    [curLat, L.Util.wrapNum(curLong, [0, -360], true)]]];
            } else {
                return [[[curLat, curLong],
                    [nextLat, L.Util.wrapNum(nextLong, [0, -360], true)]],
                    [[nextLat, nextLong],
                    [curLat, L.Util.wrapNum(curLong, [0, 360], true)]]];
            }
        } else {
            return [[curLat, curLong],
                [nextLat, nextLong]];
        }
    }

    renderLinePopup(index){
        if(this.props.distances[index] == null) {
            return (
                <Popup key = {index.toString()}
                       className="font-weight-extrabold">Not calculated
                </Popup>
            );
        }
        else{
            return (
                <Popup key = {index.toString()}
                       className="font-weight-extrabold">{this.props.distances[index]}
                </Popup>
            );
        }
    }

    markerIcon() {
        // react-leaflet does not currently handle default marker icons correctly,
        // so we must create our own
        let icon = this.getIconColor();
        return L.icon({
            iconUrl: icon,
            shadowUrl: iconShadow,
            iconAnchor: [12,40]  // for proper placement
        })
    }

    getIconColor(){
        switch(this.props.settings.mapOptions.activeMarkerColor){
            case "blue":
                return blueIcon;
            case "red":
                return redIcon;
            case "green":
                return greenIcon;
            default:
                return yellowIcon;
        }
    }

    highlightedMarkerIcon() {
        // react-leaflet does not currently handle default marker icons correctly,
        // so we must create our own
        return L.icon({
            iconUrl: orangeIcon,
            shadowUrl: iconShadow,
            iconAnchor: [12,40]  // for proper placement
        })
    }

    /*
    Utilizes tokml and geojson-to-svg libraries
    https://www.npmjs.com/package/tokml
    https://www.npmjs.com/package/geojson-to-svg
    */
    createMapFile(){
        let kml = tokml(this.state.geoJsonMap);
        let kmlFileLocation = document.createElement("outputFileLocation");
        let kmlOutputFile = new Blob([kml], {type: "application/vnd.google-earth.kml+xml"});
        kmlFileLocation.href = URL.createObjectURL(kmlOutputFile);
        this.state.kmlFile = kmlFileLocation.href;

        let svg = geojsontosvg().data(this.state.geoJsonMap).render();
        let svgFileLocation = document.createElement("outputFileLocation");
        let svgOutputFile = new Blob([svg], {type: "image/svg+xml"});
        svgFileLocation.href = URL.createObjectURL(svgOutputFile);
        this.state.svgFile = svgFileLocation.href;
    }
}
