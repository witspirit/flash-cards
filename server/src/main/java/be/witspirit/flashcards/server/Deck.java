package be.witspirit.flashcards.server;

import java.util.List;

public class Deck {
    private final List<String> elements;

    public Deck(List<String> headerNames){
        this.elements = headerNames;
    }

    public List<String> elements() {
        return elements;
    }
}
