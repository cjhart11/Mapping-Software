package com.tripco.t20.TIP;

import com.tripco.t20.misc.GreatCircleDistance;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

class NearestNeighbor {

    List<PlacesList> places;
    long[] distances;
    private long tourDistance = Long.MAX_VALUE;
    private double earthRadius;
    private int totalPlaces;
    private double[][] tour;

    NearestNeighbor(Map<String, Object> options, List<PlacesList> places, long[] distances){
        this.places = places;
        this.distances = distances;
        this.earthRadius = Double.parseDouble(options.get("earthRadius").toString());
        this.totalPlaces = places.size();
        this.tour = new double[totalPlaces][2];
    }

    void nearestNeighborAlgorithm() {
        //create empty tour, [][0] = index in List, [][1] = distance to next city (index + 1)
        for (int startingCity = 0; startingCity < totalPlaces; startingCity++) {
            //extract places Lat and Long
            //[x][0] = lat, [x][1] = long, [x][2] visited -1 = false, >-1 = order of short trip
            double[][] coords = OptimizedShared.extractCoords(this.places);
            //[x][0] = index of city, [x][1] = distance to next city
            double[][] possibleTour = new double[totalPlaces][2];
            possibleTour[0][0] = startingCity;
            long possibleDistance = 0;
            //mark coords array as visited
            coords[startingCity][2] = 0;
            int visited = 1;
            double indexLastVisited = startingCity;
            while (visited < totalPlaces) {
                //index of last visited
                //find neighbor, [0] = index of neighbor, [1] = distance to this neighbor
                double[] neighbor = findNextNeighbor(indexLastVisited, coords, earthRadius);
                //this neighbor's index
                possibleTour[visited][0] = neighbor[0];
                //last visited distance to neighbor and possibleDistance
                possibleTour[visited - 1][1] = neighbor[1];
                possibleDistance += neighbor[1];
                //mark as visited
                int neighborIndex = (int) neighbor[0];
                coords[neighborIndex][2] = visited;
                indexLastVisited = neighbor[0];
                visited++;
            }

            long distanceHome = returnHome(startingCity,(int) indexLastVisited,coords,earthRadius);
            possibleTour[visited - 1][1] = distanceHome;
            possibleDistance += distanceHome;

            //copy to tour is possibleDistance < tourDistance
            if (tourDistance > possibleDistance) {
                tourDistance = possibleDistance;
                tour = possibleTour;
            }
        }
        setValues();
    }

    private void setValues(){
        this.places = OptimizedShared.orderPlaces(tour,this.places);
        this.distances = OptimizedShared.orderDistances(tour);
    }

    private double[] findNextNeighbor(double lastVisited, double[][] places, double earthRadius) {

        //create Map for lastVisited
        int lastVisit = (int) lastVisited;
        Map<String, Double> origin =
                OptimizedShared.createMap(places[lastVisit][0], places[lastVisit][1]);
        //[0]index of neighbor, [1] distance from last visited
        double[] neighbor = new double[2];
        neighbor[1] = Double.MAX_VALUE;
        for (int i = 0; i < places.length; i++) {
            //if visited, go to next iteration
            if (places[i][2] == -1) {

                //Create map for GreatCircle
                Map<String, Double> destination =
                        OptimizedShared.createMap(places[i][0],places[i][1]);

                //calculate distance
                long distance = GreatCircleDistance.calcDistance(origin, destination, earthRadius);
                if (distance < neighbor[1]) {
                    neighbor[0] = i;
                    neighbor[1] = distance;
                }
            }
        }

        return neighbor;
    }

    private long returnHome(int homeIndex,int lastVisitedIndex,double[][] cords,double earthRadius){
        Map<String, Double> home = new HashMap<>();
        home.put("latitude", cords[homeIndex][0]);
        home.put("longitude", cords[homeIndex][1]);

        Map<String, Double> last = new HashMap<>();
        last.put("latitude", cords[lastVisitedIndex][0]);
        last.put("longitude", cords[lastVisitedIndex][1]);

        return GreatCircleDistance.calcDistance(home, last, earthRadius);
    }

}