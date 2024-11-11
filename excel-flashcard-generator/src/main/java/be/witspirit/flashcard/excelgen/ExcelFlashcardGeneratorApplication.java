package be.witspirit.flashcard.excelgen;

import be.witspirit.flashcard.excelgen.card.Card;
import be.witspirit.flashcard.excelgen.card.Deck;
import be.witspirit.flashcard.excelgen.card.DeckExtractors;
import be.witspirit.flashcard.excelgen.csv.DeckLoader;
import be.witspirit.flashcard.excelgen.excel.CardGenerator;
import be.witspirit.flashcard.excelgen.excel.ExcelCard;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;
import java.util.List;
import java.util.function.Function;

@SpringBootApplication
@Slf4j
public class ExcelFlashcardGeneratorApplication implements CommandLineRunner {

    public static void main(String[] args) {
        SpringApplication.run(ExcelFlashcardGeneratorApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        if (args.length != 2) {
            log.error("Expecting 2 arguments: <input-csv> <output-excel>");
            return;
        }

        String inputCsv = args[0];
        String outputExcel = args[1];

        log.info("Generating Flash Card Excel at {} from data at {}", outputExcel, inputCsv);

        Deck deck = DeckLoader.load(inputCsv);
        if (deck == null) {
            log.error("Deck could not be loaded");
            return;
        }
        log.info("Deck Loaded - {} cards", deck.size());

        List<ExcelCard> excelCards = selectExcelCards(deck);
        File outputFile = CardGenerator.generate(outputExcel, excelCards);
        log.info("Excel document written to {}", outputFile);
    }

    private List<ExcelCard> selectExcelCards(Deck deck) {
        DeckExtractors extract = deck.extractors();
        Function<Card, String> frontSupplier = extract.index(0);
        Function<Card, String> backPrimarySupplier = extract.index(1);
        Function<Card, String> backSecondarySupplier = extract.index(2);

        return deck.cards().stream().map(c -> ExcelCard.builder()
                        .front(frontSupplier.apply(c))
                        .backPrimary(backPrimarySupplier.apply(c))
                        .backSecondary(backSecondarySupplier.apply(c))
                        .build()
                )
                .toList();
    }
}
