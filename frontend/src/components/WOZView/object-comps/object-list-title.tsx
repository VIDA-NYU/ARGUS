import {styled, Typography} from "@mui/material";

interface ObjectListTitleProps {
    title: string,

}

const Container = styled("div")({
    flexBasis: 2,
    flexGrow: 1.4,
    marginLeft: 12
})

export default function ObjectListTitle ({title}: ObjectListTitleProps) {
    return (
        <Container>
            <Typography variant={"body1"}> {title} </Typography>
        </Container>
    )
}