import {useState} from "react";
import {FileSelector} from "./FileSelector.tsx";
import {AppBar, Box, Toolbar, Typography} from "@mui/material";
import {Deck} from "./types.ts";
import {Training} from "./Training.tsx";
import {nanoid} from "nanoid";
import {CsvResultList} from "./CsvResultList.tsx";
import {csvTools} from "./csvTools.ts";

interface TrainingConfig {
    key: string,
    deck: Deck,
    front: string
}

export const FlashTrainer = () => {

    const [deck, setDeck] = useState<Deck | undefined>(undefined)
    const [training, setTraining] = useState<TrainingConfig | undefined>(undefined)

    const handleFileSelected = (selectedFile: File) => {
        csvTools.loadDeckFromCsv(selectedFile, (deck) => {
            setDeck(deck)
            setTraining(undefined)
        })
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