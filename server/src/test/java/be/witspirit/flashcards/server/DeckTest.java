package be.witspirit.flashcards.server;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;

import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;

public class DeckTest {

    private static Deck deck;

    @BeforeAll
    public static void loadDeck() {
        ClassPathResource classPathResource = new ClassPathResource("/sample-deck.csv");

        // deck = deckLoader.load("sample-deck.csv");
    }

    @Test
    void drawRandomCard() {
        assertThat(deck.elements()).containsExactly("Term A", "Term B", "Term C");
        assertThat(deck.size()).isEqualTo(3);
    }

}