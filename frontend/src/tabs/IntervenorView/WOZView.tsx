import {useToken} from '../../api/TokenContext';
import {Login} from '../../tabs/RecipesCollectionView/RecipesView';
import {TEST_PASS, TEST_USER} from '../../config';
import {AnnotationContext, AnnotationProvider, useAnnotationContext} from "./components/annotation/provider";
import WozDataConsumer from "./woz-data-consumer";

function WOZView() {

    const {token, fetchAuth} = useToken();
    // const {response: recipeData} = useGetRecipeInfo(token, fetchAuth, "mugcake");

    return (
        <AnnotationProvider>
            <AnnotationContext.Consumer>
                {({annotationData, setAnnotationData}) => (
                    <WozDataConsumer
                        annotationData={annotationData}
                        setAnnotationData={setAnnotationData}
                    />
                )}
            </AnnotationContext.Consumer>


        </AnnotationProvider>
    )
}

// looks at the token and will either ask for login or go to app - (can replace with react router)
const MainVideo = () => {
    const {token} = useToken();
    return token ? <WOZView/> : <Login username={TEST_USER} password={TEST_PASS}/>
}

export default WOZView;
