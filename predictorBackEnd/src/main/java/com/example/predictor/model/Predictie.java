package com.example.predictor.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "predictions")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Predictie {

    @Id
    private String id;
    private String user;
    private Match match;
    private Integer predictedHomeScore;
    private Integer predictedAwayScore;
    private LocalDateTime predictionDate;
    private int points;
    private boolean checked;
}