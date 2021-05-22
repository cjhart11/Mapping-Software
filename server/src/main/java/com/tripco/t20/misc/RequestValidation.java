package com.tripco.t20.misc;

import java.io.BufferedReader;
import java.io.InputStreamReader;

import org.everit.json.schema.Schema;
import org.everit.json.schema.ValidationException;
import org.everit.json.schema.loader.SchemaLoader;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * An object for validating requests against master schemas.
 */
public class RequestValidation {
    private final Logger log = LoggerFactory.getLogger(RequestValidation.class);
    private JSONObject request;
    private int version;
    private String type;

    /**
     * Constructor for RequestValidation.
     *
     * @param requestIn a string containing a JSON file.
     */
    public RequestValidation(String requestIn) {
        this.request = new JSONObject(requestIn);
        this.version = request.getInt("requestVersion");
        this.type = request.getString("requestType");
    }

    /**
     * Validates a request against master schema.
     *
     * @return boolean
     */
    public boolean validate() throws ValidationException, Exception {
        String schemaString = this.getSchema(); // call getSchema to get string of master schema
        JSONObject schemaJson = new JSONObject(schemaString); // convert string to json obj
        Schema schema = SchemaLoader.load(schemaJson); //load the master schema into json obj
        schema.validate(this.request); // validate request against master schema

        return true;
    }

    private String getSchema() throws ValidationException, Exception {
        StringBuilder contentBuilder = new StringBuilder();
        BufferedReader location;
            switch (this.type) {
                case "distance":
                    location = new BufferedReader(new InputStreamReader(
                            getClass().getResourceAsStream(
                                    "/data/Schemas/Request/master/DistanceSchem_v1-v5.json")));
                    break;
                case "locations":
                    location = new BufferedReader(new InputStreamReader(
                            getClass().getResourceAsStream(
                                    "/data/Schemas/Request/master/LocationsSchema_v5.json")));
                    break;
                case "trip":
                    location = new BufferedReader(new InputStreamReader(
                            getClass().getResourceAsStream(
                                    "/data/Schemas/Request/master/TripSchema_v2-v5.json")));
                    break;
                default:
                    throw new ValidationException(null, "Invalid requestType", null, null);
            }

            String currentLine;
            while ((currentLine = location.readLine()) != null) {
                contentBuilder.append(currentLine).append("\n");
            }
        String schema = contentBuilder.toString();
        return schema;
    }

    @Override
    public String toString() {
        return "Type: " + this.type + " Version: " + this.version + " Request: " + this.request;
    }


}
