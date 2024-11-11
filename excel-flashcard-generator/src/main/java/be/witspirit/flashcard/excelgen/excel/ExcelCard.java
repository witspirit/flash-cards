package be.witspirit.flashcard.excelgen.excel;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ExcelCard {
    public static final ExcelCard EMPTY = ExcelCard.builder().build();

    @Builder.Default
    String front = "";
    @Builder.Default
    String backPrimary = "";
    @Builder.Default
    String backSecondary = "";
}
