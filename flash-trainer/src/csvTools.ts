import Papa, {ParseResult} from "papaparse";
import {format} from "date-fns";
import {Deck, FlashCard} from "./types.ts";

const toDeck = (name: string, parseResult: ParseResult<FlashCard>) : Deck => {
    return {
        name,
        elements: parseResult.meta.fields || ['front', 'back'], // This front/back should never happen. We are not equipped to deal with that scenario.
        cards: parseResult.data
    }
}

const loadDeckFromCsv = (csvFile: File, onLoaded: (deck: Deck) => void) => {
    const name = csvFile.name.replace('.csv', '')
    Papa.parse<FlashCard>(csvFile, {
        header: true,
        skipEmptyLines: true,
        transform: (value: string) => value.trim(),
        complete: (csvResults: ParseResult<FlashCard>) => onLoaded(toDeck(name, csvResults))
    })
}


const createBlob = (content: string, mimeType = '') => {
    return new Blob([content], { type: mimeType })
}

const downloadBlob = (blob: Blob, fileName = '') => {
    const url = URL.createObjectURL(blob)

    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = fileName

    anchor.click()

    // revoke the object URL to free memory
    // this can be done even if the download has not yet finished
    // because the url is copied once it is assigned to the <a> element
    // in the past this was an issue in Firefox (https://bugzilla.mozilla.org/show_bug.cgi?id=1282407)
    // not clear if this has been solved in the meantime
    URL.revokeObjectURL(url)
}

const downloadString = (content: string, fileName: string, mimeType: string) => {
    const blob = createBlob(content, mimeType)
    downloadBlob(blob, fileName)
}

const downloadDeck = (deck: Deck) => {
    const flashCards = deck.cards
    const csv = Papa.unparse(flashCards)
    downloadString(csv, `${deck.name}-${format(new Date(), 'yyyyLLdd-HHmm')}`, 'text/csv')
}


export const csvTools = {
    loadDeckFromCsv,
    downloadDeck
}