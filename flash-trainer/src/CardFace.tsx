import {Box, Button, Card, CardContent, List, ListItem, ListItemText, Stack, Tooltip} from "@mui/material";
import {ReactNode} from "react";

// Don't understand why I have to invent my own type... I cannot find the correct reference to refer to
// the color type of the Button
type ButtonColor = 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning'

export interface Action {
    name: string
    shortcutHint?: string
    display?: ReactNode
    trigger: () => void
    color?: ButtonColor
}

interface CardFaceProps {
    words: string[]
    actions: Action[]
}

const CardItem = ({word}: { word: string }) => {
    if (word.startsWith('http')) {
        // Assume image
        return <ListItem>
            <Box sx={{width: '100%', display: 'flex', justifyContent: 'space-around'}}>
                <img src={word} alt="Unable to load Flashcard Image" style={{maxWidth: '100%', maxHeight: 200}}/>
            </Box>
        </ListItem>
    } else {
        return <ListItem>
            <ListItemText sx={{textAlign: 'center'}}>{word}</ListItemText>
        </ListItem>
    }
}

const ActionButton = ({action}: { action: Action }) => {
    const tooltip = action.shortcutHint ? `${action.name} (${action.shortcutHint})` : action.name
    return <Tooltip title={tooltip}>
        <Button
            onClick={action.trigger}
            color={action.color}
            variant={'contained'}
            size={'large'}
            sx={{minWidth: '30%'}}>
            {action.display ?? action.name}
        </Button>
    </Tooltip>
}

export const CardFace = ({words, actions}: CardFaceProps) => {

    return <Stack spacing={'20px'} sx={{minHeight: '50%'}}>
        <Card sx={{flex: 1, alignContent: 'center'}}>
            <CardContent>
                <List>
                    {words.map(w =>
                        <CardItem key={w} word={w}/>
                    )}
                </List>
            </CardContent>
        </Card>
        <Stack direction={'row'} justifyContent={"center"} spacing={'20px'}>
            {actions.map(a => <ActionButton key={a.name} action={a}/>)}
        </Stack>
    </Stack>
}