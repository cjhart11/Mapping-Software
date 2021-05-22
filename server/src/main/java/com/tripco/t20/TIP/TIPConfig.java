package com.tripco.t20.TIP;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/** This class defines the Config response that provides the client
 * with server specific configuration information.
 *  
 * When used with restful API services,
 * An object is created from the request JSON by the MicroServer using GSON.
 * The buildResponse method is called to set the configuration information.
 * The MicroServer constructs the response JSON from the object using GSON.
 *  
 * When used for testing purposes,
 * An object is created using the constructor below.
 * The buildResponse method is called to set the configuration information.
 * The getDistance method is called to obtain the distance value for comparisons.
 */
public class TIPConfig extends TIPHeader {
  private String serverName;
  private List<String> placeAttributes;
  private List<String> optimizations;
  private List<Map> filters;

  private final transient Logger log = LoggerFactory.getLogger(TIPConfig.class);


  public TIPConfig() {
    this.requestType = "config";
    this.requestVersion = 5;
  }


  @Override
  public void buildResponse() {
    this.serverName = "T20 Trinity+";
    this.placeAttributes = Arrays.asList(
            "name",
            "id",
            "latitude",
            "longitude",
            "altitude",
            "municipality",
            "region",
            "country",
            "continent",
            "type");
    this.optimizations = Arrays.asList("none", "short", "shorter", "automatic");
    Map<String, Object> typeMap = new HashMap<>();
    Map<String, Object> countryMap = new HashMap<>();
    typeMap.put("name", "type");
    typeMap.put("values" , Arrays.asList("airport", "heliport", "balloonport", "closed"));
    countryMap.put( "name", "country");
    countryMap.put("values", CountryList.buildCountries());
    this.filters = Arrays.asList(typeMap, countryMap);
    log.trace("buildResponse -> {}", this);
  }


  String getServerName() {
    return this.serverName;
  }

  List<String> getPlaceAttributes() {
    return this.placeAttributes;
  }

  List<String> getOptimizations() {
    return this.optimizations;
  }

  List<Map> getFilters() { return this.filters;
  }

  int getVersion() {
    return this.requestVersion;
  }

}
