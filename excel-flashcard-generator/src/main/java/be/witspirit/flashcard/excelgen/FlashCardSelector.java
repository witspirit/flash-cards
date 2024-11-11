package be.witspirit.flashcard.excelgen;

import be.witspirit.flashcard.excelgen.FlashCardSelector.Selector.Index;
import be.witspirit.flashcard.excelgen.card.Card;
import be.witspirit.flashcard.excelgen.card.Deck;
import be.witspirit.flashcard.excelgen.card.DeckExtractors;
import be.witspirit.flashcard.excelgen.excel.ExcelCard;
import lombok.Value;
import lombok.With;

import java.util.List;
import java.util.function.Function;

@Value
@With
public class FlashCardSelector {
    public static final FlashCardSelector DEFAULT = new FlashCardSelector();

    Selector frontSelector = new Index(0);
    Selector backPrimarySelector = new Index(1);
    Selector backSecondarySelector = new Index(2);

    public List<ExcelCard> selectFrom(Deck deck) {
        DeckExtractors extract = deck.extractors();

        var frontSupplier = frontSelector.apply(extract);
        var backPrimarySupplier = backPrimarySelector.apply(extract);
        var backSecondarySupplier = backSecondarySelector.apply(extract);

        return deck.cards().stream().map(c -> ExcelCard.builder()
                        .front(frontSupplier.apply(c))
                        .backPrimary(backPrimarySupplier.apply(c))
                        .backSecondary(backSecondarySupplier.apply(c))
                        .build()
                )
                .toList();
    }

    public sealed interface Selector extends Function<DeckExtractors, Function<Card, String>> {

        record Index(int columnIndex) implements Selector {
            @Override
            public Function<Card, String> apply(DeckExtractors deckExtractors) {
                return deckExtractors.index(columnIndex);
            }
        }

        record Name(String columnName) implements Selector {
            @Override
            public Function<Card, String> apply(DeckExtractors deckExtractors) {
                return deckExtractors.name(columnName);
            }
        }
    }

}
