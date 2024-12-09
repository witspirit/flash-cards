import {FlashCard} from "./types.ts";
import {useState} from "react";
import {Action, CardFace} from "./CardFace.tsx";

interface TrainingCardProps {
    card: FlashCard
    front: string
    onRight: () => void
    onWrong: () => void
}

export const TrainingCard = ({card, front, onRight, onWrong}: TrainingCardProps) => {

    const [face, setFace] = useState<'front' | 'back'>('front')

    const frontWord = card[front] || '!MISSING!'
    const backWords = Object.keys(card).filter(f => f != front).map(f => card[f] || '!MISSING!')

    const reveal = () => {
        setFace('back')
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
            {name: 'Wrong', trigger: onWrong, color: 'error'}
        ]
    }

    return <CardFace words={words} actions={actions} />
}