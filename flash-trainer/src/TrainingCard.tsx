import {FlashCard} from "./types.ts";
import {useState} from "react";
import {Button, Card, CardActions, CardContent, List, ListItem, ListItemText} from "@mui/material";

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
        return <Card sx={{minHeight: '50%'}}>
            <CardContent sx={{flex: 1}}>
                <List>
                    <ListItem>
                        <ListItemText sx={{textAlign: 'center'}}>{frontWord}</ListItemText>
                    </ListItem>
                </List>
            </CardContent>
            <CardActions sx={{justifyContent: 'center'}}>
                <Button onClick={reveal} color={'primary'} variant={'contained'}>Reveal</Button>
            </CardActions>
        </Card>
    }

    return <Card sx={{minHeight: '50%'}}>
        <CardContent sx={{flex: 1}}>
            <List>
                {backWords.map(w =>
                    <ListItem key={w}>
                        <ListItemText sx={{textAlign: 'center'}}>{w}</ListItemText>
                    </ListItem>
                )}
            </List>
        </CardContent>
        <CardActions sx={{justifyContent: 'center'}}>
            <Button onClick={onRight} color={'success'} variant={'contained'}>Right</Button>
            <Button onClick={onWrong} color={'error'} variant={'contained'}>Wrong</Button>
        </CardActions>
    </Card>
}