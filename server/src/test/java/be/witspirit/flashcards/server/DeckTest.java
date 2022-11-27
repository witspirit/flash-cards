package be.witspirit.flashcards.server;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;

public class DeckTest {

    private static Deck deck;

    @BeforeAll
    public static void loadDeck() {
        deck = DeckLoader.load(new ClassPathResource("/sample-deck.csv"));
        assertThat(deck).isNotNull();
    }

    @Test
    void drawRandomCard() {
        assertThat(deck.elements()).containsExactly("Term A", "Term B", "Term C");
        assertThat(deck.size()).isEqualTo(3);
    }

}