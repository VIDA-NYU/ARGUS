import { useState, useEffect} from 'react';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import useSWR, { Key } from 'swr';
import { Box } from '@mui/material';
import { TokenProvider, useToken } from '../api/TokenContext';
import {API_URL, TEST_USER, TEST_PASS} from '../config';
import { LoginCredential, Recipe } from '../api/types';

/* 
Login / Authentication::
/*
Pages::
*/

// simple login form
const Login = ({ username, password }: LoginCredential) => {
  const { login } = useToken();
  const [ user, setUser ] = useState(username);
  const [ pass, setPass ] = useState(password);
  return (
    <div className="App">
        <TextField label="Username" value={user} onChange={e => setUser(e.target.value)}></TextField>
        <TextField label="Password" value={pass} onChange={e => setPass(e.target.value)} type='password'></TextField>
        <Button fullWidth onClick={() => user && pass && login([user, pass])}>Login</Button>
    </div>
  );
}

const ListValues = ({list}: {list: string []}) => {
    return (
        <>{
            list.map((value: string) => (
            <li>{value}</li>
        ))}</>
    )
}

// the app - once you're authenticated
const App = () => {
  // get the token and authenticated fetch function
  const { token, fetchAuth } = useToken();
    // const appContext = React.useContext(TokenContext);
  // query the recipes endpoint (only if we have a token)
  const uid: Key = token && `${API_URL}/recipes`;
  const fetcher = (url: string) => fetchAuth !== undefined && fetchAuth !== "" && fetchAuth(url).then((res) => res.json());
  const { data: recipes, error } = useSWR(uid, fetcher);
  // can print out data/error for debugging
  useEffect(() => { recipes && console.log(recipes) }, [recipes])
  useEffect(() => { error && console.error(error) }, [error])
  // render the recipes!
  return (
    <div className="mt-2 mr-2 ml-2">
      <ul>
        {recipes && recipes.map((recipe: Recipe, index: number) => 
            <div>
            {index === 0 && <span style={{marginLeft: "2px", color: "#6c757d"}}>Total of {recipes.length} recipes.</span>}
            <h1>{index+1}. {recipe.name}</h1>
            <h3>Ingredients</h3>
            <ListValues list={recipe.ingredients}/>
            <h3>Tools</h3>
            <ListValues list={recipe.tools}/>
            <h3>Instructions</h3>
            <ListValues list={recipe.instructions}/>
          </div>
        )}
      </ul>
    </div>
  )
}

// looks at the token and will either ask for login or go to app - (can replace with react router)
const Main = () => {
  const { token } = useToken();
  return <Box display='flex' justifyContent='center' alignItems='center' height='100%'>
    <Paper>
      {token ? <App /> : <Login username={TEST_USER} password={TEST_PASS} />}
    </Paper>
  </Box>
}

// top level - wraps with a global token context
const RecipesView = () => {
  return <TokenProvider>
    <Main />
  </TokenProvider>
}

export default RecipesView;

