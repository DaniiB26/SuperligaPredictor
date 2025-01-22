package com.example.predictor.service;

import com.example.predictor.model.Leaderboard;
import com.example.predictor.model.User;
import com.example.predictor.repository.LeaderboardRepository;
import com.example.predictor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final LeaderboardRepository leaderboardRepository;
    private final UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(LeaderboardService.class);

    public Leaderboard createLeaderboard(String name, String ownerUsername, String privacy) {
        logger.info("Attempting to create leaderboard with name: {}, ownerUsername: {}, privacy: {}", name, ownerUsername, privacy);

        Optional<User> ownerOptional = userRepository.findByUsername(ownerUsername);
        if (ownerOptional.isEmpty()) {
            logger.error("User not found with username: {}", ownerUsername);
            throw new RuntimeException("User not found: " + ownerUsername);
        }

        User owner = ownerOptional.get();
        logger.info("Found owner with ID: {}, username: {}", owner.getId(), owner.getUsername());

        Leaderboard leaderboard = new Leaderboard();
        leaderboard.setName(name);
        leaderboard.setOwner(owner);

        try {
            leaderboard.setPrivacy(Leaderboard.PrivacyType.valueOf(privacy.toUpperCase()));
        } catch (IllegalArgumentException e) {
            logger.error("Invalid privacy value: {}", privacy);
            throw new RuntimeException("Invalid privacy value: " + privacy);
        }

        leaderboard.setCode(UUID.randomUUID().toString());
        leaderboard.setUsers(List.of(owner));  // Owner-ul este adăugat implicit

        logger.info("Saving new leaderboard with name: {}, owner: {}, privacy: {}", name, owner.getUsername(), privacy);

        Leaderboard savedLeaderboard = leaderboardRepository.save(leaderboard);
        logger.info("Leaderboard saved successfully with ID: {}", savedLeaderboard.getId());

        return savedLeaderboard;
    }

    public List<Leaderboard> getAllLeaderboards() {
        return leaderboardRepository.findAll();
    }

    public Leaderboard addUserToLeaderboard(String leaderboardId, String username) {
        Leaderboard leaderboard = leaderboardRepository.findById(leaderboardId)
                .orElseThrow(() -> new RuntimeException("Leaderboard not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        leaderboard.getUsers().add(user);
        Leaderboard updatedLeaderboard = leaderboardRepository.save(leaderboard);

        // Actualizăm leaderboard-urile
        updateLeaderboards();

        return updatedLeaderboard;
    }

    public Leaderboard getPublicLeaderboard() {
        return leaderboardRepository.findByName("Public Leaderboard")
                .orElseThrow(() -> new RuntimeException("Public leaderboard not found"));
    }

    public void updateLeaderboards() {
        List<Leaderboard> leaderboards = leaderboardRepository.findAll();
        for (Leaderboard leaderboard : leaderboards) {
            // Recalculăm punctajele pentru utilizatorii din leaderboard
            leaderboard.getUsers().forEach(user -> {
                Optional<User> updatedUser = userRepository.findByUsername(user.getUsername());
                updatedUser.ifPresent(value -> user.setSimplePoints(value.getSimplePoints()));
            });

            // Sortăm utilizatorii din leaderboard după punctaje descrescătoare
            leaderboard.getUsers().sort((u1, u2) -> Integer.compare(u2.getSimplePoints(), u1.getSimplePoints()));

            // Salvăm leaderboard-ul actualizat
            leaderboardRepository.save(leaderboard);
        }
    }


}
