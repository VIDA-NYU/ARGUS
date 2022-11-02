import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {ButtonGroup, styled} from "@mui/material";
import Button from "@mui/material/Button";
import {Recipe} from "../../../api/types";
import AnnotationRecipeStepList from "./annotation-recipe-step-list";
import AnnotationControlButtonGroup from "./annotation-control-button-group";
import {addStepToAnnotation, computeCurrentStep, computeCurrentStepSpentTime} from "../annotation/utils";
import {useAnnotationContext} from "../annotation/provider";
import {AnnotationData} from "../annotation/types";
import RecipeProgressComp from "./recipe-progress";
import RecipeTextComp from "../recipe/recipe-text";
import React from "react";

interface AnnotationControlProps {
    mode: "auto" | "manual",
    recipe: Recipe,
    state: any,
    // machineReasoningStep: number,
    annotationData: AnnotationData,
    setAnnotationData: (newAnnotationData: AnnotationData) => void,
    errorStatus: boolean
};

const CardContentAnnotationRow = styled("div")({
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "stretch",
})

const Container = styled("div")({
    marginBottom: 10
})

function computeStepProgressValueByTime(progressTime){
    return 1 - 1 / (progressTime + 1)
}
const progressThreshold = 5/6;

export default function AnnotationControlComp({mode, recipe, state,
                                              annotationData, setAnnotationData,
                                                errorStatus
                                              }: AnnotationControlProps){

    let currentTime = state.currentTime;

    let currentStep = computeCurrentStep(annotationData, 0, currentTime);

    const handleGoingPrevStep = (time: number) => {
        if(currentStep > 0){
            setAnnotationData(addStepToAnnotation(annotationData, "human_go_prev", time, currentStep, currentStep - 1));
        }else{
            alert("It is the initial step!")
        }
    }

    const handleGoingNextStep = (time: number) => {
        if(currentStep < recipe.instructions.length - 1){
            setAnnotationData(addStepToAnnotation(annotationData, "human_go_next", time, currentStep, currentStep + 1));
        } else{
            alert("Reaching the final step!")
        }
    }

    let currentStepSpentTime = computeCurrentStepSpentTime(annotationData, currentTime)
    let stepProgressValue = computeStepProgressValueByTime(currentStepSpentTime);

    return (
          <Container
          >

            <Card
                sx={{marginBottom: 1}}
            >

              <CardContent
                sx={{paddingRight: 0,
                    // paddingBottom: 0, paddingTop: 0, marginBottom: 0
              }}
              >
                  <CardContentAnnotationRow>
                      <AnnotationRecipeStepList
                          currentTime={currentTime}
                          annotationData={annotationData}
                          recipe={recipe} currentStep={currentStep}
                        stepProgress={stepProgressValue}
                      />
                      <AnnotationControlButtonGroup
                          handleGoingNextStep={handleGoingNextStep}
                            handleGoingPrevStep={handleGoingPrevStep}
                          currentTime={currentTime}
                          errorStatus={errorStatus}
                          recommendingGoingNext={stepProgressValue > progressThreshold}
                      />
                      <RecipeProgressComp
                        numberSteps={recipe.instructions.length}
                        currentStep={currentStep}
                      />
                  </CardContentAnnotationRow>

              </CardContent>

                </Card>
                  {recipe && <RecipeTextComp recipeInstructions={recipe.instructions} currentStep={currentStep}/>}

          </Container>
      )
}
