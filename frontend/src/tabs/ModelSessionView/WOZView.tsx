import {useToken} from '../../api/TokenContext';
import {Login} from '../RecipesCollectionView/RecipesView';
import {TEST_PASS, TEST_USER} from '../../config';
import {AnnotationContext, AnnotationProvider, useAnnotationContext} from "./components/annotation/provider";
import WozDataConsumer from "./woz-data-consumer";

function WOZView({...props}) {

    const {token, fetchAuth} = useToken();
    // const {response: recipeData} = useGetRecipeInfo(token, fetchAuth, "mugcake");

    return (
        <AnnotationProvider>
            <AnnotationContext.Consumer>
                {({annotationData, setAnnotationData}) => (
                    <WozDataConsumer
                        recordingName={props.recordingName}
                        annotationData={annotationData}
                        setAnnotationData={setAnnotationData}
                    />
                )}
            </AnnotationContext.Consumer>


        </AnnotationProvider>
    )
}

export default WOZView;
