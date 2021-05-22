package com.tripco.t20.TIP;

class PlacesList{

    String name;
    String id;
    String latitude;
    String longitude;
    String altitude;
    String municipality;
    String region;
    String country;
    String continent;
    String type;

    PlacesList(
            String name, String id, String latitude, String longitude,
            String altitude, String municipality,
            String region, String country, String continent, String type){

        this.name = name;
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
        this.altitude = altitude;
        this.municipality = municipality;
        this.region = region;
        this.country = country;
        this.continent = continent;
        this.type = type;

    }
}