import Papa, {ParseResult} from "papaparse";
import {FormEvent, useState} from "react";

interface FlashCard {
    [field: string]: string | undefined
}

interface DataRowProps {
    fieldNames: string[]
    row: FlashCard
}

const DataRow = ({ fieldNames, row } : DataRowProps) => {
    return <div>
        {fieldNames.map(fieldName => <div key={fieldName}>{row[fieldName]}</div>)}
    </div>
}

interface CsvResultListProps {
    csvResult: ParseResult<FlashCard>
}

const CsvResultList = ({ csvResult }: CsvResultListProps) => {
    const fieldNames = csvResult.meta.fields || ['front', 'back']

    const rows = csvResult.data

    return <div>
        {fieldNames.map(fieldName => <div key={fieldName}>{fieldName}</div>)}
        {rows.map((r, index) => <DataRow key={index} fieldNames={fieldNames} row={r}/> )}
    </div>
}

export const FlashTrainer = () => {

    const [csvData, setCsvData] = useState<ParseResult<FlashCard> | undefined>(undefined)

    const handleCsvData = (csvResults: ParseResult<FlashCard>) => {
        setCsvData(csvResults)
    }

    const handleCsvUpload = (event: FormEvent<HTMLInputElement>) => {
        const files = event.currentTarget.files
        if (files && files.length > 0) {
            const file = files[0]

            Papa.parse<FlashCard>(file, {
                header: true,
                complete: handleCsvData
            })
        }
    }

    const handleCsvDownload = () => {
        console.log('handleCsvDownload');
    }

    return <div>
        <label>Input file</label>
        <input type='file' accept={'.csv'} onChange={handleCsvUpload}/>

        <button onClick={handleCsvDownload}>Download output CSV</button>

        <hr/>

        {csvData ? <CsvResultList csvResult={csvData}/> : <label>No data loaded</label>}
    </div>
}