package com.tripco.t20.TIP;

import org.junit.Before;
import org.junit.Test;

import java.util.*;

import static org.junit.Assert.assertEquals;


/** Verifies the operation of the TIP location class and its buildResponse method.
 */
public class TestTipLocation {

    private List<PlacesList> locationList = new ArrayList<>();
    private TipLocation loc;
    private ArrayList<String> narrow = new ArrayList<>();
    private ArrayList<String> emptyNarrow = new ArrayList<>();
    private ArrayList<String> emptyNarrowArray = new ArrayList<>();
    private ArrayList<String> typeNarrow = new ArrayList<>();
    private ArrayList<String> countryNarrow = new ArrayList<>();
    private Map<String, Object> options;

    @Before
    public void createLocation() {
        narrow.add("{name:type, values:[airport,         heliport]}");
        narrow.add("{name:country, values:[Canada]}");
    }

    @Before
    public void createEmptyValues() {
        emptyNarrowArray.add("{name:type, values:[]}");
        emptyNarrowArray.add("{name:country, values:[]}");
        typeNarrow.add("{name:type, values:[airport, heliport]}");
        countryNarrow.add("{name:country, values:[Canada]}");
    }

    @Test
    public void testListSize() {
        loc = new TipLocation(5,"Chapeskie Field",narrow,5,0,locationList);
        loc.buildResponse();
        assertEquals("The size of the list should be 1",1, loc.places.size());
    }

    @Test
    public void testEmptyMatch() {
        TipLocation emptMatch = new TipLocation(5,"",narrow,5,0,locationList);
        emptMatch.buildResponse();
        assertEquals("Placeslist is empty",0, emptMatch.places.size());
    }

    @Test
    public void testEmptyNarrow() {
        TipLocation emptMatch = new TipLocation(5,"Pioneer Airpark",emptyNarrow,5,0,locationList);
        emptMatch.buildResponse();
        assertEquals("Placeslist should have one entry",1, emptMatch.places.size());
    }

    @Test
    public void testEmptyNarrowArray() {
        TipLocation emptMatch = new TipLocation(5,"Pioneer Airpark",emptyNarrowArray,5,0,locationList);
        emptMatch.buildResponse();
        assertEquals("Placeslist should have one entry",1, emptMatch.places.size());
    }

    @Test
    public void testMissingNarrowArray() {
        TipLocation missingMatch = new TipLocation(4,"Pioneer Airpark",null,5,0,locationList);
        missingMatch.buildResponse();
        assertEquals("Placeslist should have one entry",1, missingMatch.places.size());
    }

    @Test
    public void testMissingPlaces() {
        TipLocation missingMatch = new TipLocation(4,"Pioneer Airpark",emptyNarrow,5,0,null);
        missingMatch.buildResponse();
        assertEquals("Placeslist should have one entry",1, missingMatch.places.size());
    }

    @Test
    public void testMissingCountryFilter() {
        TipLocation missingMatch = new TipLocation(4,"Pioneer Airpark",typeNarrow,5,0,null);
        missingMatch.buildResponse();
        assertEquals("Placeslist should have one entry",1, missingMatch.places.size());
    }

    @Test
    public void testMissingTypeFilter() {
        TipLocation missingMatch = new TipLocation(4,"Pioneer Airpark",countryNarrow,5,0,null);
        missingMatch.buildResponse();
        assertEquals("Placeslist should have one entry",1, missingMatch.places.size());
    }

    @Test
    public void testListContent() {
        loc = new TipLocation(5,"Chapeskie Field",narrow,5,0,locationList);
        loc.buildResponse();
        assertEquals("The First id matches in list", "CLC2", loc.places.get(0).id);

        assertEquals("The First name matches in list", "London / Chapeskie Field", loc.places.get(0).name);

        assertEquals("The First municipality matches in list", "London", loc.places.get(0).municipality);

        assertEquals("The First altitude matches in list", "930.0", loc.places.get(0).altitude);

        assertEquals("The First type matches in list", "small_airport", loc.places.get(0).type);

        assertEquals("The First latitude matches in list", "43.0682983398", loc.places.get(0).latitude);

        assertEquals("The First longitude matches in list", "-81.1256027222", loc.places.get(0).longitude);

        assertEquals("The First region matches in list", "Ontario", loc.places.get(0).region);

        assertEquals("The First country matches in list", "Canada", loc.places.get(0).country);

        assertEquals("The First continent matches in list", "NA", loc.places.get(0).continent);

    }


}