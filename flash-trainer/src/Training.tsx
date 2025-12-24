import {CloseRounded} from "@mui/icons-material";
import {Box, Button, Container, IconButton, Stack, Tooltip, Typography} from "@mui/material";
import {useState} from "react";
import {useHotkeys} from "react-hotkeys-hook";
import {CsvResultList} from "./CsvResultList.tsx";
import {TrainingCard} from "./TrainingCard.tsx";
import {TrainingSummary} from "./TrainingSummary.tsx";
import {Deck, deckUtil} from "./types.ts";

interface TitleBarProps {
    title: string
    onClose: () => void
}

const TitleBar = ({title, onClose}: TitleBarProps) => {

    useHotkeys('esc', () => onClose && onClose());

    // I don't understand the positioning system I think... Things just don't seem to naturally align.
    return <Box sx={{margin: '10px', position: 'relative'}}>
        <Typography variant={'h5'} sx={{textAlign: 'center'}}>{title}</Typography>
        {onClose && <Tooltip title='Close (ESC)'><IconButton onClick={onClose} sx={{
            position: 'absolute',
            top: '-6px',
            right: '0px'
        }}><CloseRounded/></IconButton></Tooltip>}
    </Box>
}

interface StatusBarProps {
    correctDeck: Deck
    wrongDeck: Deck
    onShow: (deck: Deck) => void
}

const StatusBar = ({correctDeck, wrongDeck, onShow}: StatusBarProps) => {
    useHotkeys('ctrl+arrowleft', () => onShow(wrongDeck))
    useHotkeys('ctrl+arrowright', () => onShow(correctDeck))

    return <Stack direction={'row'} spacing={'20px'} sx={{width: '100%'}}>
        <Tooltip title='Show Wrong Answers (Ctrl + ←)'>
            <Button variant={'contained'} size={'large'} sx={{flex: 1}} color={'error'}
                    onClick={() => onShow(wrongDeck)}>
                {wrongDeck.cards.length}
            </Button>
        </Tooltip>
        <Tooltip title='Show Correct Answers (Ctrl + →)'>
            <Button variant={'contained'} size={'large'} sx={{flex: 1}} color={'success'}
                    onClick={() => onShow(correctDeck)}>
                {correctDeck.cards.length}
            </Button>
        </Tooltip>
    </Stack>
}


interface TrainingProps {
    deck: Deck
    front: string
    onReset: () => void
    onExit: () => void
}


export const Training = ({deck, front, onReset, onExit}: TrainingProps) => {

    const [cardIndex, setCardIndex] = useState(0)
    const [trainingState, setTrainingState] = useState<'in_progress' | 'done'>('in_progress')
    const [face, setFace] = useState<'front' | 'back'>('front')

    const [correctDeck, setCorrectDeck] = useState<Deck>(deckUtil.empty(deck, `${deck.name}-correct`))
    const [wrongDeck, setWrongDeck] = useState<Deck>(deckUtil.empty(deck, `${deck.name}-wrong`))

    const [displayDeck, setDisplayDeck] = useState<Deck | undefined>(undefined)

    const currentCard = deck.cards[cardIndex]

    const next = () => {
        const nextIndex = cardIndex + 1
        if (nextIndex >= deck.cards.length) {
            setTrainingState('done')
        } else {
            setTrainingState('in_progress')
            setCardIndex(nextIndex)
        }
        setFace('front')
    }

    const reveal = () => {
        setFace('back')
    }

    const back = () => {
        setFace('front')
    }

    const correct = () => {
        setCorrectDeck(deckUtil.addCard(correctDeck, currentCard))
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
        <TitleBar title={`Training ${cardIndex + 1}/${deck.cards.length}`} onClose={onExit}/>
        <Container sx={{flex: 1, alignContent: 'center'}}>
            {trainingState === 'in_progress' ?
                <TrainingCard card={currentCard} front={front} face={face}
                              onReveal={reveal} onBack={back} onCorrect={correct} onWrong={wrong}/>
                :
                <TrainingSummary nrOfRightAnswers={correctDeck.cards.length} nrOfWrongAnswers={wrongDeck.cards.length}
                                 onReset={onReset}/>
            }
        </Container>
        <StatusBar correctDeck={correctDeck} wrongDeck={wrongDeck} onShow={show}/>
    </Stack>
}