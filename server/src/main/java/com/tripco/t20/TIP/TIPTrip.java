package com.tripco.t20.TIP;

import com.tripco.t20.misc.GreatCircleDistance;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.everit.json.schema.ValidationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TIPTrip extends TIPHeader {

    private Map<String, Object> options;
    private List<PlacesList> places;
    private long[] distances;
    private final transient Logger log = LoggerFactory.getLogger(TIPTrip.class);

    TIPTrip(
            int ver, Map<String, Object> options, List<PlacesList> places, long[] distances) {
        this();
        this.requestType = "trip";
        this.requestVersion = ver;
        this.options = options;
        this.places = places;
        this.distances = distances;
    }

    private TIPTrip() {
        this.requestType = "trip";
        this.requestVersion = 5;
    }

    @Override
    public void buildResponse() {
        if(checkPlacesSize()) {
            String optimization = checkOptimization();
            String firstLocation = this.places.get(0).name;

            switch (optimization) {
                case "none":
                    noOptimization();
                    break;
                case "short":
                case "shorter":
                    optimizeTrip(optimization);
                    break;
                default:
                    throw new ValidationException(null, "Unsupported optimization", null, null);
            }
            checkStart(firstLocation);
        }
        log.trace("buildResponse -> {}", this);
    }

    private void adjustStart(String firstLocation){

        ArrayList <Long> distancesHolder = new ArrayList<>(this.places.size());
        ArrayList <PlacesList> placesHolder = new ArrayList<>(this.places.size());
      
        int adjustIndex = getStartIndex(firstLocation);

        for(int i = adjustIndex; i < this.places.size(); i++){
            placesHolder.add(this.places.get(i));
            distancesHolder.add(this.distances[i]);
        }
        for(int i = 0; i < adjustIndex; i++){
            placesHolder.add(this.places.get(i));
            distancesHolder.add(this.distances[i]);
        }
      
        this.places = placesHolder;
        adjustDistances(distancesHolder);
    }

    private int getStartIndex(String firstLocation){
        int adjustIndex = 0;
        for (int i = 0; i < this.places.size(); i++){
            if(places.get(i).name.equals(firstLocation)){
                adjustIndex = i;
            }
        }
        return adjustIndex;
    }

    private void adjustDistances(ArrayList<Long> distancesHolder){
        for(int i = 0; i < this.distances.length; i++){
            this.distances[i] = distancesHolder.get(i);
        }
    }

    private Boolean checkPlacesSize(){
        return this.places != null && this.places.size() > 1;
    }

    private String checkOptimization(){
        String optimization;

        if (this.options.get("optimization") == null || this.options.get("optimization") == "") {
            optimization = "none";
        }

        else if(this.options.get("optimization").equals("automatic")){
            optimization = auto();
        }
        else
        {
            optimization = (this.options.get("optimization")).toString();
        }
                return optimization;
    }

    private void checkStart(String firstLocation){
        if (!this.places.get(0).name.equals(firstLocation)) {
            adjustStart(firstLocation);
        }
    }

    private void noOptimization() {
        this.distances = new long[this.places.size()];
        double earthRadius = OptimizedShared.extractDouble(options.get("earthRadius").toString());
        //[x][0] = index of city, [x][1] = distance to next city
        double[][] trip = new double[this.places.size()][2];
        for (int i = 0; i < this.places.size() - 1; i++) {
            Map<String, Double> origin = createMap(this.places.get(i));
            Map<String, Double> dest = createMap(this.places.get(i + 1));
            long distance = GreatCircleDistance.calcDistance(origin, dest, earthRadius);
            trip[i][0] = i;
            trip[i][1] = distance;
        }
        long finalDistance = returnHome(this.places.size() - 1, earthRadius);
        trip[trip.length - 1][0] = trip.length - 1;
        trip[trip.length - 1][1] = finalDistance;
        this.places = OptimizedShared.orderPlaces(trip,this.places);
        this.distances = OptimizedShared.orderDistances(trip);
    }

    private String auto(){
        if(places.size() < 61){
            return "shorter";
        }
        else if(places.size() < 90){
            return "short";
        }
        else{
            return "none";
        }

    }

    private void optimizeTrip(String optimization){
        NearestNeighbor shortTrip = new NearestNeighbor(this.options, this.places, this.distances);
        shortTrip.nearestNeighborAlgorithm();

        if(optimization.equals("shorter")){
            TwoOpt twoOptTrip = new TwoOpt(shortTrip.places,shortTrip.distances,this.options);
            twoOptTrip.twoOptAlgorithm();
            setReturnValues(twoOptTrip.places,twoOptTrip.distances);
        }
        else{
            setReturnValues(shortTrip.places,shortTrip.distances);
        }
    }

    private void setReturnValues(List<PlacesList> optimizedPlaces, long[] optimizedDistance){
        this.places = optimizedPlaces;
        this.distances = optimizedDistance;
    }

    static double sumDistances(long[] inputs) {
        // for use in TwoOpt()
        double sum = 0;

        for (long input : inputs) {
            sum += input;
        }

        return sum;
    }

    static double[][] calculateDistance(double[][] coords, double[][] route,
                                        Map<String, Object> currentOptions) {
        double earthRadius =
                OptimizedShared.extractDouble(currentOptions.get("earthRadius").toString());

        for (int i = 0; i < route.length - 1; i++) {
            int index = (int) route[i][0];
            int nextIndex = (int) route[i + 1][0];

            Map<String, Double> origin =
                    OptimizedShared.createMap(coords[index][0], coords[index][1]);
            Map<String, Double> dest =
                    OptimizedShared.createMap(coords[nextIndex][0], coords[nextIndex][1]);
            long dist = GreatCircleDistance.calcDistance(origin, dest, earthRadius);
            route[i][1] = dist;
        }

        Map<String, Double> origin = OptimizedShared.createMap(coords[0][0], coords[0][1]);
        Map<String, Double> dest =
                OptimizedShared.createMap(coords[route.length-1][0],coords[route.length-1][1]);
        long dist = GreatCircleDistance.calcDistance(origin, dest, earthRadius);
        route[route.length - 1][1] = dist;
        return route;
    }

    private long returnHome(int lastIndex, double earthRadius) {
        Map<String, Double> origin = createMap(this.places.get(0));
        Map<String, Double> dest = createMap(this.places.get(lastIndex));
        return GreatCircleDistance.calcDistance(origin, dest, earthRadius);
    }

    private void generateDistances(double[][] trip) {
        this.distances = new long[trip.length];
        for (int i = 0; i < trip.length; i++) {
            generateDistances(i, trip[i][1]);
        }
    }

    private void generateDistances(int index, double distance) {
        this.distances[index] = (long) distance;
    }

    private Map<String, Double> createMap(PlacesList place) {
        //extract lat and long
        double lat = OptimizedShared.extractDouble(place.latitude);
        double longi = OptimizedShared.extractDouble(place.longitude);

        //create map
        Map<String, Double> map = new HashMap<>();
        map.put("latitude", lat);
        map.put("longitude", longi);

        return map;
    }

    public long[] getDistance() {
        return this.distances;
    }

    public List<PlacesList> getPlaces() {
        return this.places;
    }

}