import {Check, Clear, Flip} from "@mui/icons-material";
import {Box} from "@mui/material";
import {useDrag} from "@use-gesture/react";
import {useState} from "react";
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

    const [offset, setOffset] = useState({x: 0, y: 0});

    const bind = useDrag(({movement: [mx, my], active, swipe: [swipeX, swipeY] }): void => {
            if (active) {
                setOffset({x: mx, y: my});
                return
            }

            // gesture ended
            setOffset({x: 0, y: 0});

            console.log(`swipeX: ${swipeX}, swipeY: ${swipeY}`);

            if (swipeX === 1) { // swipe right
                markCorrect();
            }
            if (swipeX === -1) { // swipe left
                markIncorrect();
            }
            if (swipeY === -1 || swipeY === 1) { // swipe up/down
                flip();
            }
        },
        {
            pointer: {touch: true}, // enable touch events
            swipe: {
                duration: 1000 // max duration for a swipe
            }
        }
    );

    const frontWord = field(front, card)
    const backWords = Object.keys(card).filter(f => f != front).map(f => field(f, card))

    let words: string[]
    let actions: Action[]
    if (face === 'front') {
        words = [frontWord]
        actions = [{name: 'Reveal', shortcutHint: '↓', display: <Flip/>, trigger: onReveal, color: 'primary'}]
    } else {
        words = backWords
        actions = [
            {name: 'Wrong', shortcutHint: '←', display: <Clear/>, trigger: onWrong, color: 'error'},
            {name: 'Show Front', shortcutHint: '↑', display: <Flip/>, trigger: onBack, color: 'primary'},
            {name: 'Correct', shortcutHint: '→', display: <Check/>, trigger: onCorrect, color: 'success'}
        ]
    }

    return <Box {...bind()}
                sx={{
                    flex: 1,
                    alignContent: 'center',
                    touchAction: 'none',
                    userSelect: 'none',
                    transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
                    transition: offset.x === 0 && offset.y === 0 ? 'transform 0.2s ease-out' : 'none'
                }}>
        <CardFace words={words} actions={actions}/>
    </Box>
}