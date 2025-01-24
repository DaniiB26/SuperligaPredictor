package com.example.predictor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class PredictorApplication {
    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.configure().load();

        System.setProperty("SPRING_APPLICATION_NAME", dotenv.get("SPRING_APPLICATION_NAME"));
        System.setProperty("MONGODB_URI", dotenv.get("MONGODB_URI"));
        System.setProperty("JWT_SECRET", dotenv.get("JWT_SECRET"));

        String port = System.getenv("PORT");
        if (port == null || port.isEmpty()) {
            port = "8080";
        }

        System.out.println("SPRING_APPLICATION_NAME: " + System.getProperty("SPRING_APPLICATION_NAME"));
        System.out.println("MONGODB_URI: " + System.getProperty("MONGODB_URI"));
        System.out.println("JWT_SECRET: " + System.getProperty("JWT_SECRET"));

        SpringApplication.run(PredictorApplication.class, new String[]{"--server.port=" + port});
    }
}
