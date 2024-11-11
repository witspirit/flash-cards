package be.witspirit.flashcard.excelgen;

import org.junit.jupiter.api.Test;

class ExcelFlashcardGeneratorApplicationTests {

	@Test
	void sampleGeneration() {
		ExcelFlashcardGeneratorApplication.main(new String[] { "src/test/resources/sample-csv/sample-deck.csv", "build/generation-test.xlsx" });
	}

	@Test
	void feedbackOnNoParams() {
		ExcelFlashcardGeneratorApplication.main(new String[0]);
	}

}
