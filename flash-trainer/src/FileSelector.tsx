import {FormEvent} from "react";
import { Box } from "@mui/material";

interface FileLoaderProps {
    onFileSelected: (file: File) => void
}

export const FileSelector = ({onFileSelected}: FileLoaderProps) => {

    const handleFileSelected = (event: FormEvent<HTMLInputElement>) => {
        const files = event.currentTarget.files
        if (files && files.length > 0) {
            const file = files[0]
            onFileSelected(file)
        }
    }

    return <Box sx={{display: 'flex', gap: '10px'}}>
        <div>FlashCards</div>
        <input type='file' accept={'.csv'} onChange={handleFileSelected}/>
    </Box>
}