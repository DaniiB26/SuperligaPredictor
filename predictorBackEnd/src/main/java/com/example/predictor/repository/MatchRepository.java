package com.example.predictor.repository;

import com.example.predictor.model.Match;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MatchRepository extends MongoRepository<Match, String> {
    Match findMatchById(String id);
}