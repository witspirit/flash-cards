package be.witspirit.flashcards.server;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class DeckLoaderTest {

    @Autowired
    private DeckLoader deckLoader;

    @Test
    public void loadSimpleDemo() {
        Deck deck = deckLoader.load("/samples/simple-demo.csv");
        assertThat(deck).isNotNull();

        assertThat(deck.elements()).containsExactly("Question", "Answer");
        assertThat(deck.size()).isEqualTo(3);
    }

    @Test
    public void leadingSlashIsOptional() {
        Deck deck = deckLoader.load("samples/simple-demo.csv");
        assertThat(deck).isNotNull();
    }
}
