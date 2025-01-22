package com.example.predictor.controller;

import com.example.predictor.controller.dto.CreateLeaderboardRequest;
import com.example.predictor.model.Leaderboard;
import com.example.predictor.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboards")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @PostMapping("/create")
    public Leaderboard createLeaderboard(@RequestBody CreateLeaderboardRequest request) {
        return leaderboardService.createLeaderboard(request.getName(), request.getOwnerUsername(), request.getPrivacy());
    }


    @GetMapping
    public List<Leaderboard> getAllLeaderboards() {
        return leaderboardService.getAllLeaderboards();
    }

    @PostMapping("/addUser")
    public Leaderboard addUserToLeaderboard(@RequestParam String leaderboardId, @RequestParam String username) {
        return leaderboardService.addUserToLeaderboard(leaderboardId, username);
    }

    @GetMapping("/public")
    public Leaderboard getPublicLeaderboard() {
        return leaderboardService.getPublicLeaderboard();
    }

    @PostMapping("/joinLeaderboard")
    public Leaderboard joinLeaderboard(@RequestParam String code, @RequestParam String username) {
        return  leaderboardService.addUserToLeaderboard(code, username);
    }
}
