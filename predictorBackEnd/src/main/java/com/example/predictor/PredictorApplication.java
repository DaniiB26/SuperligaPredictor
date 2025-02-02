package com.example.predictor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PredictorApplication {
    public static void main(String[] args) {
        String springApplicationName = System.getenv("SPRING_APPLICATION_NAME");
        String mongoDbUri = System.getenv("MONGODB_URI");
        String jwtSecret = System.getenv("JWT_SECRET");

        if (springApplicationName != null) {
            System.setProperty("SPRING_APPLICATION_NAME", springApplicationName);
        }
        if (mongoDbUri != null) {
            System.setProperty("MONGODB_URI", mongoDbUri);
        }
        if (jwtSecret != null) {
            System.setProperty("JWT_SECRET", jwtSecret);
        }

        String port = System.getenv("PORT");
        if (port == null || port.isEmpty()) {
            port = "8080";
        }

        SpringApplication.run(PredictorApplication.class, new String[]{"--server.port=" + port});
    }
}
