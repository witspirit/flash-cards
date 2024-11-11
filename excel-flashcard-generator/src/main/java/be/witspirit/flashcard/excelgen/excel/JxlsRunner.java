/*
 * Copyright 2019 Hysopt NV. All Rights Reserved.
 */

package be.witspirit.flashcard.excelgen.excel;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.jxls.builder.JxlsStreaming;
import org.jxls.transform.poi.JxlsPoi;

import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class JxlsRunner {

    public record ExcelVariable(String name, Object value)  {}

    public static void generate(InputStream templateInputStream, OutputStream outputStream, List<ExcelVariable> variables) {
        Map<String, Object> context = variables.stream().collect(Collectors.toMap(ExcelVariable::name, ExcelVariable::value));
        JxlsPoi.fill(templateInputStream, JxlsStreaming.STREAMING_OFF, context, outputStream);
    }

}
