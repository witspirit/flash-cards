package be.witspirit.flashcard.excelgen.excel;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.core.io.ClassPathResource;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class CardGenerator {

    private static final String TEMPLATE = "flashcard-template.xlsx";

    private static final int CARDS_PER_SHEET = 8;

    public static void generate(String outputPath, List<ExcelCard> cards) throws IOException {
        var templateInputStream = new ClassPathResource(TEMPLATE).getInputStream();
        var excelOutputStream = new FileOutputStream(outputPath);
        var sheets = new JxlsRunner.ExcelVariable("pages", splitIntoSheets(cards));
        JxlsRunner.generate(templateInputStream, excelOutputStream, List.of(sheets));
    }

    private static List<ExcelCard[]> splitIntoSheets(List<ExcelCard> cards) {
        List<ExcelCard[]> sheets = new ArrayList<>();
        int totalCards = cards.size();
        int fullSheets = totalCards / CARDS_PER_SHEET;
        int remainingCards = totalCards % CARDS_PER_SHEET;

        // Create full sheets
        for (int sheetIndex = 0; sheetIndex < fullSheets; sheetIndex++) {
            ExcelCard[] sheet = createEmptySheet();
            for (int cardIndex = 0; cardIndex < CARDS_PER_SHEET; cardIndex++) {
                sheet[cardIndex] = cards.get(sheetIndex * CARDS_PER_SHEET + cardIndex);
            }
            sheets.add(sheet);
        }

        // Handle remaining cards if any
        if (remainingCards > 0) {
            ExcelCard[] lastSheet = createEmptySheet();
            for (int i = 0; i < remainingCards; i++) {
                lastSheet[i] = cards.get(fullSheets * CARDS_PER_SHEET + i);
            }
            sheets.add(lastSheet);
        }

        return sheets;
    }

    private static ExcelCard[] createEmptySheet() {
        var emptySheet = new ExcelCard[CARDS_PER_SHEET];
        Arrays.fill(emptySheet, ExcelCard.EMPTY);
        return emptySheet;
    }

}
