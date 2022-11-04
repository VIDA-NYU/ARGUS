import Typography from "@mui/material/Typography";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import {Radio} from "@mui/material";

interface RecipeTextCompProps {
    instruction: string,
    isCurrentStep: boolean,
    index: number
}

export default function RecipeStepComp({instruction, isCurrentStep, index}: RecipeTextCompProps){
    return (
        <ListItem
            key={index}
            disablePadding
        >
            <Radio
                edge="end"
                checked={isCurrentStep}
            />
            <ListItemText sx={{marginLeft: 4}} id={`step-${index}`} primary={`${instruction}`} />
        </ListItem>
    )
}