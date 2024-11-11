package be.witspirit.flashcard.excelgen;

import be.witspirit.flashcard.excelgen.card.Deck;
import be.witspirit.flashcard.excelgen.csv.DeckLoader;
import be.witspirit.flashcard.excelgen.excel.CardGenerator;
import be.witspirit.flashcard.excelgen.excel.ExcelCard;
import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Slf4j
public class FlashcardGenerator {
    private final Deck deck;

    public FlashcardGenerator(Deck deck) {
        this.deck = deck;
        log.info("Deck Loaded - {} cards", deck.size());
    }

    public static FlashcardGenerator fromCsvFile(String fileName) {
        log.info("Loading Deck from {}", fileName);
        Deck deck = DeckLoader.load(fileName);
        if (deck == null) {
            throw new IllegalArgumentException("Deck could not be loaded");
        }
        return new FlashcardGenerator(deck);
    }

    public File generateFlashcards(String fileName, FlashCardSelector flashCardSelector) throws IOException {
        List<ExcelCard> excelCards = flashCardSelector.selectFrom(deck);
        File outputFile = CardGenerator.generate(fileName, excelCards);
        log.info("Excel document written to {}", outputFile);
        return outputFile;
    }

}
