import {Deck, deckUtil, FlashCard} from "./types.ts";
import _ from 'underscore';
import {useState} from "react";
import {Box, Button, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import {CsvResultList} from "./CsvResultList.tsx";

interface TrainingProps {
    deck: Deck
    front: string
    onExit: () => void
}

export const Training = ({deck, front, onExit}: TrainingProps) => {

    const [shuffledCards, setShuffledCards] = useState<FlashCard[]>(_.shuffle(deck.cards))
    const [cardIndex, setCardIndex] = useState(0)
    const [face, setFace] = useState<'front' | 'back' | 'done'>('front')
    const [rightDeck, setRightDeck] = useState<Deck>(deckUtil.empty(deck))
    const [wrongDeck, setWrongDeck] = useState<Deck>(deckUtil.empty(deck))
    const [displayDeck, setDisplayDeck] = useState<Deck | undefined>(undefined)

    const currentCard = shuffledCards[cardIndex]

    const frontWord = currentCard[front] || '!MISSING!'
    const backWords = deck.elements.filter(e => e != front).map(e => currentCard[e] || '!MISSING!')

    const reset = () => {
        setShuffledCards(_.shuffle(deck.cards))
        setCardIndex(0)
        setFace('front')
        setRightDeck(deckUtil.empty(deck))
        setWrongDeck(deckUtil.empty(deck))
    }

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


    if (face == 'done') {
        return <Box>
            <Box>
                <List>
                    <ListItem>
                        <ListItemText>Done !</ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemText>You had {rightDeck.cards.length} cards right.</ListItemText>
                        <ListItemButton onClick={() => show(rightDeck)}>Show</ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemText>You had {wrongDeck.cards.length} cards wrong.</ListItemText>
                        <ListItemButton onClick={() => show(wrongDeck)}>Show</ListItemButton>
                    </ListItem>
                </List>
            </Box>
            <Button onClick={reset}>Reset and go again</Button>
            <Button onClick={onExit}>End training</Button>
        </Box>
    }

    if (face === 'front') {
        return <Box>
            <Box>
                <List>
                    <ListItem>
                        <ListItemText>{frontWord}</ListItemText>
                    </ListItem>
                </List>
            </Box>
            <Button onClick={reveal}>Reveal</Button>
        </Box>
    }

    return <Box>
        <Box>
            <List>
                {backWords.map(w =>
                    <ListItem key={w}><ListItemText>{w}</ListItemText></ListItem>
                )}
            </List>
        </Box>
        <Button onClick={right}>Right</Button>
        <Button onClick={wrong}>Wrong</Button>
    </Box>
}