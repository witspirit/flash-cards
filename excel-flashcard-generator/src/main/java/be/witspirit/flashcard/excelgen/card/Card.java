package be.witspirit.flashcard.excelgen.card;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Card {
    private final Map<String, String> valuesByTerm;

    public Card(Map<String, String> valuesByTerm) {
        this.valuesByTerm = valuesByTerm;
    }

    public List<String> elements() {
        return new ArrayList<>(valuesByTerm.keySet());
    }

    public String getElement(String elementName) {
        return valuesByTerm.get(elementName);
    }

    @Override
    public String toString() {
        return String.join(", ", valuesByTerm.values());
    }
}
