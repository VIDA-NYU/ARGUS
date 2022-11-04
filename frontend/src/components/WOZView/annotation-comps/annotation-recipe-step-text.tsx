import {styled, Typography} from "@mui/material";
import Badge from '@mui/material/Badge';
import { deepOrange, deepPurple, blue, blueGrey } from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';


interface AnnotationRecipeStepTextProps {
    instruction: string,
    step: number,
    isActivated: boolean,
    progress?: number
}

const Container = styled("div")({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexBasis: 1,
    flexGrow: 2,

    // marginBottom: 10
})

const TextContainer = styled("div")({
    marginLeft: 8,
    width: "100%"
})

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
}));


export default function AnnotationRecipeStepText({instruction, isActivated, step, progress}: AnnotationRecipeStepTextProps){

    let textColor = isActivated ? blueGrey[700] : blueGrey[100]
    let avatarColor = isActivated ? blueGrey[600] : blueGrey[100]

    let progressValue = progress?progress:0;

    return (
        <Container>
            <Avatar
                sx={{ width: 28, height: 28, fontSize: 18, bgcolor: avatarColor }}
            >{step}</Avatar>
            <TextContainer>
                <Typography sx={{color: textColor, textAlign: "center"}} variant={"body1"}>{instruction}</Typography>
                { isActivated && <BorderLinearProgress variant="determinate" value={progressValue} />}
            </TextContainer>

        </Container>
    )
}