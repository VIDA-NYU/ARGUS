import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { ReadyState } from 'react-use-websocket';
import { useStreamData } from '../../api/rest';
import { StreamInfo } from './LiveStream';

const useCanvas = ({}={}) => {
    const canvasRef = useRef(null)
    const contextRef = useRef(null)
    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        canvasRef.current = canvas;
        contextRef.current = context;
    }, [])
    return { canvasRef, contextRef };
}

const ImageCanvas = ({ image=null, boxJson=null, confidence=null, ...rest }) => {
    const { canvasRef, contextRef } = useCanvas()

    // retrieve objects
    
    useEffect(() => {
        if(!image) {
            let img = new Image;
            img.src = '/brb.jpg';
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
                const { color = 'red', width = 1 } = style;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.strokeStyle = color;
                ctx.lineWidth = width;
                ctx.rect(x, y, w, h);
                ctx.stroke();
            }

            // write a text (object's label)
            const drawObjectLabel = (info, style) => {
                const { text, x, y } = info;
                const { fontSize = 12, fontFamily = 'Arial', color = 'black', textAlign = 'left', textBaseline = 'top' } = style;
                ctx.beginPath();
                ctx.font = fontSize + 'px ' + fontFamily;
                ctx.textAlign = textAlign;
                ctx.textBaseline = textBaseline;
                ctx.fillStyle = color;
                ctx.fillText(text, x, y);
                ctx.stroke();
            }

            if (canvasEle && boxJson) {
                // get context of the canvas
                let ctx = canvasEle.getContext("2d");
                const W = ctx.canvas.width;
                const H = ctx.canvas.height;
                // const objects = [{"xywhn":[0.15746684,0.0030323744,0.26777026,0.38022032],"confidence":0.39985728,"class_id":6,"labels":"coffee mug"},{"xywhn":[0.0,0.11014099,0.1214155,0.45666656],"confidence":0.37101164,"class_id":0,"labels":"measuring cup"}];
                for(let object of JSON.parse(boxJson)) {
                    if(!object.xyxyn) continue;
                    if(confidence && object.confidence < confidence) continue;
                    const [x1, y1, x2, y2] = object.xyxyn;
                    drawBoundingBox({ x: x1*W, y: y1*H, w: (x2-x1)*W, h: (y2-y1)*H }, { color: 'red', width: 2 });
                    drawObjectLabel({ text: object.label, x: x1*W, y: y1*H }, { fontSize: 20, color: 'red', textAlign: 'center' });
                }
            }
        }

        // attach object to image
        const src = URL.createObjectURL(new Blob([image], {type: "image/jpeg"}));
        img.src = src;
        return () => { URL.revokeObjectURL(src) }
    }, [image])
    return <canvas ref={canvasRef} style={{width: '100%', borderRadius: '8px', border: '2px solid #ececec'}} {...rest} />
}


export const ImageView = ({ streamId, boxStreamId, ...rest }) => {
    const { sid, time, data, readyState } = useStreamData({ streamId, params: { output: 'jpg' } });
    const { data:  boxJson } = useStreamData({ streamId: boxStreamId, utf: true });
    return (
        <StreamInfo sid={sid||streamId} time={time} data={data} readyState={readyState}>
            <ImageCanvas image={data} boxJson={boxJson} {...rest} />
        </StreamInfo>
    )
}