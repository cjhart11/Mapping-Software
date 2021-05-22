package com.tripco.t20.misc;

import com.tripco.t20.misc.GreatCircleDistance;
import org.junit.Test;

import java.util.*;

import static org.junit.Assert.assertEquals;


public class TestGreatCircleDistance {

    @Test
    public void testOriginDestinationSame() {
        HashMap<String, String> CSU = new HashMap<String, String>();
        CSU.put("latitude", "40.576179");
        CSU.put("longitude", "-105.080773");

        HashMap<String, String> CSU2 = new HashMap<String, String>();
        CSU2.put("latitude", "40.576179");
        CSU2.put("longitude", "-105.080773");

        double earthRadius = 3959;
        long expect = 0;
        long actual = GreatCircleDistance.calcDistance(CSU, CSU2, earthRadius);

        assertEquals("origin and destination are the same", expect, actual);
    }

    ////////////Same Quadrant to same quadrant////////////
    @Test
    public void test_NW_NW() {
        HashMap<String, String> CSU = new HashMap<String, String>();
        CSU.put("latitude", "40.576179");
        CSU.put("longitude", "-105.080773");

        HashMap<String, String> karls = new HashMap<String, String>();
        karls.put("latitude", "40.5753");
        karls.put("longitude", "-105.0972");

        double earthRadius = 3959;
        long expect = 1;
        long actual = GreatCircleDistance.calcDistance(CSU, karls, earthRadius);
        long actualREV = GreatCircleDistance.calcDistance(karls, CSU, earthRadius);

        assertEquals("NW to NW: CSU to Krazy Karls", expect, actual);
        assertEquals("NW to NW: Krazy Karls to CSU", expect, actualREV);
    }

    @Test
    public void test_SW_SW() {
        HashMap<String, String> BuenosAires = new HashMap<String, String>();
        BuenosAires.put("latitude", "-34.654227");
        BuenosAires.put("longitude", "-58.5693034");

        HashMap<String, String> Lima = new HashMap<String, String>();
        Lima.put("latitude", "-12.045407");
        Lima.put("longitude", "-77.022807");

        double earthRadius = 3959;
        long expect = 1945;
        long actual = GreatCircleDistance.calcDistance(BuenosAires, Lima, earthRadius);
        long actualREV = GreatCircleDistance.calcDistance(Lima, BuenosAires, earthRadius);

        assertEquals("SW to SW: Buenos Aires to Lima", expect, actual);
        assertEquals("SW to SW: Lima to Buenos Aires", expect, actualREV);
    }

    @Test
    public void test_NE_NE() {
        HashMap<String, String> Munich = new HashMap<String, String>();
        Munich.put("latitude", "48.137021");
        Munich.put("longitude", "11.579943");

        HashMap<String, String> Paris = new HashMap<String, String>();
        Paris.put("latitude", "48.858442");
        Paris.put("longitude", "2.294432");

        double earthRadius = 3959;
        long expect = 428;
        long actual = GreatCircleDistance.calcDistance(Munich, Paris, earthRadius);
        long actualREV = GreatCircleDistance.calcDistance(Paris, Munich, earthRadius);

        assertEquals("NE to NE: Munich to Paris", expect, actual);
        assertEquals("NE to NE: Paris to Munich", expect, actualREV);
    }

    @Test
    public void test_SE_SE() {
        HashMap<String, String> Sydney = new HashMap<String, String>();
        Sydney.put("latitude", "-33.856646");
        Sydney.put("longitude", "151.215404");

        HashMap<String, String> Auckland = new HashMap<String, String>();
        Auckland.put("latitude", "-36.844260");
        Auckland.put("longitude", "174.770019");

        double earthRadius = 3959;
        long expect = 1340;
        long actual = GreatCircleDistance.calcDistance(Sydney, Auckland, earthRadius);
        long actualREV = GreatCircleDistance.calcDistance(Auckland, Sydney, earthRadius);

        assertEquals("NE to NE: Sydney to Auckland", expect, actual);
        assertEquals("NE to NE: Auckland to Sydney", expect, actualREV);
    }

    ////////////////////////////////////////////////////////

