package com.example.predictor.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "leaderboards")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Leaderboard {

    @Id
    private String id;
    private String code;
    private String name;
    private User owner;
    private List<User> users;
    private PrivacyType privacy;

    public enum PrivacyType {
        PUBLIC, PRIVATE
    }
}
