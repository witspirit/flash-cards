import {
    Box,
    Button,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {Deck} from "./types.ts";
import {csvTools} from "./csvTools.ts";
import {CloseRounded, FileDownloadRounded, SchoolRounded} from "@mui/icons-material";

interface TrainTermProps {
    term: string,
    onTrain: (term: string) => void
}

const TrainTerm = ({term, onTrain}: TrainTermProps) => {
    // MarginTop 5px is a hack to get the text to center with the icon, experimentally established
    // Issue seems to be tracked via https://github.com/mui/material-ui/issues/19584
    return <Button variant='contained' color='primary' onClick={() => onTrain(term)} endIcon={<SchoolRounded/>}>
        <Typography sx={{marginTop: '5px'}}>{term}</Typography>
    </Button>
}

interface TitleBarProps {
    deck: Deck
    onClose?: () => void
}

const TitleBar = ({deck, onClose}: TitleBarProps) => {
    const download = () => {
        csvTools.downloadDeck(deck)
    }

    return <Stack direction={"row"} sx={{margin: '10px'}}>
        <Typography variant={'h5'} sx={{flex: 1}}>{deck.name}</Typography>
        <IconButton onClick={download}><FileDownloadRounded/></IconButton>
        {onClose && <IconButton onClick={onClose}><CloseRounded/></IconButton>}
    </Stack>
}

interface CsvResultListProps {
    deck: Deck
    onTrain?: (term: string) => void
    onClose?: () => void
}

export const CsvResultList = ({deck, onTrain, onClose}: CsvResultListProps) => {
    const elements = deck.elements
    const cards = deck.cards

    return <Box>
        <TitleBar deck={deck} onClose={onClose} />
        <TableContainer sx={{maxHeight: '100%'}}>
            <Table stickyHeader={true}>
                <TableHead>
                    <TableRow>
                        {elements.map(fieldName =>
                            <TableCell key={fieldName}>
                                {onTrain ?
                                    <TrainTerm term={fieldName} onTrain={onTrain}/>
                                    :
                                    <Typography fontWeight={'fontWeightBold'}>{fieldName}</Typography>
                                }
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