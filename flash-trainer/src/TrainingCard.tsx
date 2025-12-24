import {Box} from "@mui/material";
import {useDrag} from "@use-gesture/react";
import {useHotkeys} from "react-hotkeys-hook";
import {Action, CardFace} from "./CardFace.tsx";
import {FlashCard} from "./types.ts";

interface TrainingCardProps {
    card: FlashCard
    front: string
    face: 'front' | 'back'
    onReveal: () => void
    onBack: () => void
    onCorrect: () => void
    onWrong: () => void
}

const field = (name: string, card: FlashCard) => {
    let fallback = '!MISSING[' + name + ']!'
    if (name.startsWith('(')) {
        // Don't report on optional fields
        fallback = ''
    }

    return card[name] || fallback
}

export const TrainingCard = ({card, front, face, onReveal, onBack, onCorrect, onWrong}: TrainingCardProps) => {

    const flip = () => {
        if (face === 'front') {
            onReveal()
        } else {
            onBack()
        }
    }

    const markCorrect = () => {
        if (face === 'back') {
            onCorrect()
        }
    }

    const markIncorrect = () => {
        if (face === 'back') {
            onWrong()
        }
    }

    useHotkeys('space', flip);
    useHotkeys('arrowdown', onReveal);
    useHotkeys('arrowup', onBack);
    useHotkeys('arrowright', markCorrect);
    useHotkeys('arrowleft', markIncorrect);

    const bind = useDrag(({swipe: [swipeX, swipeY], event}): void => {
            event.preventDefault();

            if (swipeX === 1) { // swipe right
                markCorrect();
            }
            if (swipeX === -1) { // swipe left
                markIncorrect();
            }
            if (swipeY === -1) { // swipe up
                onReveal();
            }
            if (swipeY === 1) { // swipe down
                onBack();
            }
        },
        {}
    );

    const frontWord = field(front, card)
    const backWords = Object.keys(card).filter(f => f != front).map(f => field(f, card))

    let words: string[]
    let actions: Action[]
    if (face === 'front') {
        words = [frontWord]
        actions = [{name: 'Reveal', shortcutHint: '↓', trigger: onReveal, color: 'primary'}]
    } else {
        words = backWords
        actions = [
            {name: 'Wrong', shortcutHint: '←', trigger: onWrong, color: 'error'},
            {name: 'Show Front', shortcutHint: '↑', trigger: onBack, color: 'primary'},
            {name: 'Correct', shortcutHint: '→', trigger: onCorrect, color: 'success'}
        ]
    }

    return <Box {...bind()} sx={{flex: 1, alignContent: 'center', touchAction: 'none', userSelect: 'none'}}>
        <CardFace words={words} actions={actions}/>
    </Box>
}