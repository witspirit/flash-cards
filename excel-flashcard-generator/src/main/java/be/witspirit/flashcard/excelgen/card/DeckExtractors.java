package be.witspirit.flashcard.excelgen.card;

import lombok.RequiredArgsConstructor;

import java.util.function.Function;

@RequiredArgsConstructor
public class DeckExtractors {
    private static final Function<Card, String> EMPTY = c -> "";

    private final Deck deck;

    public Function<Card, String> index(int columnNumber) {
        if (columnNumber >= deck.elements().size()) {
            return EMPTY;
        }
        return c -> c.getElement(deck.elements().get(columnNumber));
    }

    public Function<Card, String> name(String columnName) {
        if (!deck.elements().contains(columnName)) {
            return EMPTY;
        }
        return c -> c.getElement(columnName);
    }

}
