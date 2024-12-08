import Papa, {ParseResult} from "papaparse";
import {useState} from "react";
import {FileSelector} from "./FileSelector.tsx";
import {AppBar, Box, Toolbar, Typography} from "@mui/material";
import {Deck, FlashCard} from "./types.ts";
import {Training} from "./Training.tsx";
import {nanoid} from "nanoid";
import {CsvResultList} from "./CsvResultList.tsx";

const toDeck = (parseResult: ParseResult<FlashCard>) : Deck => {
    return {
        elements: parseResult.meta.fields || ['front', 'back'], // This front/back should never happen. We are not equipped to deal with that scenario.
        cards: parseResult.data
    }
}

interface TrainingConfig {
    key: string,
    deck: Deck,
    front: string
}

export const FlashTrainer = () => {

    const [deck, setDeck] = useState<Deck | undefined>(undefined)
    const [training, setTraining] = useState<TrainingConfig | undefined>(undefined)

    const handleCsvParseResult = (csvResults: ParseResult<FlashCard>) => {
        setDeck(toDeck(csvResults))
    }

    const handleFileSelected = (selectedFile: File) => {
        Papa.parse<FlashCard>(selectedFile, {
            header: true,
            skipEmptyLines: true,
            complete: handleCsvParseResult
        })
    }

    const handleCsvDownload = () => {
        console.log('handleCsvDownload')
    }

    const startTraining = (term: string) => {
        setTraining({
            key: nanoid(),
            deck: deck!,
            front: term
        })
    }

    const exitTraining = () => {
        setTraining(undefined)
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
                training ? <Training {...training} onExit={exitTraining}/>
                    : <CsvResultList deck={deck} onTerm={startTraining}/>
                :
                <Box sx={{height: '100%', textAlign: 'center', alignContent: 'center'}}><Typography variant={'h3'}>No
                    flash cards loaded</Typography></Box>}
        </Box>
    </Box>

}