package com.example.predictor.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.predictor.model.Match;
import com.example.predictor.model.Predictie;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StandingsService {

    private final MatchService matchService;
    private final PredictionService predictionService;

    public Map<String, Integer> getRealBasedStandings() {
        Map<String, Integer> standingMap = new HashMap<>();

        List<Match> matches = matchService.getAllMatches();

        for (Match match : matches) {
            standingMap.putIfAbsent(match.getHome().getName(), 0);
            standingMap.putIfAbsent(match.getAway().getName(), 0);
        }

        System.out.println("Total echipe unice în standings map: " + standingMap.size());

        for (Match match : matches) {
            if ("completed".equalsIgnoreCase(match.getStatus())) {
                String homeTeam = match.getHome().getName();
                String awayTeam = match.getAway().getName();

                int homePoints = calculatePoints(match.getHomeScore(), match.getAwayScore(), true);
                int awayPoints = calculatePoints(match.getHomeScore(), match.getAwayScore(), false);

                standingMap.put(homeTeam, standingMap.get(homeTeam) + homePoints);
                standingMap.put(awayTeam, standingMap.get(awayTeam) + awayPoints);
            }
        }

        return standingMap;
    }

    private int calculatePoints(int homeScore, int awayScore, boolean isHome) {
        if (homeScore > awayScore) {
            return isHome ? 3 : 0;
        } else if (homeScore < awayScore) {
            return isHome ? 0 : 3;
        } else {
            return 1;
        }
    }

    public Map<String, Integer> getPredictionBasedStandings(String username) {
        Map<String, Integer> standings = new HashMap<>();

        List<Predictie> predictions = predictionService.getPredictionsByUser(username);

        for (Predictie prediction : predictions) {
            String homeTeam = prediction.getMatch().getHome().getName();
            String awayTeam = prediction.getMatch().getAway().getName();

            int homePrediction = prediction.getPredictedHomeScore();
            int awayPrediction = prediction.getPredictedAwayScore();

            if (homePrediction > awayPrediction) {
                standings.put(homeTeam, standings.getOrDefault(homeTeam, 0) + 3);
            } else if (homePrediction < awayPrediction) {
                standings.put(awayTeam, standings.getOrDefault(awayTeam, 0) + 3);
            } else {
                standings.put(homeTeam, standings.getOrDefault(homeTeam, 0) + 1);
                standings.put(awayTeam, standings.getOrDefault(awayTeam, 0) + 1);
            }
        }

        return standings;
    }

}
