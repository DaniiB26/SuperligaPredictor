package com.example.predictor.repository;

import com.example.predictor.model.Predictie;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PredictionRepository extends MongoRepository<Predictie, String> {
    List<Predictie> findByUser(String user);

    Predictie findByUserAndMatchId(String user, String matchId);

    List<Predictie> findByMatchId(String matchId);

    List<Predictie> findByUserAndChecked(String user, Boolean check);
}