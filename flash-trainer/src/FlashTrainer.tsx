import Papa, {ParseResult} from "papaparse";
import {useState} from "react";
import {FileSelector} from "./FileSelector.tsx";
import {AppBar, Box, Button, Toolbar, Typography} from "@mui/material";
import {Deck, FlashCard} from "./types.ts";
import {Training} from "./Training.tsx";
import {nanoid} from "nanoid";

const toDeck = (parseResult: ParseResult<FlashCard>) : Deck => {
    return {
        elements: parseResult.meta.fields || ['front', 'back'], // This front/back should never happen. We are not equipped to deal with that scenario.
        cards: parseResult.data
    }
}

export const FlashTrainer = () => {

    const [deck, setDeck] = useState<Deck | undefined>(undefined)
    const [trainingId, setTrainingId] = useState(nanoid())

    const handleCsvParseResult = (csvResults: ParseResult<FlashCard>) => {
        setDeck(toDeck(csvResults))
        setTrainingId(nanoid())
    }

    const handleFileSelected = (selectedFile: File) => {
        Papa.parse<FlashCard>(selectedFile, {
            header: true,
            skipEmptyLines: true,
            complete: handleCsvParseResult
        })
    }

    const handleRight = (card: FlashCard) => {
        console.log(`Right: ${JSON.stringify(card)}`)
    }

    const handleWrong = (card: FlashCard) => {
        console.log(`Wrong: ${JSON.stringify(card)}`)
    }

    const handleCsvDownload = () => {
        console.log('handleCsvDownload');
    }

    return <Box sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
        <AppBar position={'static'}>
            <Toolbar>
                <Typography variant={'h6'} sx={{flexGrow: 1}}>FlashCard Trainer</Typography>
                <FileSelector onFileSelected={handleFileSelected}/>
            </Toolbar>
        </AppBar>
        <Box sx={{flexGrow: 1, overflow: 'scroll'}}>
            {deck ?
                // <CsvResultList deck={deck}/>
                <Training key={trainingId} deck={deck} front={deck.elements[0]} onRight={handleRight} onWrong={handleWrong}/>
                :
                <Box sx={{height: '100%', textAlign: 'center', alignContent: 'center'}}><Typography variant={'h3'}>No
                    flash cards loaded</Typography></Box>}
        </Box>

        <Button onClick={handleCsvDownload}>Download output CSV</Button>
    </Box>

}