    @Test
    public void test_NE_NW() {
        HashMap<String, String> Shinjuku = new HashMap<String, String>();
        Shinjuku.put("latitude", "35.701182");
        Shinjuku.put("longitude", "139.709557");

        HashMap<String, String> CSU = new HashMap<String, String>();
        CSU.put("latitude", "40.576179");
        CSU.put("longitude", "-105.080773");


        double earthRadius = 3959;
        long expect = 5755;
        long actual = GreatCircleDistance.calcDistance(Shinjuku, CSU, earthRadius);
        long actualREV = GreatCircleDistance.calcDistance(CSU, Shinjuku, earthRadius);

        assertEquals("NE to NW: Shinjuku to CSU", expect, actual);
        assertEquals("NW to NE: CSU to Shinjuku", expect, actualREV);
    }

    @Test
    public void test_NE_SW() {
        HashMap<String, String> Munich = new HashMap<String, String>();
        Munich.put("latitude", "48.137021");
        Munich.put("longitude", "11.579943");

        HashMap<String, String> BuenosAires = new HashMap<String, String>();
        BuenosAires.put("latitude", "-34.654227");
        BuenosAires.put("longitude", "-58.5693034");

        double earthRadius = 3959;
        long expect = 7166;
        long actual = GreatCircleDistance.calcDistance(Munich, BuenosAires, earthRadius);
        long actualREV = GreatCircleDistance.calcDistance(BuenosAires, Munich, earthRadius);

        assertEquals("NE to SW: Munich to Buenos Aires", expect, actual);
        assertEquals("SW to NE: Buenos Aires to Munich", expect, actualREV);
    }

    @Test
    public void test_NE_SE() {
        HashMap<String, String> Paris = new HashMap<String, String>();
        Paris.put("latitude", "48.858442");
        Paris.put("longitude", "2.294432");

        HashMap<String, String> Sydney = new HashMap<String, String>();
        Sydney.put("latitude", "-33.856646");
        Sydney.put("longitude", "151.215404");

        double earthRadius = 3959;
        long expect = 10542;
        long actual = GreatCircleDistance.calcDistance(Paris, Sydney, earthRadius);
        long actualREV = GreatCircleDistance.calcDistance(Sydney, Paris, earthRadius);

        assertEquals("NE to SW: Paris to Sydney", expect, actual);
        assertEquals("SW to NE: Sydney to Paris", expect, actualREV);
    }

    @Test
    public void test_NW_SW() {
        HashMap<String, String> karls = new HashMap<String, String>();
        karls.put("latitude", "40.5753");
        karls.put("longitude", "-105.0972");

        HashMap<String, String> Lima = new HashMap<String, String>();
        Lima.put("latitude", "-12.045407");
        Lima.put("longitude", "-77.022807");

        double earthRadius = 3959;
        long expect = 4055;
        long actual = GreatCircleDistance.calcDistance(karls, Lima, earthRadius);
        long actualREV = GreatCircleDistance.calcDistance(Lima, karls, earthRadius);

        assertEquals("NW to SW: Karls to Lima", expect, actual);
        assertEquals("SW to NW: Lima to Karls", expect, actualREV);

    }

    @Test
    public void test_NW_SE() {
        HashMap<String, String> CSU = new HashMap<String, String>();
        CSU.put("latitude", "40.576179");
        CSU.put("longitude", "-105.080773");

        HashMap<String, String> Auckland = new HashMap<String, String>();
        Auckland.put("latitude", "-36.844260");
        Auckland.put("longitude", "174.770019");

        double earthRadius = 3959;
        long expect = 7367;
        long actual = GreatCircleDistance.calcDistance(CSU, Auckland, earthRadius);
        long actualREV = GreatCircleDistance.calcDistance(Auckland, CSU, earthRadius);

        assertEquals("NW to SE: CSU to Auckland", expect, actual);
        assertEquals("SE to NW: Auckland to CSU", expect, actualREV);

    }

    @Test
    public void test_SW_SE() {

        HashMap<String, String> BuenosAires = new HashMap<String, String>();
        BuenosAires.put("latitude", "-34.654227");
        BuenosAires.put("longitude", "-58.5693034");

        HashMap<String, String> Auckland = new HashMap<String, String>();
        Auckland.put("latitude", "-36.844260");
        Auckland.put("longitude", "174.770019");

        double earthRadius = 3959;
        long expect = 6425;
        long actual = GreatCircleDistance.calcDistance(BuenosAires, Auckland, earthRadius);
        long actualREV = GreatCircleDistance.calcDistance(Auckland, BuenosAires, earthRadius);

        assertEquals("SW to SE: Buenos Aires to Auckland", expect, actual);
        assertEquals("SE to SW: Auckland to Buenos Aires", expect, actualREV);
    }
}
