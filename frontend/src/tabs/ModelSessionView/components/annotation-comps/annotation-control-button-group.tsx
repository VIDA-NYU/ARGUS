import {styled} from "@mui/material";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import IconButton from "@mui/material/IconButton";
import ErrorIcon from "@mui/icons-material/Error";
import React from "react";
import {blueGrey} from "@mui/material/colors";


interface AnnotationControlButtonGroupProps {
    handleGoingNextStep: (time: number) => void,
    handleGoingPrevStep: (time: number) => void,
    currentTime: number,
    errorStatus: boolean,
    recommendingGoingNext: boolean
}

const Container = styled("div")({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 5,
    flexBasis: 1
})

export default function AnnotationControlButtonGroup({handleGoingNextStep, handleGoingPrevStep,
                                                         currentTime, errorStatus,
                                                        recommendingGoingNext
                                                     }:
    AnnotationControlButtonGroupProps){
    return (
        <Container>
            <IconButton aria-label="revert" size="medium"
                onClick={() => handleGoingPrevStep(currentTime)}
            >
                <KeyboardDoubleArrowUpIcon/>
            </IconButton>
            <IconButton
                size={"medium"}
            >
                <ErrorIcon
                    sx={{
                        color: errorStatus ? "red" : "gray",
                    }}
                >
                </ErrorIcon>
            </IconButton>
            <IconButton aria-label="next" size="medium"
                onClick={() => handleGoingNextStep(currentTime)}

            >
                <KeyboardDoubleArrowDownIcon
                    color={recommendingGoingNext? "success": "inherit" }
                />
            </IconButton>
        </Container>
    )
}