import {Deck} from "./types.ts";
import {Button, Card, CardActions, CardContent, List, ListItem, ListItemButton, ListItemText} from "@mui/material";

interface TrainingSummaryProps {
    rightDeck: Deck
    wrongDeck: Deck
    onShow: (deck: Deck) => void
    onReset: () => void
}

export const TrainingSummary = ({rightDeck, wrongDeck, onShow, onReset}: TrainingSummaryProps) => {

    return <Card>
        <CardContent>
            <List>
                <ListItem>
                    <ListItemText>Done !</ListItemText>
                </ListItem>
                <ListItem>
                    <ListItemText>You had {rightDeck.cards.length} cards right.</ListItemText>
                    <ListItemButton onClick={() => onShow(rightDeck)}>Show</ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemText>You had {wrongDeck.cards.length} cards wrong.</ListItemText>
                    <ListItemButton onClick={() => onShow(wrongDeck)}>Show</ListItemButton>
                </ListItem>
            </List>
        </CardContent>
        <CardActions>
            <Button onClick={onReset}>Reset and go again</Button>
        </CardActions>
    </Card>

}