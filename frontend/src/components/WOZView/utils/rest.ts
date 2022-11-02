import {API_URL, RECORDINGS_STATIC_PATH, RECORDINGS_UPLOAD_PATh} from "../../../config";
import {useState} from "react";
import data from "bootstrap/js/src/dom/data";

function getJsonUrl(recordingName, filename){
    return `https://api.ptg.poly.edu/recordings/static/${recordingName}/${filename}.json`
}

export async function getActionData(recordingName) {
    // const url ="https://api.ptg.poly.edu/recordings/static/coffee-test-1/eye.json";
    const url = API_URL +  RECORDINGS_STATIC_PATH + `${recordingName}/egovlp:action:steps.json`;
    const response = await fetch(url).then((res) => res.json());
    return response;
}

export async function getJsonData(recordingName, filename) {
    // const url ="https://api.ptg.poly.edu/recordings/static/coffee-test-1/eye.json";
    const url = API_URL +  RECORDINGS_STATIC_PATH + `${recordingName}/${filename}.json`;
    const response = await fetch(url).then((res) => res.json());
    return response;
}

export function useGetRecordingJson(recordingName, filename) {
    const [data, setData] = useState();
    getJsonData(recordingName, filename).then(result=>{
        setData(result);
    });
    return {data};
}

export function uploadAnnotation(recordingName, annotationData){

    let formData = new FormData();
    let annotationBlob = new Blob([JSON.stringify(annotationData, null, 2)], {
        type: "application/json",
    });

    formData.append('file', annotationBlob);

    const url = API_URL + RECORDINGS_UPLOAD_PATh + `${recordingName}/annotation.json`;
    const response = fetch(url, {
        method: "POST",
        body: formData
    }).then((res) => res.json()).then(res=> {

    });
    return response
}