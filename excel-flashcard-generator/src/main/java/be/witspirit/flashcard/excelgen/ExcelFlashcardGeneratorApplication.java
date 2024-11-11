package be.witspirit.flashcard.excelgen;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

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

        FlashcardGenerator generator = FlashcardGenerator.fromCsvFile(inputCsv);
        generator.generateFlashcards(outputExcel, FlashCardSelector.DEFAULT);
    }

}
