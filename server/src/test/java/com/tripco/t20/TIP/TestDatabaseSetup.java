package com.tripco.t20.TIP;
import org.junit.Before;
import org.junit.Test;

import javax.xml.crypto.Data;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class TestDatabaseSetup {

    private static String isDevelopment;
    private static String isTravis;
    private static String user;
    private static String pass;
    private static String myUrl;

    @Before
    public void setupTest(){
        isTravis = DatabaseSetup.getTravis();
        isDevelopment = DatabaseSetup.getDevelopment();
        DatabaseSetup.getEnvironment();
        user = DatabaseSetup.user;
        pass = DatabaseSetup.pass;
        myUrl = DatabaseSetup.myUrl;
    }

    @Test
    public void testUser(){
        if(isTravis != null && isTravis.equals("true")) {
            assertEquals("Travis user is correct", "root", user);
        }
        else {
            assertEquals("Default user is correct", "cs314-db", user);
        }
    }

    @Test
    public void testPassword(){
        if(isTravis != null && isTravis.equals("true")) {
            assertNull("Travis password is correct", pass);
        }
        else {
            assertEquals("Default password is correct", "eiK5liet1uej", pass);
        }
    }

    @Test
    public void testUrl(){
        if(isTravis != null && isTravis.equals("true")) {
            assertEquals("Travis URL is correct", "jdbc:mysql://127.0.0.1/cs314", myUrl);
        }
        else if (isDevelopment != null && isDevelopment.equals("development")) {
            assertEquals("Development URL is correct", "jdbc:mysql://127.0.0.1:64148/cs314", myUrl);
        }
        else {
            assertEquals("Default password is correct", "jdbc:mysql://faure.cs.colostate.edu/cs314", myUrl);
        }
    }


}
