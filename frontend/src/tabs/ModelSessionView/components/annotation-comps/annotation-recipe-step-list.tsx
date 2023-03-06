import {Recipe} from '../../../../api/types';
import {styled} from "@mui/material";
import AnnotationRecipeStepText from "./annotation-recipe-step-text";
import AnnotationRecipeBlankLine from "./annotation-recipe-blank-line";
import {AnnotationData} from "../annotation/types";


interface AnnotationRecipeStepListProps {
    recipe: Recipe,
    currentStep: number,
    annotationData: AnnotationData,
    currentTime: number,
    stepProgress: number
}

const Container = styled("div")({
    flexBasis: 4,
    flexGrow: 3,
    flexShrink: 3,
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column"
})


export default function AnnotationRecipeStepList({recipe, currentStep, stepProgress,
                                                     annotationData, currentTime}:
    AnnotationRecipeStepListProps){

    let prevStep = currentStep - 1;
    let nextStep = currentStep + 1;

    let shouldShownPrev = prevStep >= 0;
    let shouldShownNext = nextStep < recipe.instructions.length;



    return (
        <Container>
            {shouldShownPrev  && <AnnotationRecipeStepText instruction={recipe.instructions[prevStep]}
                                                           isActivated={false}
                                                            step={prevStep}
            />}
            {!shouldShownPrev && <AnnotationRecipeBlankLine/>}
            <AnnotationRecipeStepText instruction={recipe.instructions[currentStep]}
                                      isActivated={true}
                                        step={currentStep}
                                      progress={stepProgress * 100}
            />
            {!shouldShownNext && <AnnotationRecipeBlankLine/>}
            {shouldShownNext  && <AnnotationRecipeStepText
                instruction={recipe.instructions[nextStep]}
                step={currentStep + 1}
                isActivated={false}/>}
        </Container>
    )
}