import {styled, Typography} from "@mui/material";
import {blueGrey} from "@mui/material/colors";

const Container = styled("div")({
    flexBasis: 1,
    flexGrow: 2
})

export default function AnnotationRecipeBlankLine(){

    const blankColor = blueGrey[100];
    return (
        <Container>
            <Typography sx={{color: blankColor, textAlign: "center"}} variant={"body1"}>
                {"..."}
            </Typography>
        </Container>
    )
}