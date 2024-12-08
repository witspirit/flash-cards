import {Deck} from "./types.ts";
import {Box, Button, List, ListItem, ListItemButton, ListItemText} from "@mui/material";

interface TrainingStatsProps {
    rightDeck: Deck
    wrongDeck: Deck
    onShow: (deck: Deck) => void
    onReset: () => void
}

export const TrainingStats = ({rightDeck, wrongDeck, onShow, onReset}: TrainingStatsProps) => {

    return <Box>
        <Box>
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
        </Box>
        <Button onClick={onReset}>Reset and go again</Button>
    </Box>

}