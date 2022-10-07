import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, Paper, Typography, Chip } from '@mui/material';
import { useToken } from '../../api/TokenContext';
import { Login } from '../RecipesView';
import { TEST_PASS, TEST_USER } from '../../config';
import { useCurrentRecipe, useGetRecipeInfo, useGetRecipes} from '../../api/rest';
import { StreamView } from '../StreamDataView/LiveStream';
import { ImageView } from '../StreamDataView/ImageView';
import { ReasoningOutputsWOZView } from '../StreamDataView/ReasoningOutputsView';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

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

function WOZView() {

  const [ recipeData, setRecipeData ] = useState<RecipeData>();


  const RecipePicker = () => {
    const { token, fetchAuth } = useToken();
    const { response: recipes } = useGetRecipes(token, fetchAuth);
    const { response: recipe, setRecipe, setting } = useCurrentRecipe();
    const index = recipes && recipes.findIndex(item => item._id === recipe);
    if (recipes) { setRecipeData(recipes[index]);}

    return (
      <FormControl sx={{ m: 1, minWidth: 340 }} size="small">
        <InputLabel id="recipe-selector-label">Select Recipe</InputLabel>
        {setting === true ? 'Setting...'  : <Select
          labelId="recipe-selector-label"
          id="recipe-selector"
          value={recipe||''}
          label="Select Recipe"
          onChange={e => setRecipe(e.target.value)}
        >
        {recipes && recipes.map(r => (
          <MenuItem key={r.name} value={r._id}>{r.name}</MenuItem>
        ))}
        <MenuItem value={''}>--</MenuItem>
        </Select>}
      </FormControl>
    )
  }
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
            <RecipePicker />
          </Box>
        </Box>
        <Box sx={{ gridArea: 'r' }}>
          <StreamView utf streamId={'reasoning'} showStreamId={false} showTime={false}>
            {data => (<Box><ReasoningOutputsWOZView recipe={recipeData} data={JSON.parse(data)} /></Box>)}
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
        <Box sx={{ gridArea: 'M' }}><ImageView streamId='main' boxStreamId='detic:image' confidence={0.5} debugMode={false}/></Box>
      </Box>
    </Box>
  )
}

export default WOZView;
