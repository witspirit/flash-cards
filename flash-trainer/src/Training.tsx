import {Deck, deckUtil, FlashCard} from "./types.ts";
import _ from 'underscore';
import {useState} from "react";
import {Button, Container, IconButton, Stack, Typography} from "@mui/material";
import {CsvResultList} from "./CsvResultList.tsx";
import {TrainingCard} from "./TrainingCard.tsx";
import {TrainingSummary} from "./TrainingSummary.tsx";
import {CloseRounded} from "@mui/icons-material";

interface TitleBarProps {
    title: string
    onClose: () => void
}

const TitleBar = ({title, onClose}: TitleBarProps) => {
    return <Stack direction={"row"} sx={{margin: '10px'}}>
        <Typography variant={'h5'} sx={{flex: 1}}>{title}</Typography>
        {onClose && <IconButton onClick={onClose}><CloseRounded/></IconButton>}
    </Stack>
}

interface StatusBarProps {
    rightDeck: Deck
    wrongDeck: Deck
    onShow: (deck: Deck) => void
}

const StatusBar = ({rightDeck, wrongDeck, onShow}: StatusBarProps) => {
    return <Stack direction={'row'} spacing={'20px'} sx={{width: '100%'}}>
        <Button variant={'contained'} size={'large'} sx={{flex: 1}} color={'success'}
                onClick={() => onShow(rightDeck)}>
            {rightDeck.cards.length}
        </Button>
        <Button variant={'contained'} size={'large'} sx={{flex: 1}} color={'error'}
                onClick={() => onShow(wrongDeck)}>
            {wrongDeck.cards.length}
        </Button>
    </Stack>
}


interface TrainingProps {
    deck: Deck
    front: string
    onExit: () => void
}

export const Training = ({deck, front, onExit}: TrainingProps) => {

    const [shuffledCards, setShuffledCards] = useState<FlashCard[]>(_.shuffle(deck.cards))
    const [cardIndex, setCardIndex] = useState(0)
    const [face, setFace] = useState<'card' | 'done'>('card')
    const [rightDeck, setRightDeck] = useState<Deck>(deckUtil.empty(deck, `${deck.name}-correct`))
    const [wrongDeck, setWrongDeck] = useState<Deck>(deckUtil.empty(deck, `${deck.name}-wrong`))
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

    return <Stack sx={{height: '100%'}}>
        <TitleBar title={`Training ${cardIndex + 1}/${shuffledCards.length}`} onClose={onExit}/>
        <Container sx={{flex: 1, alignContent: 'center'}}>
            {face === 'card' ?
                <TrainingCard key={currentCard[front]} card={currentCard} front={front} onRight={right}
                              onWrong={wrong}/>
                :
                <TrainingSummary rightDeck={rightDeck} wrongDeck={wrongDeck} onShow={show} onReset={reset}/>
            }
        </Container>
        <StatusBar rightDeck={rightDeck} wrongDeck={wrongDeck} onShow={show}/>
    </Stack>
}