import {Check, Clear, Flip} from "@mui/icons-material";
import {useSpring, animated} from '@react-spring/web';
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

    const [{ x, y, rot }, api] = useSpring(() => ({
        x: 0,
        y: 0,
        rot: 0,
        config: { tension: 300, friction: 30 },
    }));


    const bind = useDrag(({
                              active,
                              movement: [mx, my],
                              swipe: [swipeX, swipeY] }): void => {
            if (active) {
                api.start({
                    x: mx,
                    y: my,
                    rot: mx / 15,
                    immediate: true,
                });
                return
            }

            if (swipeX === 1) { // swipe right
                api.start({
                    x: 1000,
                    rot: 20,
                    immediate: false,
                    onRest: () => {
                        markCorrect();
                        // reset for next card
                        api.set({ x: 0, y: 0, rot: 0 });
                    },
                });
            } else if (swipeX === -1) { // swipe left
                api.start({
                    x: -1000,
                    rot: -20,
                    immediate: false,
                    onRest: () => {
                        markIncorrect();
                        // reset for next card
                        api.set({ x: 0, y: 0, rot: 0 });
                    },
                });
            } else if (swipeY === -1 || swipeY === 1) { // swipe up/down
                flip();
            } else {
                api.start({ x: 0, y: 0, rot: 0 });
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

    return <animated.div {...bind()}
                style={{
                    x,
                    y,
                    rotateZ: rot,
                    flex: 1,
                    alignContent: 'center',
                    touchAction: 'none',
                    userSelect: 'none',
                }}>
        <CardFace words={words} actions={actions}/>
    </animated.div>
}