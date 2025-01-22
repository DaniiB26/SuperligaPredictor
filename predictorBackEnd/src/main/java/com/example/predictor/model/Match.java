package com.example.predictor.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "matches")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Match {

    @Id
    private String id;
    private Team home;
    private Team away;
    private Integer homeScore;
    private Integer awayScore;
    private String etapa;
    private LocalDateTime matchDate;
    private String status;

    @Transient
    private String homeTeamName;
    @Transient
    private String awayTeamName;
}