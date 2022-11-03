import {ButtonGroup, styled} from "@mui/material";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";

interface SessionControlPanelProps {

}


const Container = styled("div")({

});

const Content = styled("div")(
    {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%"
    }
)

export default function SessionControlPanel({}: SessionControlPanelProps){

    return (
        <Container>
                <Content>
                    <Button sx={{
                        marginRight: "2px",
                        flexGrow: 2
                    }}
                        variant={"contained"}
                    >
                        Reset
                    </Button>

                    <Button
                        sx={{
                            marginLeft: "2px",
                            flexGrow: 2
                        }}
                        variant={"contained"}
                    >
                        Save
                    </Button>
                </Content>

        </Container>
    )
}