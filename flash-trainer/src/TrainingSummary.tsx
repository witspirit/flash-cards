import {useHotkeys} from "react-hotkeys-hook";
import {Action, CardFace} from "./CardFace.tsx";

interface TrainingSummaryProps {
    nrOfRightAnswers: number
    nrOfWrongAnswers: number
    onReset: () => void
}

export const TrainingSummary = ({nrOfRightAnswers, nrOfWrongAnswers, onReset}: TrainingSummaryProps) => {

    useHotkeys('space', onReset)

    const words = [
        'Done !',
        `You had ${nrOfRightAnswers} cards right.`,
        `You had ${nrOfWrongAnswers} cards wrong.`
    ]
    const actions: Action[] = [{name: 'Reset and go again', trigger: onReset, color: 'primary'}]

    return <CardFace words={words} actions={actions} />

}