import {API_URL, RECORDINGS_STATIC_PATH} from "../../../config";
import {useState} from "react";

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