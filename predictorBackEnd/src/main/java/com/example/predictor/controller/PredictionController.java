package com.example.predictor.controller;

import com.example.predictor.model.Match;
import com.example.predictor.model.Predictie;
import com.example.predictor.service.MatchService;
import com.example.predictor.service.PredictionService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/predictions")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PredictionController {

    private final PredictionService predictionService;
    private final MatchService matchService;
    private static final Logger logger = LoggerFactory.getLogger(PredictionController.class);

    @GetMapping("/user/{user}")
    public ResponseEntity<List<Predictie>> getPredictionsForUser(@PathVariable String user) {
        List<Predictie> predictions = predictionService.getPredictionsByUser(user);
        return ResponseEntity.ok(predictions);
    }

    @GetMapping("/user/{user}/match/{matchId}")
    public ResponseEntity<Predictie> getPredictionForMatch(@PathVariable String user, @PathVariable String matchId) {
        Optional<Predictie> prediction = Optional.ofNullable(predictionService.getPredictionForMatch(user, matchId));
        return prediction.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Predictie> savePrediction(@RequestBody Predictie prediction) {
        try {
            Match match = matchService.findMatchById(prediction.getMatch().getId());
            prediction.setMatch(match);
            prediction.setPredictionDate(LocalDateTime.now());
            Predictie savedPrediction = predictionService.savePrediction(prediction);
            return ResponseEntity.ok(savedPrediction);
        } catch (IllegalStateException e) {
            logger.error("Failed to save prediction", e);
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/user/{user}/recalculate")
    public ResponseEntity<Void> recalculatePointsForUser(@PathVariable String user) {
        predictionService.recalculatePointsForUser(user);
        return ResponseEntity.ok().build();
    }
}