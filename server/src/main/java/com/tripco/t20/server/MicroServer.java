package com.tripco.t20.server;

import com.google.gson.Gson;
import com.tripco.t20.TIP.TIPConfig;
import com.tripco.t20.TIP.TIPDistance;
import com.tripco.t20.TIP.TIPHeader;
import com.tripco.t20.TIP.TIPTrip;
import com.tripco.t20.TIP.TipLocation;
import com.tripco.t20.misc.RequestValidation;
import java.lang.reflect.Type;
import java.sql.Time;
import java.util.concurrent.TimeUnit;

import org.everit.json.schema.ValidationException;
import org.json.JSONException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import spark.Request;
import spark.Response;
import spark.Spark;
import static spark.Spark.secure;


/** A micro server for a single page web application that serves the static files
 * and processes restful API requests.
 */
class MicroServer {

  private final Logger log = LoggerFactory.getLogger(MicroServer.class);


  MicroServer(int serverPort) {
    configureServer(serverPort);
    serveStaticPages();
    processRestfulAPIrequests();
    log.info("MicroServer running on port: {}", serverPort);
  }


  private void configureServer(int serverPort) {
    Spark.port(serverPort);
    String keystoreFile = System.getenv("KEYSTORE_FILE");
    String keystorePassword = System.getenv("KEYSTORE_PASSWORD");
    if (keystoreFile != null && keystorePassword != null) {
      secure(keystoreFile, keystorePassword, null, null);
      log.info("Keystore file: {}", keystoreFile);
      log.info("Keystore password: {}", keystorePassword);
      log.info("MicroServer using HTTPS.");
    }
    else {
      log.info("MicroServer using HTTP.");
    }
    log.trace("Server configuration complete");
  }


  private void serveStaticPages() {
    String path = "/public/";
    Spark.staticFileLocation(path);
    Spark.get("/", (req, res) -> { res.redirect("index.html"); return null; });
    log.trace("Static file configuration complete");
  }


  private void processRestfulAPIrequests() {
    Spark.get("/api/config", this::processTIPconfigRequest);
    Spark.post("/api/distance", this::processTIPdistanceRequest);
    Spark.post("/api/trip", this::processTIPtripRequest);
    Spark.post("/api/location", this::processTipLocationRequest);
    Spark.get("/api/echo", this::echoHTTPrequest);
    log.trace("Restful configuration complete");
  }




  private String processTIPconfigRequest(Request request, Response response) {
    log.info("TIP Config request: {}", HTTPrequestToJson(request));
    response.type("application/json");
    response.header("Access-Control-Allow-Origin", "*");
    response.status(200);
    try {
      Gson jsonConverter = new Gson();
      TIPConfig tipRequest = new TIPConfig();
      tipRequest.buildResponse();
      String responseBody = jsonConverter.toJson(tipRequest);
      log.trace("TIP Config response: {}", responseBody);
      return responseBody;
    } catch (Exception e) {
      log.error("Exception: {}", e);
      response.status(500);
      return request.body();
    }
  }

  private String processTipLocationRequest(Request request, Response response) {
    return processTIPrequest(TipLocation.class, request, response);
  }

  private String processTIPtripRequest(Request request, Response response) {
    return processTIPrequest(TIPTrip.class, request, response);
  }

  private String processTIPdistanceRequest(Request request, Response response) {
    return processTIPrequest(TIPDistance.class, request, response);
  }

  private String processTIPrequest(Type tipType, Request request, Response response) {
    log.info("TIP Request: {}", HTTPrequestToJson(request));
    response.type("application/json");
    response.header("Access-Control-Allow-Origin", "*");
    response.status(200);

    try {
      RequestValidation testRequest = new RequestValidation(request.body());
      testRequest.validate();
      Gson jsonConverter = new Gson();
      TIPHeader tipRequest = jsonConverter.fromJson(request.body(), tipType);
      tipRequest.buildResponse();
      String responseBody = jsonConverter.toJson(tipRequest);
      return responseBody;
    } catch (ValidationException e){
      log.error("Exception: {}", e.getAllMessages());
      response.status(400);
      return request.body();
    } catch (JSONException e){
      log.error("Exception: {}", e);
      response.status(400);
      return request.body();
    } catch (Exception e) {
      log.error("Exception: {}", e);
      response.status(500);
      return request.body();
    }
  }


  private String echoHTTPrequest(Request request, Response response) {
    response.type("application/json");
    response.header("Access-Control-Allow-Origin", "*");
    return HTTPrequestToJson(request);
  }


  private String HTTPrequestToJson(Request request) {
    return "{\n"
            + "\"attributes\":\"" + request.attributes() + "\",\n"
            + "\"body\":\"" + request.body() + "\",\n"
            + "\"contentLength\":\"" + request.contentLength() + "\",\n"
            + "\"contentType\":\"" + request.contentType() + "\",\n"
            + "\"contextPath\":\"" + request.contextPath() + "\",\n"
            + "\"cookies\":\"" + request.cookies() + "\",\n"
            + "\"headers\":\"" + request.headers() + "\",\n"
            + "\"host\":\"" + request.host() + "\",\n"
            + "\"ip\":\"" + request.ip() + "\",\n"
            + "\"params\":\"" + request.params() + "\",\n"
            + "\"pathInfo\":\"" + request.pathInfo() + "\",\n"
            + "\"serverPort\":\"" + request.port() + "\",\n"
            + "\"protocol\":\"" + request.protocol() + "\",\n"
            + "\"queryParams\":\"" + request.queryParams() + "\",\n"
            + "\"requestMethod\":\"" + request.requestMethod() + "\",\n"
            + "\"scheme\":\"" + request.scheme() + "\",\n"
            + "\"servletPath\":\"" + request.servletPath() + "\",\n"
            + "\"session\":\"" + request.session() + "\",\n"
            + "\"uri()\":\"" + request.uri() + "\",\n"
            + "\"url()\":\"" + request.url() + "\",\n"
            + "\"userAgent\":\"" + request.userAgent() + "\"\n"
            + "}";
  }


}
