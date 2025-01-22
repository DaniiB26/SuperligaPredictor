package com.example.predictor.repository;

import com.example.predictor.model.Leaderboard;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LeaderboardRepository extends MongoRepository<Leaderboard, String> {
    Optional<Leaderboard> findByName(String name);
}
