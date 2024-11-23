import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {FlashTrainer} from "./FlashTrainer.tsx";
import {CssBaseline} from "@mui/material";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <CssBaseline />
        <FlashTrainer/>
    </StrictMode>,
)
