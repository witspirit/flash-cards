package be.witspirit.flashcards.server;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
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

                CSVParser parser = CSVFormat.DEFAULT.parse(new FileReader(resolvedPath.toFile()));
                List<String> headerNames = parser.getHeaderNames();


                return new Deck(headerNames);
            }
            LOGGER.debug("Deck at {} does not exist", path);
            return null;
        } catch (Exception e) {
            throw new RuntimeException("Something went wrong...", e);
        }
    }
}
