package com.example.predictor.service;

import com.example.predictor.model.Match;
import com.example.predictor.model.Team;
import com.example.predictor.model.Predictie;
import com.example.predictor.repository.MatchRepository;
import com.example.predictor.repository.TeamRepository;
import com.example.predictor.repository.PredictionRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final TeamRepository teamRepository;
    private final MatchRepository matchRepository;
    private final PredictionRepository predictionRepository;
    private final PredictionService predictionService;

    public Match saveMatch(Match match) {
        Team homeTeam = teamRepository.findByName(match.getHomeTeamName())
                .orElseThrow(() -> new RuntimeException("Team not found: " + match.getHomeTeamName()));
        match.setHome(homeTeam);

        Team awayTeam = teamRepository.findByName(match.getAwayTeamName())
                .orElseThrow(() -> new RuntimeException("Team not found: " + match.getAwayTeamName()));
        match.setAway(awayTeam);

        return matchRepository.save(match);
    }

    public List<Match> getAllMatches() {
        return matchRepository.findAll();
    }

    public Match findMatchById(String id) {
        return matchRepository.findMatchById(id);
    }

    @PostConstruct
    public void updateMatchesAtStartup() {
        updateCompletedMatches();
        updateMatchesWithoutScores();
        // predictionService.recalculateAllUsersPoints();
    }

    @Transactional
    public void updateCompletedMatches() {
        List<Match> matches = matchRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        for (Match match : matches) {
            if ("scheduled".equals(match.getStatus()) && match.getMatchDate().plusHours(2).isBefore(now)) {
                match.setStatus("completed");
                matchRepository.save(match);
                // updatePredictionsForMatch(match);
                System.out.println("Match with ID: " + match.getId() + " has been updated to completed.");
            }
        }
    }

    @Transactional
    public void updateMatchesWithoutScores() {
        List<Match> matches = matchRepository.findAll();

        for (Match match : matches) {
            if ((match.getHomeScore() == null || match.getAwayScore() == null)
                    && "completed".equals(match.getStatus())) {
                System.out.println("Match between: " + match.getHome().getName() + " and " + match.getAway().getName()
                        + " is completed but no score!");
                updateScoreFromPython(match);
                // updatePredictionsForMatch(match);
            }
        }
    }

    @Transactional
    public void updateScoreFromPython(Match match) {
        try {
            System.out.println("---- Start updating score for match using Python script ----");
            System.out.println("Match ID: " + match.getId());
            System.out.println("Home Team: " + (match.getHome() != null ? match.getHome().getName() : "null"));
            System.out.println("Away Team: " + (match.getAway() != null ? match.getAway().getName() : "null"));

            String pythonPath = "python";
            String scriptPath = "ExtractMatches/main.py";
            String stageNumber = match.getEtapa();

            // ProcessBuilder processBuilder = new ProcessBuilder(pythonPath, scriptPath, stageNumber);
            ProcessBuilder processBuilder = new ProcessBuilder("python3", scriptPath, stageNumber);
            processBuilder.redirectErrorStream(true);

            Process process = processBuilder.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            int exitCode = process.waitFor();
            if (exitCode == 0) {
                System.out.println("Script executed successfully.");
                System.out.println("Matches data: " + output);

                ObjectMapper objectMapper = new ObjectMapper();
                List<Map<String, String>> matchesData = objectMapper.readValue(output.toString(),
                        new TypeReference<>() {
                        });

                for (Map<String, String> matchData : matchesData) {
                    String jsonHomeTeam = normalizeTeamName(matchData.get("home_team"));
                    String jsonAwayTeam = normalizeTeamName(matchData.get("away_team"));
                    String result = matchData.get("result");

                    String dbHomeTeam = normalizeTeamName(match.getHome().getName());
                    String dbAwayTeam = normalizeTeamName(match.getAway().getName());

                    if (teamMatches(dbHomeTeam, jsonHomeTeam) && teamMatches(dbAwayTeam, jsonAwayTeam)) {
                        String[] scores = result.split(":");
                        if (scores.length == 2) {
                            match.setHomeScore(Integer.parseInt(scores[0].trim()));
                            match.setAwayScore(Integer.parseInt(scores[1].trim()));
                            matchRepository.save(match);
                            updatePredictionsForMatch(match);
                            System.out.println("Score updated for match: " + match.getHome().getName() + " vs "
                                    + match.getAway().getName() +
                                    " -> " + scores[0].trim() + ":" + scores[1].trim());
                        } else {
                            System.out.println("Score format not valid for match between " + jsonHomeTeam + " and "
                                    + jsonAwayTeam);
                        }
                    } else {
                        System.out.println("Teams do not match: Database - " + match.getHome().getName() + " vs "
                                + match.getAway().getName() +
                                ", Web - " + matchData.get("home_team") + " vs " + matchData.get("away_team"));
                    }
                }
            } else {
                System.err.println("Error while executing script. Exit code: " + exitCode);
            }

            System.out.println("---- Finished updating score for match ----");

        } catch (Exception e) {
            System.out.println("An error occurred while updating the score for match with ID: " + match.getId());
            e.printStackTrace();
        }
    }

    @Transactional
    public void updatePredictionsForMatch(Match match) {
        List<Predictie> predictions = predictionRepository.findByMatchId(match.getId());

        for (Predictie prediction : predictions) {
            prediction.setMatch(match);
            predictionRepository.save(prediction);

            predictionService.calculatePoints(prediction);
        }
    }

    public String normalizeTeamName(String name) {
        String normalized = Normalizer.normalize(name, Normalizer.Form.NFD);
        normalized = Pattern.compile("\\p{InCombiningDiacriticalMarks}+").matcher(normalized).replaceAll("");
        normalized = normalized.trim().replaceAll("\\s+", " ").toLowerCase();
        return normalized;
    }

    public boolean teamMatches(String dbTeamName, String webTeamName) {
        return normalizeTeamName(dbTeamName).equals(normalizeTeamName(webTeamName));
    }
}
