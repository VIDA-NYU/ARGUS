import {styled} from "@mui/material";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import {AnnotationData} from "../annotation/types";
import ObjectPanelContainer from "../object-comps/object-panel-container";
import {ClipOutputsView} from '../../../LiveDataView/components/StreamDataView/PerceptionOutputsView';
import ErrorAlert from "../common/error-alert";
import CardContent from "@mui/material/CardContent";

interface PerceptronMainProps {
    recipe: any,
    worldFrameData: any,
    egovlpActionFrameData: any,
    clipActionFrameData: any,
    reasoningFrameData: any,
    annotationData: AnnotationData,
    setAnnotationData: (newAnnotationData: AnnotationData) => void
}

const Container = styled("div")({

});

const Content = styled("div")({
    display: "flex",
    flexDirection: "row",
    paddingLeft: "10px",
    paddingRight: "10px",
    paddingBottom: "12px"
});

const ObjectCompContainer = styled("div")({
    flexBasis: 4,
    flexGrow: 4,
    marginRight: 8
})

export default function PerceptronMainComp({recipe, worldFrameData,
                                               egovlpActionFrameData, clipActionFrameData,
                                               reasoningFrameData,
                                               annotationData, setAnnotationData}: PerceptronMainProps){

    const renderActionReasoning = ({annotationData}) => {
        if(annotationData.meta.mode === "online"){
            return (<ClipOutputsView data={egovlpActionFrameData}/>)
        }else if(annotationData.meta.mode === "offline" && reasoningFrameData){
            return (<ClipOutputsView data={clipActionFrameData}/>)
        }else{
            return (<ErrorAlert message={"Action recognition not available"}/>)
        }
    }

    return (
        <Container>
            <Card>
                <CardHeader title={"Reasoning"} titleTypographyProps={{variant: "body1"}}/>
                <Content>
                    <ObjectCompContainer>
                        <ObjectPanelContainer
                            annotationData={annotationData}
                            setAnnotationData={setAnnotationData}
                            recipe={recipe}
                            detectedObjects={worldFrameData && worldFrameData.data ? worldFrameData.data.filter(d => d.confidence > annotationData.perceptronParameters.objectConfidenceThreshold).map(d => d.label) : []}/>
                     </ObjectCompContainer>
                    <Card sx={{
                        flexBasis: 2,
                        flexGrow: 2,
                    }}>
                        <CardHeader title={"Action"} titleTypographyProps={{variant: "body1"}}>

                        </CardHeader>
                        <CardContent>
                            {renderActionReasoning({annotationData})}
                        </CardContent>
                    </Card>
                </Content>
            </Card>
        </Container>
    )
}