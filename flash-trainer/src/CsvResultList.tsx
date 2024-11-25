import {Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import {Deck} from "./types.ts";

interface CsvResultListProps {
    deck: Deck
    onClose: () => void
}

export const CsvResultList = ({deck, onClose}: CsvResultListProps) => {
    const elements = deck.elements

    const cards = deck.cards

    return <Box>
        <Button onClick={onClose}>Close</Button>
        <TableContainer sx={{maxHeight: '100%'}}>
            <Table stickyHeader={true}>
                <TableHead>
                    <TableRow>
                        {elements.map(fieldName =>
                            <TableCell key={fieldName}>
                                <Typography fontWeight={'fontWeightBold'}>{fieldName}</Typography>
                            </TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cards.map((r, i) =>
                        <TableRow key={i}>
                            {elements.map(fieldName =>
                                <TableCell key={fieldName}>{r[fieldName]}</TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    </Box>
}