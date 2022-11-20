package be.witspirit.flashcards.server;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api")
public class Controller {
    private static final Logger LOGGER = LoggerFactory.getLogger(Controller.class);

    private final Path dataPath;

    public Controller(Path dataPath) {
        this.dataPath = dataPath;
    }

    @GetMapping("/browse/{path}")
    public List<String> listDataItems(@PathVariable(required = false) String path) throws IOException, URISyntaxException {
        if (path == null) {
            path = ".";
        }
        Path resolvedPath = dataPath.resolve(path);
        LOGGER.debug("Browse: path = {} resolvedPath = {}", path, resolvedPath);
        Stream<Path> paths = Files.list(resolvedPath);

        return paths.map(p -> p.getFileName().toString()).toList();
    }
}
