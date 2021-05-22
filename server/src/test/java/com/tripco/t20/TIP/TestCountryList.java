package com.tripco.t20.TIP;

import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.assertEquals;

public class TestCountryList {
    private List<String> countryList;

    @Before
    public void buildList(){
        countryList = CountryList.buildCountries();
    }

    @Test
    public void testCountryListEntry(){

        String isTravis = System.getenv("TRAVIS");
        String country;
        if(isTravis != null && isTravis.equals("true")){
            country = "Canada";
        }
        else{
            country = "Afghanistan";
        }
        assertEquals("The first country is correct", country, countryList.get(0));
    }

    @Test
    public void testCountryListSize(){
        int expectedSize;
        String isTravis = System.getenv("TRAVIS");
        if(isTravis != null && isTravis.equals("true")){
            expectedSize = 2;
        }
        else{
            expectedSize = 247;
        }
        assertEquals("The list of countries is the correct size", expectedSize, countryList.size());
    }

}
