package com.example.tuniclanguagetool;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class SoundsController {

    @GetMapping("/api/sounds")
    public List<Sound> getSounds() {
        return List.of(
            new Sound(11, List.of("E1", "E5", "E6"), "?"),
            new Sound(12, List.of("E5", "E6"), "?"),
            new Sound(13, List.of("E3", "E4"), "?"),
            new Sound(14, List.of("E3", "E4", "E5"), "?"),
            new Sound(15, List.of("E4", "E5"), "?"),
            new Sound(16, List.of("E1", "E6"), "?"),
            new Sound(21, List.of("E3", "E4", "E5", "E6"), "?"),
            new Sound(22, List.of("E1", "E4", "E5", "E6"), "?"),
            new Sound(23, List.of("E1", "E4", "E5"), "?"),
            new Sound(24, List.of("E1", "E3", "E5", "E6"), "?"),
            new Sound(25, List.of("E1", "E3", "E4", "E6"), "?"),
            new Sound(26, List.of("E3", "E5", "E6"), "?"),
            new Sound(31, List.of("E6"), "?"),
            new Sound(32, List.of("E1"), "?"),
            new Sound(33, List.of("E4"), "?"),
            new Sound(34, List.of("E3"), "?"),
            new Sound(35, List.of("E1", "E3", "E4", "E5", "E6"), "?"),
            new Sound(36, List.of("E3", "E5"), "?"),
            new Sound(41, List.of("E9", "E11"), "?"),
            new Sound(42, List.of("E9", "E11", "E12"), "?"),
            new Sound(43, List.of("E7", "E8", "E9", "E10", "E11", "E12"), "?"),
            new Sound(44, List.of("E8", "E10"), "?"),
            new Sound(45, List.of("E7", "E9"), "?"),
            new Sound(46, List.of("E8", "E10", "E12"), "?"),
            new Sound(51, List.of("E7", "E9", "E11"), "?"),
            new Sound(52, List.of("E7", "E8", "E9"), "?"),
            new Sound(53, List.of("E8", "E9", "E10"), "?"),
            new Sound(54, List.of("E7", "E11"), "?"),
            new Sound(55, List.of("E10", "E12"), "?"),
            new Sound(56, List.of("E8", "E10", "E11"), "?"),
            new Sound(61, List.of("E7", "E9", "E12"), "?"),
            new Sound(62, List.of("E7", "E8", "E10", "E12"), "?"),
            new Sound(63, List.of("E7", "E9", "E10", "E11"), "?"),
            new Sound(64, List.of("E7", "E8", "E10", "E11"), "?"),
            new Sound(65, List.of("E7", "E9", "E10", "E12"), "?"),
            new Sound(66, List.of("E8", "E9", "E10", "E11", "E12"), "?"),
            new Sound(71, List.of("E7", "E8", "E9", "E11", "E12"), "?"),
            new Sound(72, List.of("E7", "E9", "E10"), "?"),
            new Sound(73, List.of("E7", "E8", "E10"), "?"),
            new Sound(74, List.of("E7", "E10", "E12"), "?"),
            new Sound(75, List.of("E8", "E12"), "?"),
            new Sound(76, List.of("E9", "E10"), "?")
        );
    }

    public record Sound(int id, List<String> edges, String phoneme) {}
}
