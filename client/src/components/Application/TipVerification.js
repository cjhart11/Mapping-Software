import React, { Component } from 'react'
import Schema from 'ajv'
import Config from '../../../../JSONSchemas/TIPConfigResponseSchema.json'
import Distance from '../../../../JSONSchemas/TIPDistanceResponseSchema.json'
import Trip from '../../../../JSONSchemas/TIPTripResponseSchema.json'
import Locations from '../../../../JSONSchemas/TIPLocationsResponseSchema.json'

export default class TipVerification extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    verifyRequest(tipConfigRequest) {
        try {
            if (1 <= tipConfigRequest.requestVersion <= 5) {
                switch (tipConfigRequest.requestType) {
                    case "config":
                        return true;
                    case "distance":
                        return this.verifyDistanceRequest(tipConfigRequest);
                    case "trip":
                        return this.verifyTripRequest(tipConfigRequest);
                    case "locations":
                        return this.verifyLocationsRequest(tipConfigRequest);
                    default:
                        return false;
                }
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }

    validateApiResponse(response) {
        const schemas = new Schema();
        let valid = false;
        switch (response.body.requestType) {
            case "config":
                valid = schemas.validate(Config, response.body);
                break;
            case "distance":
                valid = schemas.validate(Distance, response.body);
                break;
            case "trip":
                valid = schemas.validate(Trip, response.body);
                break;
            case "locations":
                valid = schemas.validate(Locations, response.body);
                break;
            default:
                return false;
        }
        if(valid){
            return valid;
        } else {
            console.log(schemas.errors);
            return valid;
        }
    }

    verifyDistanceRequest(tipConfigRequest) {
        try{
            if(tipConfigRequest.origin === null || Object.keys(tipConfigRequest.origin).length === 0){
                return false;
            }
            if(tipConfigRequest.destination === null || Object.keys(tipConfigRequest.destination).length === 0){
                return false;
            }
            return tipConfigRequest.earthRadius !== null;
        } catch (e) {
            return false;
        }
    }

    verifyTripRequest(tipConfigRequest) {
        try{
            if(tipConfigRequest.options === null || Object.keys(tipConfigRequest.options).length === 0){
                return false;
            }
            else {
                if(tipConfigRequest.options.earthRadius == null || tipConfigRequest.options.earthRadius === ""){
                    return false;
                }
            }
            return !(tipConfigRequest.places == null || tipConfigRequest.places === []);
        } catch(e){
            return false;
        }
    }

    verifyLocationsRequest(tipConfigRequest) {
        try {
            return tipConfigRequest.match !== null || tipConfigRequest.match !== "";
        } catch (e) {
            return false;
        }
    }
}