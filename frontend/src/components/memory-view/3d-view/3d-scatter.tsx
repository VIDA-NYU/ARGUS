import {useEffect, useRef, useState, memo} from "react";
// third party
import * as scatter from 'scatter-gl';
import {Point3D, PointMetadata, RenderMode, Sequence} from 'scatter-gl';
import {GazeInfo, MemoryObject} from "../types";
import {styled} from "@mui/material";
import exp from "constants";

interface Memory3DScatterProps {
    memoryObjects: Array<MemoryObject>,
    gazeInfo: GazeInfo
}


interface ScatterPoint {
    coordinate: Point3D,
    type: "OBJECT" | "BOUNDING_BOX",
}

const ContainerDiv = styled("div")(() => ({
    width: 720,
    height: 350

}))

function getGazeDestinationCoordinate(gazeInfo: GazeInfo){
    const gazeLength = 1;
    return [
        gazeInfo.gazeOrigin[0] + gazeLength * gazeInfo.gazeDirection[0],
        gazeInfo.gazeOrigin[1] + gazeLength * gazeInfo.gazeDirection[1],
        gazeInfo.gazeOrigin[2] + gazeLength * gazeInfo.gazeDirection[2]
    ];
}

const COORDINATE_OFFSET = [-0.32, -0.03, 12.54];

function prepareScatterPoints(memoryObjects: Array<MemoryObject>, gazeInfo: GazeInfo){
    let auxiliaryPoints: Array<ScatterPoint> = [];
    let objectPoints: Array<ScatterPoint> = memoryObjects.map(memoryObject => ({
            coordinate: [memoryObject.center.x, memoryObject.center.y, memoryObject.center.z] as Point3D,
            type: "OBJECT",
        }));

    const boundingBoxSize = {
        x: 2,
        y: 2,
        z: 2
    }
    let boundingBoxPoints:Array<ScatterPoint> = [];
    boundingBoxPoints.push({
        coordinate: [boundingBoxSize.x/2, boundingBoxSize.y/2, boundingBoxSize.z/2] as Point3D,
        type: "BOUNDING_BOX"
    });
    boundingBoxPoints.push({
        coordinate: [boundingBoxSize.x/2, boundingBoxSize.y/2, -boundingBoxSize.z/2] as Point3D,
        type: "BOUNDING_BOX"
    });
    boundingBoxPoints.push({
        coordinate: [boundingBoxSize.x/2, -boundingBoxSize.y/2, boundingBoxSize.z/2] as Point3D,
        type: "BOUNDING_BOX"
    });
    boundingBoxPoints.push({
        coordinate: [boundingBoxSize.x/2, -boundingBoxSize.y/2, -boundingBoxSize.z/2] as Point3D,
        type: "BOUNDING_BOX"
    });
    boundingBoxPoints.push({
        coordinate: [-boundingBoxSize.x/2, boundingBoxSize.y/2, boundingBoxSize.z/2] as Point3D,
        type: "BOUNDING_BOX"
    });
    boundingBoxPoints.push({
        coordinate: [-boundingBoxSize.x/2, boundingBoxSize.y/2, -boundingBoxSize.z/2] as Point3D,
        type: "BOUNDING_BOX"
    });
    boundingBoxPoints.push({
        coordinate: [-boundingBoxSize.x/2, -boundingBoxSize.y/2, boundingBoxSize.z/2] as Point3D,
        type: "BOUNDING_BOX"
    });
    boundingBoxPoints.push({
        coordinate: [-boundingBoxSize.x/2, -boundingBoxSize.y/2, -boundingBoxSize.z/2] as Point3D,
        type: "BOUNDING_BOX"
    });

    let gazeOriginPoint = {
        coordinate: gazeInfo.gazeOrigin as Point3D,
        type: "GAZE_ORIGIN"
    };
    let gazeDestinationPoint = {
        coordinate: getGazeDestinationCoordinate(gazeInfo),
        // coordinate: [-0.32, -0.03, -1.27],
        // coordinate: [-0.62, -0.03, 0],
        type: "GAZE_DESTINATION"
    }

    const boundingBoxMetadata:Array<PointMetadata> = [
    ]
    for(let i =0; i< 8; i++){
        boundingBoxMetadata.push({
            labelIndex: i,
            label: ""
        })
    }
    boundingBoxMetadata.push({
        labelIndex: 8,
        label: "Gaze Origin"
    });

    boundingBoxMetadata.push({
        labelIndex: 9,
        label: "Gaze Direction"
    })


    let numAuxiliaries = boundingBoxMetadata.length;

    const objectMetadata: PointMetadata[] = memoryObjects.map((object, i) => {
        return {
            labelIndex: i + numAuxiliaries,
            label: object.label
        }
    });

    let coords = [...boundingBoxPoints, gazeOriginPoint, gazeDestinationPoint, ...objectPoints].map(p => ([p.coordinate[0] + COORDINATE_OFFSET[0], p.coordinate[1] + COORDINATE_OFFSET[1], p.coordinate[2] + COORDINATE_OFFSET[2]] as Point3D))
    console.log(coords)
    const gazeSequence: Sequence = {
        indices: [8, 9]
    }

    const boundingBoxSequences: Array<Sequence> = [
        {
            indices: [0, 1]
        },
        {
            indices: [1, 3]
        },
        {
            indices: [2, 3]
        },
        {
            indices: [0, 2],
        },
        {
            indices: [0, 4]
        },
        {
            indices: [1, 5]
        },
        {
            indices: [2, 6]
        },
        {
            indices: [3, 7]
        },
        {
            indices: [4, 5]
        },
        {
            indices: [4, 6]
        },
        {
            indices: [6, 7]
        }
    ]

    const sequences: Array<Sequence> = [...boundingBoxSequences];


    return {coords,
        meta: [...boundingBoxMetadata, ...objectMetadata],
        sequences: [...sequences, gazeSequence]}


}


