package be.witspirit.flashcard.excelgen.csv;

import be.witspirit.flashcard.excelgen.card.Deck;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.core.io.ClassPathResource;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;


@Slf4j
public class DeckLoader {

    public static Deck load(String path) {
        try {
            Path resolvedPath = Path.of(path);
            log.debug("Loading {} ...", resolvedPath);
            if (Files.exists(resolvedPath)) {
                log.debug("Deck at {} exists", path);

                return load(resolvedPath.toFile());
            }
            log.debug("Deck at {} does not exist", path);
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
