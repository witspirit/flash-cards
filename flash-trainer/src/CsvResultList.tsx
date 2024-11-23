import {ParseResult} from "papaparse";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import {FlashCard} from "./types.ts";

interface CsvResultListProps {
    csvResult: ParseResult<FlashCard>
}

export const CsvResultList = ({csvResult}: CsvResultListProps) => {
    const fieldNames = csvResult.meta.fields || ['front', 'back']

    const rows = csvResult.data

    return <TableContainer sx={{maxHeight: '100%'}}>
        <Table stickyHeader={true}>
            <TableHead>
                <TableRow>
                    {fieldNames.map(fieldName =>
                        <TableCell key={fieldName}><Typography
                            fontWeight={'fontWeightBold'}>{fieldName}</Typography></TableCell>
                    )}
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((r, i) =>
                    <TableRow key={i}>
                        {fieldNames.map(fieldName =>
                            <TableCell key={fieldName}>{r[fieldName]}</TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </TableContainer>
}