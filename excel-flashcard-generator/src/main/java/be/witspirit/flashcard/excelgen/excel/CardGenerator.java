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
    private static final int CARDS_PER_SHEET = 60;

    public static void generate(String outputPath, List<ExcelCard> cards) throws IOException {
        var templateInputStream = new ClassPathResource(TEMPLATE).getInputStream();
        var excelOutputStream = new FileOutputStream(outputPath);
        var sheets = new JxlsRunner.ExcelVariable("pages", splitIntoPages(cards));
        JxlsRunner.generate(templateInputStream, excelOutputStream, List.of(sheets));
    }

    private static List<ExcelCard[]> splitIntoPages(List<ExcelCard> cards) {
        List<ExcelCard[]> pages = new ArrayList<>();
        int totalCards = cards.size();
        int nrOfPages = (totalCards / CARDS_PER_SHEET) + 1;

        // Create pages
        for (int pageIndex = 0; pageIndex < nrOfPages; pageIndex++) {
            ExcelCard[] page = createEmptyPage();
            for (int cardIndex = 0; cardIndex < CARDS_PER_SHEET; cardIndex++) {
                int globalCardIndex = pageIndex * CARDS_PER_SHEET + cardIndex;
                if (globalCardIndex < totalCards) {
                    page[cardIndex] = cards.get(globalCardIndex);
                }
            }
            pages.add(page);
        }

        return pages;
    }

    private static ExcelCard[] createEmptyPage() {
        var emptyPage = new ExcelCard[CARDS_PER_SHEET];
        Arrays.fill(emptyPage, ExcelCard.EMPTY);
        return emptyPage;
    }

}
