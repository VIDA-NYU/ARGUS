import {ButtonGroup, styled} from "@mui/material";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";

interface SessionControlPanelProps {
    onResettingAnnotation: () => void,
    onSavingAnnotation: () => void
}


const Container = styled("div")({});

const Content = styled("div")(
    {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%"
    }
)

export default function SessionControlPanel({onResettingAnnotation, onSavingAnnotation}: SessionControlPanelProps) {

    const handleResetting = () => {
        onResettingAnnotation();
    }

    const handleSavingAnnotation = () => {
        onSavingAnnotation();
    }

    return (
        <Container>
            <Content>
                <Button sx={{
                    marginRight: "2px",
                    flexGrow: 2
                }}
                        variant={"contained"}
                        onClick={handleResetting}
                >
                    Reset
                </Button>

                <Button
                    sx={{
                        marginLeft: "2px",
                        flexGrow: 2
                    }}
                    variant={"contained"}
                    onClick={handleSavingAnnotation}
                >
                    Save
                </Button>
            </Content>

        </Container>
    )
}