
package com.tripco.t20.TIP;

import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertEquals;

/**
 * Verifies the operation of the TIP trip class and its buildResponse method.
 */
public class TestTIPTrip {

    private Map<String, Object> options;
    private long[] distances;
    private List<PlacesList> placeList = new ArrayList<>();
    private List<PlacesList> emptyList = new ArrayList<>();

    @Before
    public void createTest() {
        options = new HashMap<>();
        options.put("title", "My Trip");
        options.put("earthRadius", "3958");
        options.put("optimization", "none");

        placeList.add(
                new PlacesList("Denver", "0C0C", "39.7", "-105.0", "5690",
                        "Denver", "Denver Metro", "US", "North America", "city"));
        placeList.add(
                new PlacesList("Boulder", "0C0D", "40.0", "-105.4", "5328",
                        "Boulder", "Western Colorado", "US", "North America", "city"));
        placeList.add(
                new PlacesList("Fort Collins", "0C22", "40.6", "-105.1", "5003",
                        "Fort Collins", "Northern Colorado", "US", "North America", "city"));
    }

    @Before
    public void createDistance() {
        distances = new long[0];
    }

    @Test
    public void testDistance() {
        TIPTrip trip = new TIPTrip(5, options, placeList, distances);
        trip.buildResponse();

        distances = trip.getDistance();

        long expectedDistance = 3;
        long actualDistance = distances.length;

        assertEquals("The distance arrays are equal size", expectedDistance, actualDistance);

        long firstDist = distances[0];
        long secDist = distances[1];
        long thirdDist = distances[2];

        assertEquals("First distance is correct", 30, firstDist);
        assertEquals("Second distance is correct", 44, secDist);
        assertEquals("Third distance is correct", 62, thirdDist);

    }

    @Test
    public void testPlacesOrderNoOpt() {
        TIPTrip trip = new TIPTrip(5, options, placeList, distances);
        trip.buildResponse();

        List<PlacesList> places = trip.getPlaces();

        String name0 = places.get(0).name;
        String name1 = places.get(1).name;
        String name2 = places.get(2).name;

        assertEquals("Places Index 0 Name is Denver","Denver", name0);
        assertEquals("Places Index 1 Name is Boulder","Boulder", name1);
        assertEquals("Places Index 2 Name is Fort Collins","Fort Collins", name2);

    }

    @Test
    public void testEmptyPlaces() {
        Map<String, Object> emptyPlacesOptions = new HashMap<>();
        emptyPlacesOptions.put("title", "Empty Trip");
        emptyPlacesOptions.put("earthRadius", "3958");
        emptyPlacesOptions.put("optimization", "none");
        TIPTrip trip = new TIPTrip(4, emptyPlacesOptions, emptyList, distances);
        trip.buildResponse();

        List<PlacesList> places = trip.getPlaces();
        long[] distances = trip.getDistance();

        assertEquals("Places size stays 0",places.size(), 0);
        assertEquals("Distances array is empty",distances.length, 0);
    }
}