function Memory3DScatter({memoryObjects, gazeInfo}: Memory3DScatterProps){
    const pointCloudContainerRef = useRef(null);
    const [scatterGL, setScatterGL] = useState<any>(null);

    let curr = 3;

    useEffect(() => {
        if(memoryObjects.length){

            let {coords, meta, sequences} = prepareScatterPoints(memoryObjects, gazeInfo);
            // const metadata: PointMetadata[] = memoryObjects.map((object, i) => {
            //     return {
            //         labelIndex: i,
            //         label: object.label
            //     }
            // });

            const scatterDataset = new scatter.ScatterGL.Dataset(coords, meta);

            // styles
            const pointStyle: {} = {
                colorUnselected: 'rgba(200, 200, 200, 1.0)',
                colorNoSelection: 'rgba(200, 200, 200, 1.0)',
                colorSelected: 'rgba(152, 0, 0, 1.0)',
                colorHover: 'rgba(118, 11, 79, 0.7)',
                scaleDefault: 0.2,
                scaleSelected: 2.0,
                scaleHover: 1.2,
                fillOpacity: 0.8
            }

            // generating canvas
            if( scatterGL === null ){
                const newScatterGL = new scatter.ScatterGL(pointCloudContainerRef.current, {
                    styles: {
                        point: pointStyle
                    },
                    // @ts-ignore
                    renderMode: "TEXT",
                    rotateOnStart: false,
                    camera: {
                        target: [0, 0, 0] as Point3D
                    }
                });

                scatterGL.setSequences(sequences);
                newScatterGL.render(scatterDataset);
                // scatterGL.setSequences(sequences);
                setScatterGL(newScatterGL);
            }
            if(scatterGL !== null){
                // rendering
                // scatterGL.setSequences(sequences);
                scatterGL.render( scatterDataset );
                scatterGL.stopOrbitAnimation();
            }
        }

    }, [memoryObjects, scatterGL])

    return (
        <ContainerDiv ref={pointCloudContainerRef}></ContainerDiv>
    )

}
export default Memory3DScatter;
// export default memo(Memory3DScatter, (prevProps, nextProps) => true)