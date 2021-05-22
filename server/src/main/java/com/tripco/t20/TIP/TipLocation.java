package com.tripco.t20.TIP;

import java.lang.StringBuilder;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class TipLocation extends TIPHeader{

    private String match;
    private Integer limit;
    private int found;
    List<PlacesList> places;
    private List narrow;

    private final transient Logger log = LoggerFactory.getLogger(TipLocation.class);

    TipLocation(int version, String match, List narrow,
                Integer limit, int found, List<PlacesList> places) {
        this();
        this.requestType = "locations";
        this.requestVersion = version;
        this.match = match;
        this.narrow = narrow;
        this.limit = limit;
        this.found = found;
        this.places = places;
    }

    private TipLocation() {
        this.requestType = "locations";
        this.requestVersion = 5;
    }

    @Override
    public void buildResponse() {

        this.places = new ArrayList<>();

        if(checkBase()){
            DatabaseSetup.getEnvironment();
            String user = DatabaseSetup.user;
            String pass = DatabaseSetup.pass;
            String myUrl = DatabaseSetup.myUrl;

            String finalString = createQuery();
            runQuery(myUrl,user,pass,finalString);
        }
        log.trace("buildResponse -> {}", this);
    }

    //Builds the query that will be sent to the database,
    // based on currently passed values from client
    private String createQuery(){



        Boolean narrowSize = checkNarrow();
        String item = "";
        if(narrowSize && this.narrow.size() == 1){
            item = checkItem();
        }

        String[] countryList = checkCountry(narrowSize, item);
        String and = "";
        if(countryList != null) {
            and += buildAndCountry(countryList);
        }
        String[] typeList = checkType(narrowSize, item);
        if(typeList != null) {
            and += buildAndType(typeList);
        }

        String end =  ";";

        final String select = buildSelect();
        final String from = buildFrom();
        final StringBuilder matchString = buildString();
        final String where = buildWhere(matchString);

        return(select + from + where + and + end);
    }

    //Runs the built query string and fills in the places array
    // if anything is found, iterates count every time it finds something
    private void runQuery(String myUrl, String user, String pass, String finalString){
        int serverLimit = findLimit();
        try {
            Connection conn = DriverManager.getConnection(myUrl, user, pass);
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(finalString);
            while (rs.next()) {
                PlacesList holder = new PlacesList(
                        rs.getString("name"),rs.getString("id"),
                        String.valueOf(rs.getDouble("latitude")),
                        String.valueOf(rs.getDouble("longitude")),
                        String.valueOf(rs.getDouble("altitude")),
                        rs.getString("municipality"),
                        rs.getString("region.name"), //region name
                        rs.getString("country.name"), //country name
                        rs.getString("continent"),
                        rs.getString("type"));
                if(this.places.size() < serverLimit) {
                    this.places.add(holder);
                }
                this.found++;
            }
            conn.close();
        } catch (Exception e) {
            log.error("An exception occurred " + e.getMessage());
        }
    }

    //If the passed limit is null or 0 it
    // then searches up until 100, else searches the passed limit
    private int findLimit(){
        int  serverLimit = 100;
        if(this.limit == null){
            return serverLimit;
        }
        if(this.limit == 0){
            return serverLimit;
        }
        if(this.limit > serverLimit){
            return serverLimit;
        }
        else{
            return this.limit;
        }
    }

    //Takes the match field passed from client,
    // replaces anything that isn't a character or number with an underscore
    private StringBuilder buildString(){
        StringBuilder finalString = new StringBuilder(this.match);

        for(int i = 0; i < finalString.length(); i++){
            finalString.setCharAt(i,this.match.charAt(i));
            if(!Character.isLetter(finalString.charAt(i))){
                if(!Character.isDigit(finalString.charAt(i))){
                    finalString.setCharAt(i,'_');
                }
            }
        }
        return finalString;
    }

    //Checks if the passed match is empty or not,
    // if empty then we do not search for anything in the database
    private Boolean checkBase(){
        return !this.match.equals("");
    }

    private String buildSelect(){
        return("SELECT world.name, world.id, world.latitude, world.longitude, "
                + "world.altitude, world.municipality, region.name,"
                + " country.name, world.continent, world.type");
    }

    private String buildFrom(){
        return(" From world "
                + " INNER JOIN region ON world.iso_region  = region.id"
                + " INNER JOIN country ON world.iso_country = country.id"
                + " INNER JOIN continent ON world.continent = continent.id");
    }

    private String buildWhere(StringBuilder match){
        String actual = "'%" + match + "%'";
        return(" WHERE (country.name LIKE " + actual
                + " OR region.name LIKE " + actual
                + " OR world.name LIKE " + actual
                + " OR world.municipality LIKE " + actual
                + " OR world.type LIKE " + actual + ')');
    }

    private String buildAndCountry(String[] countryList){
        StringBuilder country = buildAnd(countryList);
        return(" AND country.name IN (" + country +")");
    }

    private String buildAndType(String[] typeList){
        StringBuilder type = buildAnd(typeList);
        String typeString = type.toString();
        String[] typeSplit = typeString.split(",");
        String finalType = "";
        finalType += " AND world.type IN (";
        for (int i = 0; i < typeSplit.length; i++) {
            String currentType = checkCurrentType(typeSplit[i].trim());
            if (i == typeSplit.length - 1) {
                finalType += currentType + ")";
            } else {
                finalType += currentType + ',';
            }
        }
        return(finalType);
    }

    private String checkCurrentType(String currentType){
        if(currentType.contains("airport")){
            currentType = "'small_airport','medium_airport','large_airport'";
        }
        return currentType;
    }

    private StringBuilder buildAnd(String[] currentList) {
        StringBuilder currentString = new StringBuilder();
        for (int i = 0; i < currentList.length; i++){
            currentString.append("'").append(currentList[i].trim());
            if (i == currentList.length - 1) {
                currentString.append("'");
            }
            else{
                currentString.append("',");
            }
        }
        return currentString;
    }

    private String[] checkType(Boolean narrowSize, String item) {

        if(narrowSize.equals(false) || this.narrow == null || item.equals("coun")){
            return null;
        }


        String typeString = this.narrow.get(0).toString();

        typeString = typeString.trim();
        typeString = typeString.substring(20, typeString.length() - 2);
        if (typeString.length() == 0) {
            return null;
        }
        String[] splitString = typeString.split(",");
        for (int i = 0; i < splitString.length; i++) {
            splitString[i] = splitString[i].trim();
        }
        return splitString;

    }

    private String checkItem(){

        String item = this.narrow.get(0).toString();

        item = item.trim();
        item = item.substring(6, 10);

        return item;
    }

    private String[] checkCountry(Boolean narrowSize, String item){

        if(narrowSize.equals(false) || this.narrow == null || item.equals("type")){
            return null;
        }
        int size = 1;
        if(item.equals("coun")){
            size = 0;
        }

        String countryString = this.narrow.get(size).toString();
        countryString = countryString.trim();
        countryString = countryString.substring(23, countryString.length() - 2);

        if (countryString.length() == 0) {
            return null;
        }

        return countryString.split(",");
    }

    private Boolean checkNarrow(){
        if(this.narrow == null){
            return false;
        }
        else {return this.narrow.size() != 0;}
    }
}
