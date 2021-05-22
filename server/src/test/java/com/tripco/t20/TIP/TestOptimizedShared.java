package com.tripco.t20.TIP;

//import org.graalvm.compiler.nodes.calc.IntegerDivRemNode;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertEquals;

public class TestOptimizedShared {

    private List<PlacesList> testPlaces = new ArrayList<>();

    @Before
    public void createPlaces(){

        testPlaces.add(
                new PlacesList("Boulder", "0C0D", "40.0", "-105.4", "5328",
                        "Boulder", "Western Colorado", "US", "North America", "city"));
        testPlaces.add(
                new PlacesList("Fort Collins", "0C22", "40.6", "-105.1", "5003",
                        "Fort Collins", "Northern Colorado", "US", "North America", "city"));
    }


    @Test
    public void testCreateMap() {
        Map<String, Double> testMap = OptimizedShared.createMap(12.2,20.5);

        double actualLat = testMap.get("latitude");
        assertEquals("Created map latitude is correct",actualLat, 12.2,0.001);
        double actualLon = testMap.get("longitude");
        assertEquals("Created map longitude is correct",actualLon, 20.5,0.001);
    }




    @Test
    public void testOrderPlaces() {
        double[][] testTour = new double[3][3];
        testTour[0][0] = 1;
        testTour[0][1] = 15.2;

        List<PlacesList> testOrder = OptimizedShared.orderPlaces(testTour,testPlaces);

        assertEquals("First spot in testOrder is correct",testOrder.get(0).name, "Fort Collins");

    }

    @Test
    public void testOrderDistances() {
        double[][] testDistancesTour = new double[2][2];
        testDistancesTour[0][0] = 1;
        testDistancesTour[0][1] = 15.2;
        testDistancesTour[1][0] = 2;
        testDistancesTour[1][1] = 12.4;

        long[] testDistances = OptimizedShared.orderDistances(testDistancesTour);

        assertEquals("testDistances is the correct size",2, testDistances.length);
        assertEquals("testDistances first index is correct",15, testDistances[0]);
        assertEquals("testDistances second index is correct",12, testDistances[1]);
    }

    @Test
    public void testExtractCoords() {
        double[][] testCoords = OptimizedShared.extractCoords(testPlaces);

        assertEquals("testDistances first latitude is correct",40.0, testCoords[0][0],0.001);
        assertEquals("testDistances second longitude is correct",-105.1, testCoords[1][1],0.001);
        assertEquals("testDistances second index has not been visited correct",-1, testCoords[1][2],0.001);
    }

    @Test
    public void testExtractDouble() {
        double testLat = OptimizedShared.extractDouble("123.2");
        double testLon = OptimizedShared.extractDouble("3.4");
        assertEquals("Test lat is correct",123.2, testLat,0.001);
        assertEquals("Test lon is correct",3.4, testLon,0.001);
    }
}
