package com.example.predictor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class PredictorApplication {
    public static void main(String[] args) {
        
        if (System.getenv("PORT") == null) {
            
            Dotenv dotenv = Dotenv.configure().load();
            System.setProperty("SPRING_APPLICATION_NAME", dotenv.get("SPRING_APPLICATION_NAME"));
            System.setProperty("MONGODB_URI", dotenv.get("MONGODB_URI"));
            System.setProperty("JWT_SECRET", dotenv.get("JWT_SECRET"));
        } else {
            
            System.setProperty("SPRING_APPLICATION_NAME", System.getenv("SPRING_APPLICATION_NAME"));
            System.setProperty("MONGODB_URI", System.getenv("MONGODB_URI"));
            System.setProperty("JWT_SECRET", System.getenv("JWT_SECRET"));
        }

        
        String port = System.getenv("PORT");
        if (port == null || port.isEmpty()) {
            port = "8080";
        }

        SpringApplication.run(PredictorApplication.class, new String[]{"--server.port=" + port});
    }
}
