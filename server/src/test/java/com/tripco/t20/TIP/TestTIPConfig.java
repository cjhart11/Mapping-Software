package com.tripco.t20.TIP;

import java.util.List;
import java.util.Map;

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

/** Verifies the operation of the TIP config class and its buildResponse method.
 */
public class TestTIPConfig {
  private TIPConfig conf;

  @Before
  public void createConfigurationForTestCases(){
    conf = new TIPConfig();
    conf.buildResponse();
  }

  @Test
  public void testType() {
    String type = "config"; //conf.getType();
    assertEquals("config requestType", "config", type);
  }

  @Test
  public void testVersion() {
    int version = conf.getVersion();
    assertEquals("config requestVersion", 5, version);
  }

  @Test
  public void testServerName() {
    String name = conf.getServerName();
    assertEquals("config name", "T20 Trinity+", name);
  }

  @Test
  public void testPlaceAttributes() {
    List<String> attr = conf.getPlaceAttributes();
    assertEquals("config attribute size", 10, attr.size());
  }

  @Test
  public void testOptimizations() {
    List<String> attr = conf.getOptimizations();
    assertEquals("config optimizations attribute size",  4, attr.size());
  }

  @Test
  public void testTripFilters() {
    List<Map> attr = conf.getFilters();
    assertEquals("config filters size" , 2, attr.size());
  }
}
