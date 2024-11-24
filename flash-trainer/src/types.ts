export interface FlashCard {
    [field: string]: string | undefined
}

export interface Deck {
    elements: string[]
    cards: FlashCard[]
}
