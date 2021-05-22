package com.tripco.t20.TIP;

import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertEquals;

public class TestTwoOpt {

    private long[] distances  = new long[0];
    private Map<String, Object> shorterOptions;
    private List<PlacesList> shortList = new ArrayList<>();

    @Before
    public void createShorterTest() {

        shorterOptions = new HashMap<>();
        shorterOptions.put("title", "Short Trip");
        shorterOptions.put("earthRadius", "3958");
        shorterOptions.put("optimization", "shorter");

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
    public void testShorterDistArrayNotEmpty() {

        TIPTrip shorterTrip = new TIPTrip(4, shorterOptions, shortList, distances);
        shorterTrip.buildResponse();
        distances = shorterTrip.getDistance();
        shortList = shorterTrip.getPlaces();
        long sum = 0;
        for(int i = 0; i < shortList.size(); i++){
            sum+= distances[i];
        }

        assertEquals("Shorter Distance array sum is not equal to zero", sum, 2270);

    }
}
