import {Recipe} from "../../api/types";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import {styled} from "@mui/material";
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { green } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React from "react";
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';




interface WozStatusCompStatus {
    recipe: Recipe,
    currentStep: number
}

const ReasoningNextStepRow = styled("div")( {
    flexDirection: "row"
    }
);
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const SubStepRowContainer = styled("div")(() => ({
    flexDirection: "row",
    marginLeft: 40,
    marginBottom: 0
}));

const SubStepRow = ({subStepInstruction}) => {
    return (
        <SubStepRowContainer>
            <Checkbox {...label} size={"small"} defaultChecked />
            <Typography display="inline" variant={"body2"}>
                {subStepInstruction}
            </Typography>
        </SubStepRowContainer>
    )
}

const ErrorBar = ({error}) => {
    return (
        <Chip label={error} />

    )

}

const ErrorCompContainer = styled("div")(()=>({
    flexDirection: "row",
}))
const ErrorComp = () => {
    const errors = [
        "wrong knife", "dirty paper"
    ]
    return (
        <ErrorCompContainer>

            <Stack alignItems={"center"} direction="row" spacing={1}>
                <Typography display={"inline"} variant={"body1"}>
                    Error
                </Typography>
                {errors.map(error => (
                    <ErrorBar error={error}></ErrorBar>
                ))}
            </Stack>
        </ErrorCompContainer>


    )
}

export default function WozStatusComp({currentStep, recipe}: WozStatusCompStatus) {

    const buttonSx = {
        ...(true && {
            // bgcolor: "gray",
            bgcolor: green[500],
            '&:hover': {
                bgcolor: green[700],
            },
        }),
        fontSize: 14
    };

    const subSteps = [
        "pick up the knife", "pick up the towel", "wipe the knife with the paper"
    ]

    return (
        <div>
            <Card>
                <CardHeader title={"Reasoning"}>

                </CardHeader>
                <CardContent>
                    <ReasoningNextStepRow>

                        <Box sx={{ m: 1, position: 'relative', paddingBottom: 4 }}>
                            <Fab
                                aria-label="save"
                                color="primary"
                                sx={{
                                    ...buttonSx,
                                    position: 'absolute',
                                    top: -5.5 - 7,
                                    left: -6 + 350,
                                    zIndex: 1,
                                }}
                                size={"small"}
                            >
                                <ArrowForwardIcon
                                    width={10}
                                />
                            </Fab>
                            <CircularProgress
                                size={52}
                                value={95}
                                variant="determinate"
                                sx={{
                                    // color: "gray",
                                    color: green[500],
                                    position: 'absolute',
                                    top: -11 - 7,
                                    left: -12 + 350,
                                    zIndex: 1,
                                }}
                            />
                            <Typography
                                sx={{
                                    position: 'absolute',
                                    top: -5.5,
                                    left: 1
                                }}
                                display={"inline"} variant={"body1"}>
                            {recipe.instructions[currentStep]}
                        </Typography>
                        </Box>

                    </ReasoningNextStepRow>
                    <div>
                        {
                            subSteps.map(step => (<SubStepRow subStepInstruction={step}></SubStepRow>))
                        }

                    </div>
                    <ErrorComp></ErrorComp>
                </CardContent>
            </Card>

        </div>
    )
}