package com.tripco.t20.misc;

import java.util.Map;
import java.lang.Math;
import java.lang.*;

/**
 * Determines the distance between geographic coordinates.
 */
public class GreatCircleDistance {
    /**
     * Calculates the distance between an origin and destination.
     * @param origin a Map containing keys latitude and logitude
     * @param destination a Map containing keys latitude and logitude
     * @param earthRadius Earth's radius in double form.
     * @return the distance
     */
    public static long calcDistance(Map origin, Map destination, double earthRadius) {
        //unpack origin and dest and convert to double
        String originLat = origin.get("latitude").toString();
        String originLong = origin.get("longitude").toString();
        String destLat = destination.get("latitude").toString();
        String destLong = destination.get("longitude").toString();

        double o1 = Math.toRadians(Double.parseDouble(originLat));
        double y1 = Math.toRadians(Double.parseDouble(originLong));
        double o2 = Math.toRadians(Double.parseDouble(destLat));
        double y2 = Math.toRadians(Double.parseDouble(destLong));

        // y1 = oLat o1 = oLong
        // y2 = dLat o2 = dLong
        double vincNumerator = Math.sqrt(
                Math.pow(Math.cos(o2) * Math.sin(Math.abs(y2 - y1)), 2)
                        +
                        Math.pow(
                                (Math.cos(o1) * Math.sin(o2)) -
                                        (Math.sin(o1) * Math.cos(o2) * Math.cos(Math.abs(y2 - y1))), 2)
        );

        double vincDenm = (Math.sin(o1) * Math.sin(o2))
                + (Math.cos(o1) * Math.cos(o2) * Math.cos(Math.abs(y2 - y1)));

        double vincAns = Math.atan2(vincNumerator,vincDenm);

        double distance = earthRadius * vincAns;
        long rounded = Math.round(distance);
        if (false) {
            System.out.println("Origin Param: " + origin);
            System.out.println("Destination Param: " + destination);
            System.out.println("Earth Radius: " + earthRadius);
            System.out.println("originLat: " + originLat);
            System.out.println("originLong: " + originLong);
            System.out.println("destLat: " + destLat);
            System.out.println("destLong: " + destLong);
            System.out.println("o1: " + o1);
            System.out.println("y1: " + y1);
            System.out.println("o2: " + o2);
            System.out.println("y2: " + y2);
            System.out.println("vincAns: " + vincAns);
            System.out.println("Distance: " + distance);
        }

        return rounded;
    }


}
