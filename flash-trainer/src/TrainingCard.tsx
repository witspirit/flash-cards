import {FlashCard} from "./types.ts";
import {useState} from "react";
import {Box, Button, List, ListItem, ListItemText} from "@mui/material";

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

    if (face === 'front') {
        return <Box>
            <Box>
                <List>
                    <ListItem>
                        <ListItemText>{frontWord}</ListItemText>
                    </ListItem>
                </List>
            </Box>
            <Button onClick={reveal}>Reveal</Button>
        </Box>
    }

    return <Box>
        <Box>
            <List>
                {backWords.map(w =>
                    <ListItem key={w}><ListItemText>{w}</ListItemText></ListItem>
                )}
            </List>
        </Box>
        <Button onClick={onRight}>Right</Button>
        <Button onClick={onWrong}>Wrong</Button>
    </Box>
}