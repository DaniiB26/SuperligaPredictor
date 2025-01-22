package com.example.predictor.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.predictor.controller.dto.TeamStandingDTO;
import com.example.predictor.service.StandingsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/standings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StandingsController {

    private final StandingsService standingsService;

    @GetMapping("/real")
    public List<TeamStandingDTO> getRealBasedStandings() {
        // Obține clasamentul folosind numele echipelor ca cheie
        Map<String, Integer> standingsMap = standingsService.getRealBasedStandings();

        // Transformă map-ul în listă de DTO-uri ordonată descrescător după puncte
        return standingsMap.entrySet().stream()
                .sorted((entry1, entry2) -> entry2.getValue().compareTo(entry1.getValue())) // Sortează descrescător
                                                                                            // după puncte
                .map(entry -> new TeamStandingDTO(entry.getKey(), entry.getValue())) // Creează DTO-uri
                .toList();
    }

    @GetMapping("/prediction")
    public List<TeamStandingDTO> getPredictionStandings(@RequestParam String username) {
        Map<String, Integer> predictionMap = standingsService.getPredictionBasedStandings(username);

        return predictionMap.entrySet().stream()
                .sorted((entry1, entry2) -> entry2.getValue().compareTo(entry1.getValue())) // Sortează descrescător
                                                                                            // după puncte
                .map(entry -> new TeamStandingDTO(entry.getKey(), entry.getValue())) // Creează DTO-uri
                .toList();
    }

}
