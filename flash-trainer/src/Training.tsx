import {Deck, deckUtil, FlashCard} from "./types.ts";
import _ from 'underscore';
import {useState} from "react";
import {Box, Button} from "@mui/material";
import {CsvResultList} from "./CsvResultList.tsx";
import {TrainingCard} from "./TrainingCard.tsx";
import {TrainingSummary} from "./TrainingSummary.tsx";

interface TrainingProps {
    deck: Deck
    front: string
    onExit: () => void
}

export const Training = ({deck, front, onExit}: TrainingProps) => {

    const [shuffledCards, setShuffledCards] = useState<FlashCard[]>(_.shuffle(deck.cards))
    const [cardIndex, setCardIndex] = useState(0)
    const [face, setFace] = useState<'card' | 'done'>('card')
    const [rightDeck, setRightDeck] = useState<Deck>(deckUtil.empty(deck))
    const [wrongDeck, setWrongDeck] = useState<Deck>(deckUtil.empty(deck))
    const [displayDeck, setDisplayDeck] = useState<Deck | undefined>(undefined)

    const currentCard = shuffledCards[cardIndex]

    const reset = () => {
        setShuffledCards(_.shuffle(deck.cards))
        setCardIndex(0)
        setFace('card')
        setRightDeck(deckUtil.empty(deck))
        setWrongDeck(deckUtil.empty(deck))
    }

    const next = () => {
        const nextIndex = cardIndex + 1
        if (nextIndex >= shuffledCards.length) {
            setFace('done')
        } else {
            setFace('card')
            setCardIndex(nextIndex)
        }
    }

    const right = () => {
        setRightDeck(deckUtil.addCard(rightDeck, currentCard))
        next()
    }

    const wrong = () => {
        setWrongDeck(deckUtil.addCard(wrongDeck, currentCard))
        next()
    }

    const show = (deck: Deck) => {
        setDisplayDeck(deck)
    }

    const hideList = () => {
        setDisplayDeck(undefined)
    }

    if (displayDeck) {
        return <CsvResultList deck={displayDeck} onClose={hideList}/>
    }

    return <Box>
        <Button onClick={onExit}>End training</Button>
        {face === 'card' ?
            <TrainingCard key={currentCard[front]} card={currentCard} front={front} onRight={right} onWrong={wrong}/>
            :
            <TrainingSummary rightDeck={rightDeck} wrongDeck={wrongDeck} onShow={show} onReset={reset}/>
        }
        <Button variant={'contained'} onClick={() => show(rightDeck)} color={'success'}>{rightDeck.cards.length}</Button>
        <Button variant={'contained'} onClick={() => show(wrongDeck)} color={'error'}>{wrongDeck.cards.length}</Button>
    </Box>
}