import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import { useStreamData } from '../../../../api/rest';
import { StreamInfo } from '../../../LiveDataView/components/StreamDataView/LiveStream';
import Grid from '@mui/material/Grid/Grid';

const useCanvas = ({}={}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const contextRef = useRef(null)
    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        canvasRef.current = canvas;
        contextRef.current = context;
    }, [])
    return { canvasRef, contextRef };
}

const ImageCanvas = ({ image=null, boxes=null, confidence=null, ignoreLabels=null, debugMode, ...rest }) => {
    const { canvasRef, contextRef } = useCanvas()


    // retrieve objects

    useEffect(() => {
        if(!image) {
            let img = new Image;
            img.src = '/brb_whiteblack.png';
            let still = true;
            img.onload = () => {
                still && contextRef.current.drawImage(
                    img,0,0,img.width,img.height,0,0, canvasRef.current.width, canvasRef.current.height)
            };
            return () => { still = false };
        }

        const img = new Image();
        img.onload = e => {
            const ctx = contextRef.current;
            if(!ctx) return;
            // fit canvas to parent width and image aspect ratio
            const width = ctx.canvas.parentElement.clientWidth
            ctx.canvas.height = img.height / img.width * width;
            ctx.canvas.width = width;
            // draw image
            ctx.drawImage(e.target, 0, 0, ctx.canvas.width, ctx.canvas.height);

            const canvasEle = canvasRef.current;

            // draw a bounding box
            const drawBoundingBox = (info, style) => {
                const { x, y, w, h } = info;
                const { color = 'red', width = 1, alpha=0.2 } = style;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.strokeStyle = color;
                ctx.lineWidth = width;
                // const prevAlpha = ctx.globalAlpha
                // ctx.globalAlpha = alpha;
                ctx.rect(x, y, w, h);
                // ctx.globalAlpha = prevAlpha;
                ctx.stroke();
            }

            // write a text (object's label)
            const drawObjectLabel = (info, style) => {
                let { text, x, y, w, h } = info;
                let {
                    fontSize = 11, fontFamily = 'Arial', color = 'black',
                    textAlign = 'left', textBaseline = 'top', pad=2, bgAlpha=0.7
                } = style;
                if(textAlign == 'center') {
                    x = x + w/2-pad;
                }

                // draw background box
                ctx.fillStyle = color;
                const { width } = ctx.measureText(text);
                const prevAlpha = ctx.globalAlpha
                ctx.globalAlpha = bgAlpha;
                ctx.fillRect(
                    x - width*(textAlign == 'center' ? 0.5 : 9), y,
                    width+pad*2, fontSize+pad*2);
                ctx.globalAlpha = prevAlpha;

                // draw
                ctx.font = fontSize + 'px ' + fontFamily;
                ctx.textAlign = textAlign;
                ctx.textBaseline = textBaseline;
                ctx.fillStyle = 'white';
                ctx.fillText(text, x+pad, y+pad);

            }

            if (canvasEle && boxes) {
                // get context of the canvas
                let ctx = canvasEle.getContext("2d");
                const W = ctx.canvas.width;
                const H = ctx.canvas.height;
                // const objects = [{"xywhn":[0.15746684,0.0030323744,0.26777026,0.38022032],"confidence":0.39985728,"class_id":6,"labels":"coffee mug"},{"xywhn":[0.0,0.11014099,0.1214155,0.45666656],"confidence":0.37101164,"class_id":0,"labels":"measuring cup"}];
                for(let object of boxes) {
                    if(!object.xyxyn) continue;
                    if(confidence && object.confidence < confidence) continue;
                    if(ignoreLabels && ignoreLabels.includes(object.label)) continue;
                    let [x1, y1, x2, y2] = object.xyxyn;
                    let [x, y, w, h] = [x1*W, y1*H, (x2-x1)*W, (y2-y1)*H]

                    drawBoundingBox({ x, y, w, h }, { color: 'red', width: 1.5 });
                    drawObjectLabel({ text: object.label, x, y, w, h }, { color: 'red', textAlign: 'center' });
                }
            }
        }

        // attach object to image
        const src = URL.createObjectURL(new Blob([image], {type: "image/jpeg"}));
        img.src = src;
        return () => { URL.revokeObjectURL(src) }
    }, [image, boxes, confidence])
    return <Box>
        <canvas ref={canvasRef} style={{width: '100%', borderRadius: '8px', border: '2px solid #ececec'}} {...rest} />
        { debugMode && <Grid container spacing={2} alignItems="center">
            <Grid item style={{marginTop:'-25px'}}>
                <span>Detection Confidence: </span>
            </Grid>
            <Grid item xs style={{marginTop:2}}>
                <Slider size='small' sx={{
                    padding: 0,
                    '& .MuiSlider-markLabel': {
                        top: '5px'
                    }
                }}
                        aria-label="detection confidence"
                        value={confidence} min={0} max={1} step={0.1}
                        marks={[
                            {value: 0, label: '0%'},
                            ...(boxes && boxes.map(b => (
                                {value: b.confidence,
                                    label: (
                                        <Badge color={'error'} badgeContent={
                                            <Tooltip title={b.label} placement='top'><span style={{opacity: 0}}>0</span></Tooltip>
                                        }  sx={{display: 'block', '& .MuiBadge-badge': {height: '10px', minWidth: '10px', p: 0 }, ml: '-7px', mt: '5px'}}><span style={{opacity: 0}}>0</span></Badge>)
                                })) || []),
                            {value: 1, label: '100%'}]}
                        onChange={(e, x) => {}} />
            </Grid>
        </Grid>
        }
    </Box>
}


export const ImageView = ({ streamId, boxStreamId, debugMode, ...rest}) => {
    const { sid, time, data, readyState } = useStreamData({ streamId, params: { output: 'jpg' } });
    const { data:  boxes } = useStreamData({ streamId: boxStreamId, utf: true, parse: JSON.parse });
    return (
        <StreamInfo sid={sid||streamId} time={time} data={data} readyState={readyState}>
            <ImageCanvas image={data} boxes={boxes} debugMode ={debugMode} {...rest} />
        </StreamInfo>
    )
}