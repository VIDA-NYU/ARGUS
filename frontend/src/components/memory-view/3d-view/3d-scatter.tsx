import {useEffect, useRef, useState, memo} from "react";
// third party
import * as scatter from 'scatter-gl';
import {Point3D, PointMetadata, RenderMode} from 'scatter-gl';
import {MemoryObject} from "../types";
import {styled} from "@mui/material";
import exp from "constants";

interface Memory3DScatterProps {
    memoryObjects: Array<MemoryObject>
}

const ContainerDiv = styled("div")(() => ({
    width: 720,
    height: 350

}))

function Memory3DScatter({memoryObjects}: Memory3DScatterProps){
    const pointCloudContainerRef = useRef(null);

    const [scatterGL, setScatterGL] = useState<any>(null);

    useEffect(() => {

        if(memoryObjects.length){

            // generating dataset
            // const coords = generate_scatter_dataset( points, attribute );
            let coords = memoryObjects.map(object => [object.center.x, object.center.y, object.center.z] as Point3D);
            // let coords = memoryObjects.map(d=>d.center)
            const metadata: PointMetadata[] = memoryObjects.map((object, i) => {
                return {
                    labelIndex: i,
                    label: object.label
                }
            });

            const scatterDataset = new scatter.ScatterGL.Dataset(coords, metadata);

            // styles
            const pointStyle: {} = {
                colorUnselected: 'rgba(200, 200, 200, 1.0)',
                colorNoSelection: 'rgba(200, 200, 200, 1.0)',
                colorSelected: 'rgba(152, 0, 0, 1.0)',
                colorHover: 'rgba(118, 11, 79, 0.7)',
                scaleDefault: 0.2,
                scaleSelected: 2.0,
                scaleHover: 1.2,
                fillOpacity: 0.5
            }

            // generating canvas
            if( scatterGL === null ){
                const newScatterGL = new scatter.ScatterGL(pointCloudContainerRef.current, {
                    styles: {
                        point: pointStyle
                    },
                    // @ts-ignore
                    renderMode: "TEXT",
                    rotateOnStart: false
                });
                setScatterGL(newScatterGL);
            }
            if(scatterGL !== null){
                // rendering
                scatterGL.render( scatterDataset );
                scatterGL.stopOrbitAnimation();
            }



        }

    }, [memoryObjects])

    return (
        <ContainerDiv ref={pointCloudContainerRef}></ContainerDiv>
    )

}
export default Memory3DScatter;
// export default memo(Memory3DScatter, (prevProps, nextProps) => true)