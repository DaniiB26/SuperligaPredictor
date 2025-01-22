package com.example.predictor.service;

import com.example.predictor.model.Match;
import com.example.predictor.model.Predictie;
import com.example.predictor.model.User;
import com.example.predictor.repository.MatchRepository;
import com.example.predictor.repository.PredictionRepository;
import com.example.predictor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PredictionService {

    private final PredictionRepository predictionRepository;
    private final UserRepository userRepository;
    private final MatchRepository matchRepository;
    private final LeaderboardService leaderboardService;

    public List<Predictie> getPredictionsByUser(String username) {
        return predictionRepository.findByUser(username);
    }

    public Predictie getPredictionForMatch(String username, String matchId) {
        return predictionRepository.findByUserAndMatchId(username, matchId);
    }

    public Predictie savePrediction(Predictie prediction) {
        validateMatchDate(prediction);
        return predictionRepository.save(prediction);
    }

    @Transactional
    public void recalculatePointsForUser(String username) {
        List<Predictie> predictions = predictionRepository.findByUserAndChecked(username, false);
        userRepository.findByUsername(username).ifPresent(user -> {
            int currentPoints = user.getSimplePoints();
            int additionalPoints = predictions.stream()
                    .filter(this::isMatchCompleted)
                    .mapToInt(this::calculatePoints)
                    .sum();

            user.setSimplePoints(currentPoints + additionalPoints);
            userRepository.save(user);

            predictions.stream()
                    .filter(this::isMatchCompleted)
                    .forEach(prediction -> {
                        prediction.setChecked(true);
                        predictionRepository.save(prediction);
                    });
        });
    }

    @Transactional
    public void updateCompletedPredictions() {
        List<Predictie> predictions = predictionRepository.findAll();
        predictions.stream()
                .filter(prediction -> isMatchCompleted(prediction.getMatch())
                        && !"completed".equalsIgnoreCase(prediction.getMatch().getStatus()))
                .forEach(prediction -> {
                    prediction.getMatch().setStatus("completed");
                    calculatePoints(prediction);
                    predictionRepository.save(prediction);
                });
    }

    @Transactional
    public void updateAllPredictionsWithMatches() {
        List<Predictie> allPredictions = predictionRepository.findAll();
        allPredictions.forEach(
                prediction -> matchRepository.findById(prediction.getMatch().getId()).ifPresent(prediction::setMatch));
        predictionRepository.saveAll(allPredictions);
    }

    @Transactional
    public int calculatePoints(Predictie prediction) {
        int points = 0;
        Match match = prediction.getMatch();

        if (match.getHomeScore() == null || match.getAwayScore() == null) {
            return points;
        }

        if (match.getHomeScore().equals(prediction.getPredictedHomeScore()) &&
                match.getAwayScore().equals(prediction.getPredictedAwayScore())) {
            points = 3;
        } else if ((match.getHomeScore() > match.getAwayScore()
                && prediction.getPredictedHomeScore() > prediction.getPredictedAwayScore()) ||
                (match.getHomeScore() < match.getAwayScore()
                        && prediction.getPredictedHomeScore() < prediction.getPredictedAwayScore())
                ||
                (match.getHomeScore().equals(match.getAwayScore())
                        && prediction.getPredictedHomeScore().equals(prediction.getPredictedAwayScore()))) {
            points = 1;
        }

        prediction.setPoints(points);
        prediction.setChecked(true);
        predictionRepository.save(prediction);

        int finalPoints = points;

        Optional<User> newPointsUser = userRepository.findByUsername(prediction.getUser());
        if (newPointsUser.isPresent()) {
            Integer oldPoints = newPointsUser.get().getSimplePoints();
            newPointsUser.get().setSimplePoints(oldPoints + finalPoints);
            userRepository.save(newPointsUser.get());
        }

        leaderboardService.updateLeaderboards();

        return points;
    }

    private void validateMatchDate(Predictie prediction) {
        LocalDateTime matchDate = prediction.getMatch().getMatchDate();
        if (matchDate == null) {
            throw new IllegalStateException("Match date is null. Cannot make a prediction without the match date.");
        }
        if (matchDate.isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Cannot make a prediction after the match has started.");
        }
    }

    private boolean isMatchCompleted(Match match) {
        return match.getHomeScore() != null && match.getAwayScore() != null && "completed".equals(match.getStatus());
    }

    private boolean isMatchCompleted(Predictie prediction) {
        return isMatchCompleted(prediction.getMatch());
    }

    @Transactional
    public void recalculateAllUsersPoints() {
        List<User> users = userRepository.findAll();
        users.forEach(user -> {
            user.setSimplePoints(0);
            userRepository.save(user);
            List<Predictie> predictions = predictionRepository.findByUser(user.getUsername());
            int totalPoints = predictions.stream()
                    .filter(this::isMatchCompleted)
                    .mapToInt(this::calculatePoints)
                    .sum();
            user.setSimplePoints(totalPoints);
            System.out.println("User-ul: " + user.getUsername() + " are " + user.getSimplePoints() + " puncte.");
            userRepository.save(user);
        });
        leaderboardService.updateLeaderboards();
    }

}
