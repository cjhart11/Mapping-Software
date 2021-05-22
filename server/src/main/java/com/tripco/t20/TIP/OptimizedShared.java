package com.tripco.t20.TIP;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class OptimizedShared {

    static Map<String, Double> createMap(double lat, double longitude) {
        //create map
        Map<String, Double> map = new HashMap<>();
        map.put("latitude", lat);
        map.put("longitude", longitude);

        return map;
    }

    static List<PlacesList> orderPlaces(double[][] tour, List<PlacesList> currentPlaces) {
        //clear distance array
        //Arrays.fill(this.distances, -123);
        //[x][0] = index of city, [x][1] = distance to next city
        List<PlacesList> orderedList = new ArrayList<>();
        for (double[] doubles : tour) {
            int index = (int) doubles[0];
            //copy places into orderedList
            orderedList.add(currentPlaces.get(index));
        }
        return orderedList;
    }

    static long[] orderDistances(double[][] tour){
        long[] tourDistance = new long[tour.length];
        for (int i = 0; i < tour.length; i++) {
            tourDistance[i] = (long) tour[i][1];
        }
        return tourDistance;
    }

    static double[][] extractCoords(List<PlacesList> currentPlaces) {
        //[x][0] = lat, [x][1] = long, [x][2] visited -1 = false, >-1 = order of short trip
        double[][] coords = new double[currentPlaces.size()][3];

        for (int i = 0; i < currentPlaces.size(); i++) {
            coords[i][0] = extractDouble(currentPlaces.get(i).latitude);
            coords[i][1] = extractDouble(currentPlaces.get(i).longitude);
            coords[i][2] = -1;
        }

        return coords;
    }

    static double extractDouble(String input) {
        return Double.parseDouble(input);
    }

}
