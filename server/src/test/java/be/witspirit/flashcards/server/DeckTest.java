package be.witspirit.flashcards.server;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;

public class DeckTest {
    private static final Logger LOGGER = LoggerFactory.getLogger(DeckTest.class);

    private static Deck deck;

    @BeforeAll
    public static void loadDeck() {
        deck = DeckLoader.load(new ClassPathResource("/sample-deck.csv"));
        assertThat(deck).isNotNull();
    }

    @Test
    void basicLoadCheck() {
        assertThat(deck.elements()).containsExactly("Term A", "Term B", "Term C");
        assertThat(deck.size()).isEqualTo(3);
    }

    @Test
    void drawRandomCard() {
        Card card = deck.drawRandom();

        LOGGER.info(""+card);
    }

}