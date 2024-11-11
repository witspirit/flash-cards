package be.witspirit.flashcard.excelgen;

import be.witspirit.flashcard.excelgen.card.Card;
import be.witspirit.flashcard.excelgen.card.Deck;
import be.witspirit.flashcard.excelgen.csv.DeckLoader;
import be.witspirit.flashcard.excelgen.excel.CardGenerator;
import be.witspirit.flashcard.excelgen.excel.ExcelCard;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.List;
import java.util.function.Function;

@SpringBootApplication
public class ExcelFlashcardGeneratorApplication implements CommandLineRunner {

    public static void main(String[] args) {
        SpringApplication.run(ExcelFlashcardGeneratorApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        if (args.length != 2) {
            System.err.println("Expecting 2 arguments: <input-csv> <output-excel>");
            return;
        }

        String inputCsv = args[0];
        String outputExcel = args[1];

        System.out.printf("Generating Flash Card Excel at %s from data at %s%n", outputExcel, inputCsv);

        Deck deck = DeckLoader.load(inputCsv);
        if (deck == null) {
            System.err.println("Deck could not be loaded");
            return;
        }
        System.out.printf("Deck Loaded - %d cards%n", deck.size());

        List<ExcelCard> excelCards = selectExcelCards(deck);
        CardGenerator.generate(outputExcel, excelCards);
    }

    private List<ExcelCard> selectExcelCards(Deck deck) {
        Function<Card, String> frontSupplier = c -> c.getElement(deck.elements().get(0));
        Function<Card, String> backPrimarySupplier = c -> c.getElement(deck.elements().get(1));
        Function<Card, String> backSecondarySupplier = deck.elements().size() > 2 ? c -> c.getElement(deck.elements().get(2)) : c -> "";

        return deck.cards().stream().map(c -> ExcelCard.builder()
                        .front(frontSupplier.apply(c))
                        .backPrimary(backPrimarySupplier.apply(c))
                        .backSecondary(backSecondarySupplier.apply(c))
                        .build()
                )
                .toList();
    }
}
