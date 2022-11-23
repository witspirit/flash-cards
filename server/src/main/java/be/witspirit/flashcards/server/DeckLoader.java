package be.witspirit.flashcards.server;

import java.util.stream.Collectors;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.FileReader;
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

                CSVParser parser = CSVFormat.RFC4180.builder().setHeader().setSkipHeaderRecord(true).build()
                  .parse(new FileReader(resolvedPath.toFile()));
                List<String> headerNames = parser.getHeaderNames();

                Deck deck = new Deck(headerNames);
                deck.addValues(parser.stream().map(CSVRecord::toMap).toList());

                return deck;
            }
            LOGGER.debug("Deck at {} does not exist", path);
            return null;
        } catch (Exception e) {
            throw new RuntimeException("Something went wrong...", e);
        }
    }
}
