package com.tripco.t20.TIP;

import com.tripco.t20.misc.GreatCircleDistance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;


/** Defines the TIP distance object.
 *
 * For use with restful API services,
 * An object is created from the request JSON by the MicroServer using GSON.
 * The buildResponse method is called to determine the distance.
 * The MicroServer constructs the response JSON from the object using GSON.
 *
 * For unit testing purposes,
 * An object is created using the constructor below with appropriate parameters.
 * The buildResponse method is called to determine the distance.
 * The getDistance method is called to obtain the distance value for comparisons.
 *
 */
public class TIPDistance extends TIPHeader {
  private Map origin;
  private Map destination;
  private double earthRadius;
  private long distance;

  private final transient Logger log = LoggerFactory.getLogger(TIPDistance.class);


  TIPDistance(int version, Map origin, Map destination, double earthRadius) {
    this();
    this.requestType = "distance";
    this.requestVersion = version;
    this.origin = origin;
    this.destination = destination;
    this.earthRadius = earthRadius;
    this.distance = 0;
  }


  private TIPDistance() {
    this.requestType = "distance";
    this.requestVersion = 5;
  }


  @Override
  public void buildResponse() {
    if(this.origin == this.destination){
      this.distance = 0;
    }
    else{
      this.distance = GreatCircleDistance.calcDistance(this.origin, this.destination, this.earthRadius);
    }

    log.trace("buildResponse -> {}", this);
  }


  long getDistance() {
    return distance;
  }
}

