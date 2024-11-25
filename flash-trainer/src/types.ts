export interface FlashCard {
    [field: string]: string | undefined
}

export interface Deck {
    elements: string[]
    cards: FlashCard[]
}

const empty = (refDeck: Deck) : Deck => ({ elements: refDeck.elements, cards: []})
const addCard = (deck: Deck, card: FlashCard): Deck => ({ ...deck, cards: [...deck.cards, card]})

export const deckUtil = {
    empty,
    addCard
}