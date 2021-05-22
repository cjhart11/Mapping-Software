package com.tripco.t20.TIP;

import java.util.List;
import java.util.Map;

class TwoOpt {

    List<PlacesList> places;
    private Map<String, Object> options;
    long[] distances;

    TwoOpt(List<PlacesList> places, long[] distances, Map<String, Object> options){
        this.places = places;
        this.distances = distances;
        this.options = options;
    }

    void twoOptAlgorithm() {
        int size = this.places.size();
        //[x][0] = lat, [x][1] = long, [x][2] visited -1 = false
        double[][] coords = OptimizedShared.extractCoords(this.places);
        //[x][0] = lat, [x][1] = long, [x][2] visited -1 = false
        double[][] bestRoute = new double[size][2];
        double bestDistance = TIPTrip.sumDistances(this.distances);
        for (int ii = 0; ii < size - 1; ii++) {
            //for each city in route
            for (int kk = 0; kk < size; kk++) {
                //for every city that the previous can connect to
                //[x][2] contains index
                double[][] newRoute = twoOptSwap(coords, ii, kk);
                double[][] routeDistance =
                        TIPTrip.calculateDistance(coords, newRoute, this.options);
                long[] calc = new long[coords.length];
                for (int aa = 0; aa < coords.length; aa++) {
                    long dist = (long) routeDistance[aa][1];
                    calc[aa] = dist;
                }
                double sum = TIPTrip.sumDistances(calc);
                if (sum < bestDistance) {
                    bestRoute = routeDistance;
                    bestDistance = sum;
                }
            }
        }
        //if no better route was found, don't do anything
        if(bestRoute[size-1][1] == 0){ return; }
        this.places = OptimizedShared.orderPlaces(bestRoute,this.places);
        this.distances = OptimizedShared.orderDistances(bestRoute);
    }

    private double[][] twoOptSwap(double[][] route, int ii, int kk) {
        //[x][0] = lat, [x][1] = long, [x][2] visited -1 = false
        //for both route and newRoute
        double[][] newRoute = new double[route.length][2];

        //take route[0] to route[i-1] and add them in order to new_route
        for (int index = 0; index < ii; index++) {
            newRoute[index][0] = index;
        }

        //take route[i] to route[k] and add them in reverse order to new_route
        int counter = ii;
        for (int index = kk; index >= ii; index--) {
            newRoute[counter][0] = index;
            counter++;
        }

        //take route[k+1] to end and add them in order to new_route
        for (int index = kk + 1; index < route.length; index++) {
            newRoute[index][0] = index;
        }

        return newRoute;
    }

}
