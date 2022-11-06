import {styled} from "@mui/material";
import {generateRecipeObjectIndex, generateRecipeObjectStatusIndex} from "./utils";
import ObjectListComp from "./object-list";
import ObjectConfidenceThresholdAdjuster from "./object-confidence-threshold-adjuster";
import {AnnotationData} from "../annotation/types";
import {setNewObjectConfidenceThreshold} from "../annotation/utils";

interface ObjectPanelProps {
    recipe: any,
    detectedObjects: Array<string>,
    annotationData: AnnotationData,
    setAnnotationData: (newAnnotationData: AnnotationData) => void
}

const Container = styled("div")({

})

export default function ObjectPanelContainer ({recipe, detectedObjects,
                                              annotationData, setAnnotationData
                                              }: ObjectPanelProps){
    const recipeObjectIndex = generateRecipeObjectIndex(recipe);
    const recipeObjectStatusIndex = generateRecipeObjectStatusIndex(recipeObjectIndex, detectedObjects);

    const handleSettingObjectConfidenceThreshold = (value) => {
        setAnnotationData(setNewObjectConfidenceThreshold(annotationData, value));
    }

    return (
        <Container>
            <ObjectConfidenceThresholdAdjuster
                thresholdValue={annotationData.perceptronParameters.objectConfidenceThreshold}
                onSettingThresholdValue={handleSettingObjectConfidenceThreshold}
            />
            <ObjectListComp
                title={"Tools"} recipeObjectStatusList={recipeObjectStatusIndex.tools} />
            <ObjectListComp title={"Ingredients"} recipeObjectStatusList={recipeObjectStatusIndex.ingredients} />
        </Container>
    )
}