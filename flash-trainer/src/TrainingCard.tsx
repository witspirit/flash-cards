import {Check, Clear, Flip} from "@mui/icons-material";
import {animated, useSpring} from '@react-spring/web';
import {useDrag} from "@use-gesture/react";
import {useHotkeys} from "react-hotkeys-hook";
import {CardFace} from "./CardFace.tsx";
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

const Front = ({word, onReveal}: {word: string, onReveal: () => void}) => {

    useHotkeys('space', onReveal);
    useHotkeys('arrowdown', onReveal);
    useHotkeys('arrowup', onReveal);

    const [{x, y, rot}, api] = useSpring(() => ({
        x: 0,
        y: 0,
        rot: 0,
        config: {tension: 300, friction: 30},
    }));

    const bind = useDrag(({
                              active,
                              movement: [, my],
                              swipe: [, swipeY]
                          }): void => {
            if (active) {
                api.start({
                    x: 0,
                    y: my,
                    rot: 0,
                    immediate: true,
                });
                return
            }

            if (swipeY === -1 || swipeY === 1) { // swipe up/down
                api.start({
                    y: swipeY * 1000,
                    immediate: false,
                    onRest: () => {
                        onReveal();
                        // reset for next card
                        api.set({x: 0, y: 0, rot: 0});
                    }
                })
            } else {
                api.start({x: 0, y: 0, rot: 0});
            }
        },
        {
            pointer: {touch: true}, // enable touch events
            axis: 'y',
            swipe: {
                duration: 1000 // max duration for a swipe
            }
        }
    );

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
        <CardFace words={[word]} actions={[{name: 'Reveal', shortcutHint: '↓', display: <Flip/>, trigger: onReveal, color: 'primary'}]}/>
    </animated.div>
}

const Back = ({words, onBack, onCorrect, onWrong}: { words: string[], onBack: () => void, onCorrect: () => void, onWrong: () => void }) => {

    useHotkeys('space', onBack);
    useHotkeys('arrowdown', onBack);
    useHotkeys('arrowup', onBack);
    useHotkeys('arrowright', onCorrect);
    useHotkeys('arrowleft', onWrong);

    const [{x, y, rot}, api] = useSpring(() => ({
        x: 0,
        y: 0,
        rot: 0,
        config: {tension: 300, friction: 30},
    }));

    const bind = useDrag(({
                              active,
                              movement: [mx, my],
                              swipe: [swipeX, swipeY]
                          }): void => {
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
                        onCorrect();
                        // reset for next card
                        api.set({x: 0, y: 0, rot: 0});
                    },
                });
            } else if (swipeX === -1) { // swipe left
                api.start({
                    x: -1000,
                    rot: -20,
                    immediate: false,
                    onRest: () => {
                        onWrong();
                        // reset for next card
                        api.set({x: 0, y: 0, rot: 0});
                    },
                });
            } else if (swipeY === -1 || swipeY === 1) { // swipe up/down
                api.start({
                    y: swipeY * 1000,
                    immediate: false,
                    onRest: () => {
                        onBack();
                        // reset for next card
                        api.set({x: 0, y: 0, rot: 0});
                    }
                })
            } else {
                api.start({x: 0, y: 0, rot: 0});
            }
        },
        {
            pointer: {touch: true}, // enable touch events
            swipe: {
                duration: 1000 // max duration for a swipe
            }
        }
    );

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
        <CardFace words={words} actions={[
            {name: 'Wrong', shortcutHint: '←', display: <Clear/>, trigger: onWrong, color: 'error'},
            {name: 'Show Front', shortcutHint: '↑', display: <Flip/>, trigger: onBack, color: 'primary'},
            {name: 'Correct', shortcutHint: '→', display: <Check/>, trigger: onCorrect, color: 'success'}
        ]}/>
    </animated.div>
}


export const TrainingCard = ({card, front, face, onReveal, onBack, onCorrect, onWrong}: TrainingCardProps) => {
    if (face === 'front') {
        const frontWord = field(front, card)
        return <Front word={frontWord} onReveal={onReveal} />
    } else {
        const backWords = Object.keys(card).filter(f => f != front).map(f => field(f, card))
        return <Back words={backWords} onWrong={onWrong} onCorrect={onCorrect} onBack={onBack} />
    }
}