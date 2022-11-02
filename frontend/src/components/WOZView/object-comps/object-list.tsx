import {styled} from "@mui/material";
import {RecipeObjectStatus} from "./types";
import Card from "@mui/material/Card";
import ObjectListTitle from "./object-list-title";
import ObjectListContent from "./object-list-content";


interface ObjectListProps {
    title: string,
    recipeObjectStatusList: Array<RecipeObjectStatus>
}


const Container = styled("div")(
    {
        marginBottom: 5
    }
)

const Content = styled("div")({
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
})


export default function ObjectListComp ({title, recipeObjectStatusList}: ObjectListProps){
    return (
        <Container>
            <Card>
                <Content>
                    <ObjectListTitle title={title} />
                    <ObjectListContent recipeObjectStatusList={recipeObjectStatusList}/>
                </Content>
            </Card>
        </Container>
    )
}