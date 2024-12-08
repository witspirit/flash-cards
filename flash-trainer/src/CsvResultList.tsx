import {Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import {Deck} from "./types.ts";
import {csvTools} from "./csvTools.ts";

interface CsvResultListProps {
    deck: Deck
    onTerm?: (term: string) => void
    onClose?: () => void
}

export const CsvResultList = ({deck, onTerm, onClose}: CsvResultListProps) => {
    const elements = deck.elements

    const cards = deck.cards

    const download = () => {
        csvTools.downloadDeck(deck)
    }

    return <Box>
        {onClose && <Button onClick={onClose}>Close</Button>}
        <Button onClick={download}>Download</Button>
        <TableContainer sx={{maxHeight: '100%'}}>
            <Table stickyHeader={true}>
                <TableHead>
                    <TableRow>
                        {elements.map(fieldName =>
                            <TableCell key={fieldName}>
                                <Typography fontWeight={'fontWeightBold'}>{fieldName}</Typography>
                                {onTerm && <Button onClick={() => onTerm(fieldName)} >Train</Button>}
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