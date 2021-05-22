package com.tripco.t20.misc;

import org.apache.commons.io.FileUtils;
import org.everit.json.schema.ValidationException;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Test;

import java.io.File;

import static org.junit.Assert.*;

public class TestRequestValidation {
    /** Always Fail **/
    @Test(expected = ValidationException.class)
    public void InvalidRequest() throws Exception{
        //Load test request
        File requestJson = new File("../data/Schemas/Request/tests/invalidRequest");
        //Put request into string
        String request = FileUtils.readFileToString(requestJson, "UTF-8");
        RequestValidation req = new RequestValidation(request);
        req.validate();
    }


    /** Distance tests, passing **/
    @Test
    public void DistanceTestV1() throws Exception{
        //Load test request
        File requestJson = new File("../data/Schemas/Request/tests/distance/pass/v1_Good");
        //Put request into string
        String request = FileUtils.readFileToString(requestJson, "UTF-8");
        RequestValidation req = new RequestValidation(request);
        assertTrue(req.validate());
    }

    @Test
    public void DistanceTestV2() throws Exception{
        //Load test request
        File requestJson = new File("../data/Schemas/Request/tests/distance/pass/v2_Good");
        //Put request into string
        String request = FileUtils.readFileToString(requestJson, "UTF-8");
        RequestValidation req = new RequestValidation(request);
        assertTrue(req.validate());
    }

    @Test
    public void DistanceTestV3() throws Exception{
        //Load test request
        File requestJson = new File("../data/Schemas/Request/tests/distance/pass/v3_Good");
        //Put request into string
        String request = FileUtils.readFileToString(requestJson, "UTF-8");
        RequestValidation req = new RequestValidation(request);
        assertTrue(req.validate());
    }

    /**Distance Tests Failing**/
    @Test(expected = ValidationException.class)
    public void DistanceTestMissingDesV1() throws Exception{
        //Load test request
        File requestJson = new File("../data/Schemas/Request/tests/distance/fail/v1_missing_destination");
        //Put request into string
        String request = FileUtils.readFileToString(requestJson, "UTF-8");
        RequestValidation req = new RequestValidation(request);
        req.validate();

    }

    @Test
    public void DistanceTestMissingDistanceV1() throws Exception{
        //Load test request
        File requestJson = new File("../data/Schemas/Request/tests/distance/fail/v1_missing_distance");
        //Put request into string
        String request = FileUtils.readFileToString(requestJson, "UTF-8");
        RequestValidation req = new RequestValidation(request);
        assertTrue(req.validate());
    }

    @Test(expected = ValidationException.class)
    public void DistanceTestMissingRadiusV1() throws Exception{
        //Load test request
        File requestJson = new File("../data/Schemas/Request/tests/distance/fail/v1_missing_earthRadius");
        //Put request into string
        String request = FileUtils.readFileToString(requestJson, "UTF-8");
        RequestValidation req = new RequestValidation(request);
        req.validate();
    }

    @Test(expected = ValidationException.class)
    public void DistanceTestMissingOriginV1() throws Exception {
        //Load test request
        File requestJson = new File("../data/Schemas/Request/tests/distance/fail/v1_missing_origin");
        //Put request into string
        String request = FileUtils.readFileToString(requestJson, "UTF-8");
        RequestValidation req = new RequestValidation(request);
        req.validate();
    }

    @Test(expected = JSONException.class)
    public void DistanceTestMissingTypeV1() throws Exception{
        //Load test request
        File requestJson = new File("../data/Schemas/Request/tests/distance/fail/v1_missing_type");
        //Put request into string
        String request = FileUtils.readFileToString(requestJson, "UTF-8");
        RequestValidation req = new RequestValidation(request);
        req.validate();
    }

    @Test(expected = JSONException.class)
    public void DistanceTestMissingVersion() throws Exception{
        //Load test request
        File requestJson = new File("../data/Schemas/Request/tests/distance/fail/v1_missing_version");
        //Put request into string
        String request = FileUtils.readFileToString(requestJson, "UTF-8");
        RequestValidation req = new RequestValidation(request);
        req.validate();
    }

    @Test(expected = JSONException.class)
    public void DistanceTestIncorrectVersionTypeString() throws Exception{
        //Load test request
        File requestJson = new File("../data/Schemas/Request/tests/distance/fail/v1_requestVer_string");
        //Put request into string
        String request = FileUtils.readFileToString(requestJson, "UTF-8");
        RequestValidation req = new RequestValidation(request);
        req.validate();
    }


    /** Location tests, passing **/
    @Test
    public void LocationGoodV3() throws Exception{
        //Load test request
        File requestJson = new File("../data/Schemas/Request/tests/location/pass/v3_good");
        //Put request into string
        String request = FileUtils.readFileToString(requestJson, "UTF-8");
        RequestValidation req = new RequestValidation(request);
        assertTrue(req.validate());
    }

