import {Deck, FlashCard} from "./types.ts";
import _ from 'underscore';
import {useState} from "react";
import {Box, Button, List, ListItem, ListItemText} from "@mui/material";

interface TrainingProps {
    deck: Deck
    front: string
    onRight: (card: FlashCard) => void
    onWrong: (card: FlashCard) => void
}

export const Training = ({deck, front, onRight, onWrong}: TrainingProps) => {
    const shuffledCards = _.shuffle(deck.cards)

    const [cardIndex, setCardIndex] = useState(0)
    const [face, setFace] = useState<'front' | 'back' | 'done'>('front')

    const currentCard = shuffledCards[cardIndex]

    const frontWord = currentCard[front] || '!MISSING!'
    const backWords = deck.elements.filter(e => e != front).map(e => currentCard[e] || '!MISSING!')

    const reveal = () => {
        setFace('back')
    }

    const next = () => {
        const nextIndex = cardIndex + 1
        if (nextIndex >= shuffledCards.length) {
            setFace('done')
        } else {
            setFace('front')
            setCardIndex(nextIndex)
        }
    }

    const right = () => {
        onRight(currentCard)
        next()
    }

    const wrong = () => {
        onWrong(currentCard)
        next()
    }

    if (face == 'done') {
        return <Box>
            Done!
        </Box>
    }

    if (face === 'front') {
        return <Box>
            <Box>{frontWord}</Box>
            <Button onClick={reveal}>Reveal</Button>
        </Box>
    }

    return <Box>
        <Box>
            <List>
                {backWords.map(w => <ListItem key={w}><ListItemText>{w}</ListItemText></ListItem>)}
            </List>
        </Box>
        <Button onClick={right}>Right</Button>
        <Button onClick={wrong}>Wrong</Button>
    </Box>
}