import {Deck} from "./types.ts";
import {Action, CardFace} from "./CardFace.tsx";

interface TrainingSummaryProps {
    rightDeck: Deck
    wrongDeck: Deck
    onReset: () => void
}

export const TrainingSummary = ({rightDeck, wrongDeck, onReset}: TrainingSummaryProps) => {
    const words = [
        'Done !',
        `You had ${rightDeck.cards.length} cards right.`,
        `You had ${wrongDeck.cards.length} cards wrong.`
    ]
    const actions: Action[] = [{name: 'Reset and go again', trigger: onReset, color: 'primary'}]

    return <CardFace words={words} actions={actions} />

}