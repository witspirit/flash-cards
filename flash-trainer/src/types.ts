export interface FlashCard {
    [field: string]: string | undefined
}

export interface Deck {
    name: string
    elements: string[]
    cards: FlashCard[]
}

const empty = (refDeck: Deck, newName?: string): Deck => ({
    name: newName ?? refDeck.name,
    elements: refDeck.elements,
    cards: []
})
const addCard = (deck: Deck, card: FlashCard): Deck => ({...deck, cards: [...deck.cards, card]})

export const deckUtil = {
    empty,
    addCard
}