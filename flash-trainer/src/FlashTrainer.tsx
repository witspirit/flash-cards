import {useState} from "react";
import {FileSelector} from "./FileSelector.tsx";
import {AppBar, Box, FormControlLabel, Switch, Toolbar, Typography} from "@mui/material";
import {Deck} from "./types.ts";
import {Training} from "./Training.tsx";
import {nanoid} from "nanoid";
import {CsvResultList} from "./CsvResultList.tsx";
import {csvTools} from "./csvTools.ts";

interface TrainingConfig {
    key: string,
    deck: Deck,
    front: string
    shuffle: boolean
}

export const FlashTrainer = () => {

    const [deck, setDeck] = useState<Deck | undefined>(undefined)
    const [training, setTraining] = useState<TrainingConfig | undefined>(undefined)
    const [performShuffle, setPerformShuffle] = useState(false)

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
            front: term,
            shuffle: performShuffle
        })
    }

    const exitTraining = () => {
        setTraining(undefined)
    }

    return <Box sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
        <AppBar position={'static'}>
            <Toolbar sx={{gap: '10px'}}>
                <Typography variant={'h6'} sx={{flexGrow: 1}}>FlashCard Trainer</Typography>
                <FormControlLabel label="Shuffle" labelPlacement='start' control={<Switch checked={performShuffle} onChange={() => setPerformShuffle((prev) => !prev)} color='secondary'/>} />
                <FileSelector onFileSelected={handleFileSelected}/>
            </Toolbar>
        </AppBar>
        <Box sx={{flexGrow: 1, overflow: 'scroll'}}>
            {deck ?
                training ? <Training {...training} onExit={exitTraining}/>
                    : <CsvResultList deck={deck} onTrain={startTraining}/>
                :
                <Box sx={{height: '100%', textAlign: 'center', alignContent: 'center'}}><Typography variant={'h3'}>No
                    flash cards loaded</Typography></Box>}
        </Box>
    </Box>

}