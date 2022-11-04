import {styled} from "@mui/material";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RecipeStepComp from "./recipe-step";
import List from "@mui/material/List";


const ContainerDiv = styled("div")({

});

interface RecipeTextCompProps {
    recipeInstructions: Array<string>,
    currentStep: number
}

export default function RecipeTextComp({recipeInstructions, currentStep}: RecipeTextCompProps){
    return (
        <ContainerDiv>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography variant={"body1"}> All Steps</Typography>
                    {/*<Typography>Step {currentStep}: {recipeInstructions[currentStep]}</Typography>*/}
                </AccordionSummary>
                <AccordionDetails>
                    <List>
                        {
                            recipeInstructions.map((instruction, i) => {
                                return (
                                    <RecipeStepComp
                                        key={`recipe-step-${i}`}
                                        index={i} instruction={instruction} isCurrentStep={i === currentStep}/>
                                )
                            })
                        }
                    </List>

                </AccordionDetails>
            </Accordion>

        </ContainerDiv>
    )
}