import {useToken} from '../../api/TokenContext';
import {Login} from '../RecipesCollectionView/RecipesView';
import {TEST_PASS, TEST_USER} from '../../config';
import {AnnotationContext, AnnotationProvider, useAnnotationContext} from "./components/annotation/provider";
import WozDataConsumer from "./woz-data-consumer";

import React, { useEffect } from 'react';
import { Alert, Box, Button, Paper, Typography, Chip } from '@mui/material';
import { useGetRecipeInfo} from '../../api/rest';
// import { StreamView } from '../../tabs/Live/StreamDataView/LiveStream';
// import { ImageView } from '../StreamDataView/ImageView';
// import { ReasoningOutputsWOZView } from '../StreamDataView/ReasoningOutputsView';
import { StreamView } from '../LiveDataView/components/StreamDataView/LiveStream';
import { ReasoningOutputsWOZViewPaper } from '../LiveDataView/components/StreamDataView/ReasoningOutputsView';
import { ImageView } from '../LiveDataView/components/StreamDataView/ImageView';

interface RecipeData {
  _id: string,
  name: string,
  ingredients: string [],
  ingredients_simple: string [],
  instructions: string [],
  steps: string [],
  steps_simple: string [],
  tools: string [],
  tools_simple: string []
}

function WOZViewPaper() {

  const { token, fetchAuth } = useToken();
  const {response: recipeData} = useGetRecipeInfo(token, fetchAuth);
  // console.log(recipeData);

  return (
    <Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
          gap: 1,
          gridTemplateRows: 'auto',
          gridTemplateAreas: {
            md: `
              "H H H H H H"
              "H H H H H H"
              "M M M M r r"
              "M M M M r r"
              "M M M M b b"
              "M M M M b b"
              "g g g g g g"
              "c c d d e e"
          `,
          xs: `
              "H H H H H H"
              "H H H H H H"
              "M M M M M M"
              "M M M M M M"
              "M M M M M M"
              "M M M M M M"
              "g g g g g g"
              "a a a b b b"
              "e e e e e e"
              "c c c d d d"
          `
          },
        }}>
        <Box sx={{ gridArea: 'H' }}>
          <Box sx={{ '& > button': { mt: 2, mb: 2, mr: 2 } }}>
            <b>RECIPE: {recipeData && recipeData.name}</b>
          </Box>
        </Box>
        <Box sx={{ gridArea: 'r' }}>
          <StreamView utf streamId={'reasoning'} showStreamId={false} showTime={false}>
            {data => (<Box><ReasoningOutputsWOZViewPaper recipe={recipeData} data={JSON.parse(data)} /></Box>)}
          </StreamView>
        </Box>
        <Box sx={{ gridArea: 'b' }}>
          <Box  pt={2} mr={2} ml={2} >
          <span><b>INGREDIENTS</b></span>
          <>{
            recipeData && recipeData.ingredients.map((value: string, index: number ) => {
              return <li key={'ing_'+ index} > {value} </li>
              })
            }
          </>
          </Box>
        </Box>
        <Box sx={{ gridArea: 'M' }}><ImageView streamId='main' boxStreamId='detic:image' confidence={0.5} debugMode={false} /></Box>
      </Box>
    </Box>
  )
}

// looks at the token and will either ask for login or go to app - (can replace with react router)
const MainVideo = () => {
  const { token } = useToken();
  return token ? <WOZViewPaper /> : <Login username={TEST_USER} password={TEST_PASS} />
}

export default WOZViewPaper;
