package com.tripco.t20.TIP;

import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertEquals;

public class TestNearestNeighbor {

    private Map<String, Object> shortOptions;
    private List<PlacesList> shortList = new ArrayList<>();

    private long[] distances  = new long[0];

    @Before
    public void createShortTest() {

        shortOptions = new HashMap<>();
        shortOptions.put("title", "Short Trip");
        shortOptions.put("earthRadius", "3958");
        shortOptions.put("optimization", "short");

        shortList.add(new PlacesList("Denver", "0C0C", "39.7", "-105.0", "5690",
                "Denver", "Denver Metro", "US", "North America", "city"));
        shortList.add(new PlacesList("Fort Morgan", "0C0D", "40.2503", "-103.80", "4324",
                "Fort Morgan", "Denver Metro", "US", "North America", "city"));
        shortList.add(new PlacesList("Boulder", "0C0D", "40.0150", "-105.2705", "5328",
                "Boulder", "Denver Metro", "US", "North America", "city"));
        shortList.add(new PlacesList("Fort Collins", "0C22", "40.5853", "-105.0844", "5003",
                "Fort Collins", "Northern Colorado", "US", "North America", "city"));
        shortList.add(new PlacesList("New Orleans", "0C0D", "29.95", "-90.07", "0",
                "New Orleans", "Southern US", "US", "North America", "city"));
        shortList.add(new PlacesList("Eaton", "0C0D", "40.5194", "-104.7025", "4839",
                "Eaton", "Central Colorado", "US", "North America", "city"));
        shortList.add(new PlacesList("Lakewood", "0C0D", "39.7047", "-105.0814", "5518",
                "Lakewood", "Central Colorado", "US", "North America", "city"));


    }

    @Test
    public void testPlacesOrderShort() {
        TIPTrip shortTrip = new TIPTrip(4,shortOptions, shortList, distances);
        shortTrip.buildResponse();
        shortList = shortTrip.getPlaces();

        String name0 = shortList.get(0).name;
        String name1 = shortList.get(1).name;
        String name2 = shortList.get(2).name;
        String name3 = shortList.get(3).name;
        String name4 = shortList.get(4).name;
        String name5 = shortList.get(5).name;
        String name6 = shortList.get(6).name;

        assertEquals("Places Index 0 Name is Denver","Denver", name0);
        assertEquals("Places Index 1 Name is Lakewood","Lakewood", name1);
        assertEquals("Places Index 2 Name is Boulder","Boulder", name2);
        assertEquals("Places Index 3 Name is Fort Collins","Fort Collins", name3);
        assertEquals("Places Index 4 Name is Eaton","Eaton", name4);
        assertEquals("Places Index 5 Name is Fort Morgan","Fort Morgan", name5);
        assertEquals("Places Index 6 Name is New Orleans","New Orleans", name6);
    }

    @Test
    public void testShortDistance() {

        TIPTrip shortTrip = new TIPTrip(4,shortOptions, shortList, distances);
        shortTrip.buildResponse();
        long[] shortDistances = shortTrip.getDistance();
        long expectedDistance = 7;
        long actualDistance = shortDistances.length;

        assertEquals("The distance arrays are equal size", expectedDistance, actualDistance);

        long firstDist = shortDistances[0];
        long secDist = shortDistances[1];
        long thirdDist = shortDistances[2];
        long fourthDist = shortDistances[3];
        long fifthDist = shortDistances[4];
        long sixthDist = shortDistances[5];
        long seventhDist = shortDistances[6];

        assertEquals("First distance is correct", 4, firstDist);
        assertEquals("Second distance is correct", 24, secDist);
        assertEquals("Third distance is correct", 41, thirdDist);
        assertEquals("Fourth distance is correct", 21, fourthDist);
        assertEquals("Fifth distance is correct", 51, fifthDist);
        assertEquals("Sixth distance is correct", 1050, sixthDist);
        assertEquals("Seventh distance is correct", 1079, seventhDist);
    }
}