    /**Location Tests Failing**/
    @Test
    public void LocationTestMissingFoundV3() throws Exception{
        //Load test request
        File requestJson = new File("../data/Schemas/Request/tests/location/fail/v3_missing_found");
        //Put request into string
        String request = FileUtils.readFileToString(requestJson, "UTF-8");
        RequestValidation req = new RequestValidation(request);
        req.validate();
    }

    @Test
    public void LocationTestMissingLimitV3() throws Exception{
        //Load test request
        File requestJson = new File("../data/Schemas/Request/tests/location/fail/v3_missing_limit");
        //Put request into string
        String request = FileUtils.readFileToString(requestJson, "UTF-8");
        RequestValidation req = new RequestValidation(request);
        assertTrue(req.validate());
    }

    @Test(expected = ValidationException.class)
    public void LocationTestMissingMatchV3() throws Exception{
        //Load test request
        File requestJson = new File("../data/Schemas/Request/tests/location/fail/v3_missing_match");
        //Put request into string
        String request = FileUtils.readFileToString(requestJson, "UTF-8");
        RequestValidation req = new RequestValidation(request);
        req.validate();
    }

    @Test
    public void LocationTestMissingPlacesV3() throws Exception {
        //Load test request
        File requestJson = new File("../data/Schemas/Request/tests/location/fail/v3_missing_places");
        //Put request into string
        String request = FileUtils.readFileToString(requestJson, "UTF-8");
        RequestValidation req = new RequestValidation(request);
        req.validate();
    }

    @Test(expected = JSONException.class)
    public void LocationTestMissingTypeV3() throws Exception{
        //Load test request
        File requestJson = new File("../data/Schemas/Request/tests/location/fail/v3_missing_type");
        //Put request into string
        String request = FileUtils.readFileToString(requestJson, "UTF-8");
        RequestValidation req = new RequestValidation(request);
        req.validate();
    }

    @Test(expected = JSONException.class)
    public void LocationTestMissingVersion() throws Exception{
        //Load test request
        File requestJson = new File("../data/Schemas/Request/tests/location/fail/v3_missing_version");
        //Put request into string
        String request = FileUtils.readFileToString(requestJson, "UTF-8");
        RequestValidation req = new RequestValidation(request);
        req.validate();
    }

    /** Trip tests, passing **/
    @Test
    public void TripGoodV2() throws Exception{
        //Load test request
        File requestJson = new File("../data/Schemas/Request/tests/trip/pass/v2_good");
        //Put request into string
        String request = FileUtils.readFileToString(requestJson, "UTF-8");
        RequestValidation req = new RequestValidation(request);
        assertTrue(req.validate());
    }

    @Test
    public void TripGoodV3() throws Exception {
        //Load test request
        File requestJson = new File("../data/Schemas/Request/tests/trip/pass/v3_good");
        //Put request into string
        String request = FileUtils.readFileToString(requestJson, "UTF-8");
        RequestValidation req = new RequestValidation(request);
        assertTrue(req.validate());
    }

    @Test(expected = JSONException.class)
    public void TripMissingVer() throws Exception{
        //Load test request
        File requestJson = new File("../data/Schemas/Request/tests/trip/fail/v2_missing_version");
        //Put request into string
        String request = FileUtils.readFileToString(requestJson, "UTF-8");
        RequestValidation req = new RequestValidation(request);
    }

    /**Trip Tests Failing**/
    @Test(expected = ValidationException.class)
    public void TripTestMissingEarthRadius() throws Exception{
        //Load test request
        File requestJson = new File("../data/Schemas/Request/tests/trip/fail/v2_missing_earthRadius");
        //Put request into string
        String request = FileUtils.readFileToString(requestJson, "UTF-8");
        RequestValidation req = new RequestValidation(request);
        req.validate();
    }

    @Test(expected = ValidationException.class)
    public void TripTestMissingOptions() throws Exception{
        //Load test request
        File requestJson = new File("../data/Schemas/Request/tests/trip/fail/v2_missing_options");
        //Put request into string
        String request = FileUtils.readFileToString(requestJson, "UTF-8");
        RequestValidation req = new RequestValidation(request);
        req.validate();
    }

    @Test(expected = ValidationException.class)
    public void TripTestMissingPlaces() throws Exception{
        //Load test request
        File requestJson = new File("../data/Schemas/Request/tests/trip/fail/v2_missing_options");
        //Put request into string
        String request = FileUtils.readFileToString(requestJson, "UTF-8");
        RequestValidation req = new RequestValidation(request);
        assertTrue(req.validate());
    }

    @Test(expected = ValidationException.class)
    public void TripTestMissingType() throws Exception{
        //Load test request
        File requestJson = new File("../data/Schemas/Request/tests/trip/fail/v2_missing_options");
        //Put request into string
        String request = FileUtils.readFileToString(requestJson, "UTF-8");
        RequestValidation req = new RequestValidation(request);
        assertTrue(req.validate());
    }
}
