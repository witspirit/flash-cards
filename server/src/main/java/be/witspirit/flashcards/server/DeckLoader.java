package be.witspirit.flashcards.server;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@Service
public class DeckLoader {
    private static final Logger LOGGER = LoggerFactory.getLogger(DeckLoader.class);

    private final Path dataPath;

    public DeckLoader(Path dataPath) {
        this.dataPath = dataPath;
    }

    public Deck load(String path) {
        try {
            if (path.startsWith("/")) {
                path = path.substring(1);
            }
            Path resolvedPath = dataPath.resolve(path);
            LOGGER.debug("Loading {} ...", resolvedPath);
            if (Files.exists(resolvedPath)) {
                LOGGER.debug("Deck at {} exists", path);

                return load(resolvedPath.toFile());
            }
            LOGGER.debug("Deck at {} does not exist", path);
            return null;
        } catch (Exception e) {
            throw new RuntimeException("Something went wrong...", e);
        }
    }

    public static Deck load(ClassPathResource cpResource) {
        try {
            return load(cpResource.getFile());
        } catch (IOException e) {
            throw new RuntimeException("Failed to convert ClassPathResource into File", e);
        }
    }

    public static Deck load(File file) {
        try (FileReader reader = new FileReader(file);
             CSVParser parser = CSVFormat.RFC4180.builder()
               .setHeader().setSkipHeaderRecord(true).build()
               .parse(reader)) {
            List<String> headerNames = parser.getHeaderNames();

            Deck deck = new Deck(headerNames);
            deck.addValues(parser.stream().map(CSVRecord::toMap).toList());
            return deck;
        } catch (IOException e) {
            throw new RuntimeException("Failed to load deck", e);
        }
    }
}
