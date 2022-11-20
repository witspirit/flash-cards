package be.witspirit.flashcards.server;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Path;

@SpringBootApplication
public class ServerApplication {
    private static final Logger LOGGER = LoggerFactory.getLogger(ServerApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(ServerApplication.class, args);
    }

    @Bean
    public Path dataPath() throws URISyntaxException {
        URL dataUrl = Thread.currentThread().getContextClassLoader().getResource("data");
        LOGGER.debug("dataUrl = {}", dataUrl);

        return Path.of(dataUrl.toURI());
    }

}
