package be.witspirit.flashcard.excelgen.card;

import java.util.*;

public class Deck {
    private final List<String> elements;
    private final List<Card> cards = new ArrayList<>();

    public Deck(List<String> headerNames){
        this.elements = headerNames;
    }

    public Deck addValues(Collection<Map<String, String>> values) {
        return addCards(values.stream().map(Card::new).toList());
    }

    public Deck addCard(Card... cards) {
        return addCards(Arrays.asList(cards));
    }

    public Deck addCards(Collection<Card> cards) {
        this.cards.addAll(cards);
        return this;
    }

    public List<String> elements() {
        return elements;
    }

    public int size() {
        return cards.size();
    }

    public List<Card> cards() {
        return cards;
    }

    public DeckExtractors extractors() {
        return new DeckExtractors(this);
    }

}
