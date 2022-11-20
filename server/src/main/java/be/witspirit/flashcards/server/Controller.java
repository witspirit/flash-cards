package be.witspirit.flashcards.server;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
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

    @GetMapping("/browse")
    public List<String> listDataItems() throws IOException, URISyntaxException {
        return list(".");
    }

    @GetMapping("/browse/**") // To sidestep the / delimiter issue
    public List<String> listDataItems(HttpServletRequest request) throws IOException, URISyntaxException {
        String filePath = request.getRequestURI().split(request.getContextPath() + "/browse/")[1];
        return list(filePath);
    }

    private List<String> list(String path) throws IOException {
        Path resolvedPath = dataPath.resolve(path);
        LOGGER.debug("Browse: path = {} resolvedPath = {}", path, resolvedPath);
        Stream<Path> paths = Files.list(resolvedPath);

        return paths.map(p -> p.getFileName().toString()).toList();
    }
}
