import Papa, {ParseResult} from "papaparse";
import {useState} from "react";
import {FileSelector} from "./FileSelector.tsx";
import {AppBar, Box, Button, Toolbar, Typography} from "@mui/material";
import {FlashCard} from "./types.ts";
import {CsvResultList} from "./CsvResultList.tsx";

export const FlashTrainer = () => {

    const [csvData, setCsvData] = useState<ParseResult<FlashCard> | undefined>(undefined)

    const handleCsvData = (csvResults: ParseResult<FlashCard>) => {
        setCsvData(csvResults)
    }

    const handleCsvUpload = (selectedFile: File) => {
        Papa.parse<FlashCard>(selectedFile, {
            header: true,
            complete: handleCsvData
        })
    }

    const handleCsvDownload = () => {
        console.log('handleCsvDownload');
    }

    return <Box sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
        <AppBar position={'static'}>
            <Toolbar>
                <Typography variant={'h6'} sx={{flexGrow: 1}}>FlashCard Trainer</Typography>
                <FileSelector onFileSelected={handleCsvUpload}/>
            </Toolbar>
        </AppBar>
        <Box sx={{flexGrow: 1, overflow: 'scroll'}}>
            {csvData ? <CsvResultList csvResult={csvData}/> :
                <Box sx={{height: '100%', textAlign: 'center', alignContent: 'center'}}><Typography variant={'h3'}>No
                    flash cards loaded</Typography></Box>}
        </Box>

        <Button onClick={handleCsvDownload}>Download output CSV</Button>
    </Box>

}