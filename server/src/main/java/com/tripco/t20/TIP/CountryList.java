package com.tripco.t20.TIP;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CountryList extends TIPConfig {

    private static final transient Logger log = LoggerFactory.getLogger(TipLocation.class);


    public CountryList() { }

    public ArrayList buildContinents(){
        return searchString("continent");
    }

    static List<String> buildCountries(){
        return searchString("country");
    }

    private static ArrayList<String> searchString(String item){
        String search = "";
        if(item.equals("continent")){
            search = "select name from continent";
        }
        else if(item.equals("country")){
            search = "select name from country order by name";
        }
        return searchDatabase(search);
    }

    private static ArrayList<String> searchDatabase(String search){

        DatabaseSetup.getEnvironment();
        String user = DatabaseSetup.user;
        String pass = DatabaseSetup.pass;
        String myUrl = DatabaseSetup.myUrl;

        ArrayList<String> returnList = new ArrayList<>();
        try {
            Connection conn = DriverManager.getConnection(myUrl, user, pass);
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(search);
            while (rs.next()) {
                String holder = rs.getString("name");
                returnList.add(holder);
            }
            conn.close();
        } catch (Exception e) {
            log.error("An exception occurred " + e.getMessage());
        }
        return returnList;
    }

}