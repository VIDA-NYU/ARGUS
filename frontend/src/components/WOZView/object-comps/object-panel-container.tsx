import {styled} from "@mui/material";
import {generateRecipeObjectIndex, generateRecipeObjectStatusIndex} from "./utils";
import ObjectListComp from "./object-list";

interface ObjectPanelProps {
    recipe: any,
    detectedObjects: Array<string>
}

const Container = styled("div")({

})

export default function ObjectPanelContainer ({recipe, detectedObjects}: ObjectPanelProps){
    const recipeObjectIndex = generateRecipeObjectIndex(recipe);
    const recipeObjectStatusIndex = generateRecipeObjectStatusIndex(recipeObjectIndex, detectedObjects);


    return (
        <Container>
            <ObjectListComp
                title={"Tools"} recipeObjectStatusList={recipeObjectStatusIndex.tools} />
            <ObjectListComp title={"Ingredients"} recipeObjectStatusList={recipeObjectStatusIndex.ingredients} />
        </Container>
    )
}