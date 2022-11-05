// templates
// import AccordionView from '../../templates/AccordionView/AccordionView';
import AccordionView from '../../../../templates/AccordionView/AccordionView';

// material
import {Box, styled} from '@mui/material';

// temp
import JSONPretty from 'react-json-pretty';
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import {HandsCanvas} from "./hand-data-vis/canvas";
import {computeHandsActivity, preprocessData, sampleArray} from "./visualization/utils";
import HandsActivityBarChart from "./visualization/activity-bar-chart";
import {useEffect, useState} from "react";
import {Dataset} from './model/dataset';
import {useRef} from "react";
import {isEmpty} from "./visualization/utils";

const Container = styled("div")(({}) => ({
    display: "flex",
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20
}))

const JsonDataContainer = styled(Card)(({}) => ({
    height: "100%",
    width: "600px",
    marginLeft: 30,
}))

const JsonContent = styled("div")(({}) => ({
    overflowY: "scroll",
    height: "100%",
    marginLeft: 25,
    position: "relative",
    left: 0
}))

const EmptyJsonContent = styled("div")(({}) => ({
    height: "100%",
    marginLeft: 25,
    position: "relative",
    left: 0
}))

const Activity_Sample_Rate = 30;

const DefaultHandsView = ({data}: any) => {
    return (
        <JsonDataContainer
            sx={{
                height: 400
            }}
        >
            <CardHeader
                titleTypographyProps={{
                    fontSize: 16,
                }}
                title={"Hands"}></CardHeader>
            {isEmpty(data) && <EmptyJsonContent>
                <JSONPretty id="json-pretty" data={data}></JSONPretty>
            </EmptyJsonContent>}
            {!isEmpty(data) && <JsonContent>
                <JSONPretty id="json-pretty" data={data}></JSONPretty>
            </JsonContent>}
        </JsonDataContainer>
    )
}

const HandsDataView = ({type, title, data, recordingName, state, onProgress, onSeek, recordingMetaData}: any) => {
    // let sampledData = sampleArray(data, Activity_Sample_Rate);
    let processedData = preprocessData(data);
    let handsActivity = computeHandsActivity(processedData);
    const dataset = useRef(null);

    const [frameData, setFrameData] = useState();
    const [frameIndex, setFrameIndex] = useState<number>(0);


    useEffect(() => {
        if (!isEmpty(processedData)) {
            dataset.current = new Dataset(recordingMetaData, processedData);
        }

    }, [processedData, recordingMetaData])

    useEffect(() => {
        if (dataset.current && recordingMetaData && recordingMetaData['first-entry']) {
            const {
                element: currFrameData,
                index: currFrameIndex
            } = dataset.current.get_corresponding_timestamp(state.currentTime);
            if (currFrameIndex >= 0) {
                setFrameData(currFrameData);
                setFrameIndex(currFrameIndex);
            }

        }
    }, [state, dataset])

    if (isEmpty(data) || isEmpty(recordingMetaData) || !recordingMetaData['first-entry']) {
        return (
            <DefaultHandsView data={processedData}></DefaultHandsView>
        )
    }


    return (
        <AccordionView title='Hands Data' height={300}>
            <Box sx={{display: 'flex', width: '100%', height: '100%', overflow: 'auto'}}>
                <Container>
                    {/* {!isEmpty(processedData) && <Card>
                        <CardHeader
                            titleTypographyProps={{
                                fontSize: 16,
                            }}
                            title={"Overview"}></CardHeader>
                        <CardContent>
                            <HandsCanvas
                                frameIndex={frameIndex}
                                frameData={frameData}
                                state={state} variant={"overview"} data={processedData}/>
                        </CardContent>
                    </Card>} */}
                    {!isEmpty(processedData) && <Card
                        sx={{
                            marginLeft: 10,
                            marginRight: 10
                        }}
                    >
                        <CardHeader
                            titleTypographyProps={{
                                fontSize: 16,
                            }}
                            title={"Left Hand"}></CardHeader>
                        <CardContent>
                            <HandsCanvas
                                frameIndex={frameIndex}
                                frameData={frameData}
                                state={state} variant={"left"} data={processedData}/>
                        </CardContent>
                    </Card>}

                    {true && <Card>
                        <CardHeader
                            titleTypographyProps={{
                                fontSize: 16,
                            }}
                            title={"Right Hand"}></CardHeader>
                        <CardContent>
                            <HandsCanvas
                                frameIndex={frameIndex}
                                frameData={frameData}
                                state={state} variant={"right"} data={processedData}/>
                        </CardContent>
                    </Card>}
                    <Card>
                        <CardHeader
                            titleTypographyProps={{
                                fontSize: 16,
                            }}
                            title={"Movement"}></CardHeader>
                        <CardContent>
                            <HandsActivityBarChart data={handsActivity}></HandsActivityBarChart>
                        </CardContent>
                    </Card>

                    {/* <JsonDataContainer>
                        <CardHeader
                            titleTypographyProps={{
                                fontSize: 16,
                            }}
                            title={"JSON"}></CardHeader>
                        <JsonContent>
                            <JSONPretty id="json-pretty" data={processedData}></JSONPretty>
                        </JsonContent>
                    </JsonDataContainer> */}

                </Container>

            </Box>
        </AccordionView>
    )
}

export default HandsDataView;