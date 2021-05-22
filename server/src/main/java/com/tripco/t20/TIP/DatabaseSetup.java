package com.tripco.t20.TIP;

public class DatabaseSetup {

    public static String getDevelopment(){
        return System.getenv(("CS314_ENV"));
    }

    static String getTravis(){
        return System.getenv("TRAVIS");
    }

    private static String isDevelopment;
    private static String isTravis;
    public static String user;
    public static String pass;
    static String myUrl;

    static void getEnvironment(){

        isDevelopment = getDevelopment();
        isTravis = getTravis();

        if(isTravis != null && isTravis.equals("true")){
            user = "root";
            pass = null;
            myUrl = "jdbc:mysql://127.0.0.1/cs314";
        }
        else if (isDevelopment != null && isDevelopment.equals("development")) {
            user = "cs314-db";
            pass = "eiK5liet1uej";
            myUrl = "jdbc:mysql://127.0.0.1:64148/cs314";
        }

        else {
            user = "cs314-db";
            pass = "eiK5liet1uej";
            myUrl = "jdbc:mysql://faure.cs.colostate.edu/cs314";
        }

    }
}
