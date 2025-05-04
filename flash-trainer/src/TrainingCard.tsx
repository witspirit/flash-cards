import {FlashCard} from "./types.ts";
import {useState} from "react";
import {Action, CardFace} from "./CardFace.tsx";

interface TrainingCardProps {
    card: FlashCard
    front: string
    onRight: () => void
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

export const TrainingCard = ({card, front, onRight, onWrong}: TrainingCardProps) => {

    const [face, setFace] = useState<'front' | 'back'>('front')

    const frontWord = field(front, card)
    const backWords = Object.keys(card).filter(f => f != front).map(f => field(f, card))

    const reveal = () => {
        setFace('back')
    }

    const backToFront = () => {
        setFace('front')
    }

    let words: string[]
    let actions: Action[]
    if (face === 'front') {
        words = [frontWord]
        actions = [{name: 'Reveal', trigger: reveal, color: 'primary'}]
    } else {
        words = backWords
        actions = [
            {name: 'Right', trigger: onRight, color: 'success'},
            {name: 'Show Front', trigger: backToFront, color: 'primary'},
            {name: 'Wrong', trigger: onWrong, color: 'error'}
        ]
    }

    return <CardFace words={words} actions={actions} />
}