import React, {Component} from 'react'
import Parser from 'coordinate-parser'

export default class Coordinates extends Component {
    constructor(props) {
        super(props);

        this.state = {
            coordinates: []
        };

    }

    addCoordinates(location, coordinates){
        //Coordinates: [latitude, longitude]
        const coords = coordinates[0] + ' ' + coordinates[1];
        const validatedCoords = this.validateCoordinates(coords);
        const convertedCoords = this.convertValidatedCoordinates(location, validatedCoords);
        this.state.coordinates.push(convertedCoords);
    }

    /*
  * Uses coordinate-parser to validate the provided coordinates
  * Utilizes the Coordinate-Parser library suggested by another team on piazza
  * with the Coordinates object.
  * https://www.npmjs.com/package/coordinate-parser
  */
    validateCoordinates(coordinates) {
        try {
            return new Parser(coordinates);
        } catch (e) {
            alert('Invalid Coordinate Format');
            throw(e);
        }
    }

    /*
   * Uses coordinate-parser to convert the validated coordinates to a friendly
   * format using getLatitude() and getLongitude() and returns the converted
   * tipConfigRequest object
   * https://www.npmjs.com/package/coordinate-parser
   */
    convertValidatedCoordinates(location, coordinates) {
        try{
            return {name: location, latitude: coordinates.getLatitude(), longitude: coordinates.getLongitude()};
        } catch (e) {
            alert('Could not convert coordinates');
            throw(e);
        }
    }
}