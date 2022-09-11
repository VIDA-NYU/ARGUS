import axios, {AxiosResponse, AxiosRequestConfig} from 'axios';
import React from 'react';
import useSWR, { Key } from 'swr';
import { DeleteInfo } from '../components/HistoricalDataView';
import { API_URL, RECORDINGS_STATIC_PATH } from '../config';
import { RequestStatus } from './types';

/*
Using SWR React hooks "useSWR" in an external API service layer: This will be possible following this two rules:
- Create a custom hook that uses useSWR to fetch data. React will allow to create a custom hook with other hooks used inside it.
- Use "use" prefix. The 'use' prefix is important to identify normal functions from custom hook functions.
*/

/* fetch list of available recordings */
export function useGetAllRecordings(token, fetchAuth) {
    // get the authenticated fetch function
    const fetcher = (url: string) => fetchAuth(url).then((res) => res.json());
    // query the streamings endpoint (only if we have a token)
    const uid: Key = token && `${API_URL}/recordings`;
    const random = React.useRef(Date.now());
    const { data: response, error } = useSWR([uid, random], fetcher);
    return {
        data: response && response.data,
        response,
        error
    };
}

/* fetch data available of an specific recording */
export function useGetRecording(token, fetchAuth, recordingName) {
    // get the authenticated fetch function
    const fetcher = (url: string) => fetchAuth(url).then((res) => res.json());
    // query the streamings endpoint (only if we have a token)
    const uid: Key = token  && recordingName && `${API_URL}/recordings/` + recordingName;
    const { data: response, error } = useSWR(uid, fetcher);
    return {
        data: response && response.data,
        response,
        error
    };
}

/* fetch recipes */
export function useGetRecipes(token, fetchAuth) {
    // get the authenticated fetch function
    const fetcher = (url: string) => fetchAuth(url).then((res) => res.json());
    // query the streamings endpoint (only if we have a token)
    const uid: Key = token && `${API_URL}/recipes`;
    const { data: response, error } = useSWR(uid, fetcher);
    return {
        data: response && response.data,
        response,
        error
    };
}

/* fetch current recording info */
export function useGetCurrentRecordingInfo(token, fetchAuth) {
    // get the authenticated fetch function
    const fetcher = (url: string) => fetchAuth(url).then((res) => res.json());
    // query the streamings endpoint (only if we have a token)
    const uid: Key = token && `${API_URL}/recordings/current`;
    const { data: response, error } = useSWR(uid, fetcher);
    return {
        data: response && response.data,
        response,
        error
    };
}

/* start recording */
export function useStartRecording(token, fetchAuth, serverStatusStart) {
     // get the authenticated fetch function
     const fetcher = (url: string) => fetchAuth(url, {
        method: "PUT"
      }).then((res) => res.json());
    const uid: Key = serverStatusStart === RequestStatus.STARTED && token && `${API_URL}/recordings/start`;
    const { data: response, error } = useSWR(uid, fetcher);

    if(serverStatusStart === RequestStatus.STARTED){
        console.log("SEERVER start:", response);
        return {
            data: response && response.data,
            response,
            error,
            status: RequestStatus.SUCCESS
        };
    }
    return {
        data: undefined,
        response: undefined,
        error: undefined,
        status: undefined
    };
}

/* stop recording */
export function useStopRecording(token, fetchAuth, serverStatusStop) {
    // get the authenticated fetch function
    const fetcher = (url: string) => fetchAuth(url, {
        method: "PUT"
      }).then((res) => res.json());
    const uid: Key = serverStatusStop === RequestStatus.STARTED && token && `${API_URL}/recordings/stop`;
    const { data: response, error } = useSWR(uid, fetcher);
    if(serverStatusStop === RequestStatus.STARTED) {
        return {
            data: response && response.data,
            response,
            error,
            status: RequestStatus.SUCCESS
        };
    }
    return {
        data: undefined,
        response: undefined,
        error: undefined,
        status: undefined
    };
}

/* delete recording */
export function useDeleteRecording(token, fetchAuth, delData: DeleteInfo) {
    // get the authenticated fetch function
    const fetcher = (url: string) => fetchAuth(url, {
        method: "DELETE"
      }).then((res) => res.json());
    const validation = delData && delData.name !== "" && delData.confirmation;
    const uid: Key = validation && token && `${API_URL}/recordings/` + delData.name;
    const { data: response, error } = useSWR(uid, fetcher);
    if(validation) {
        return {
            data: response && response.data,
            response,
            error,
            status: RequestStatus.SUCCESS
        };
    }
    return {
        data: undefined,
        response: undefined,
        error: undefined,
        status: undefined
    };
}

/* ************* End SWR React hooks ***************** */



/* *********** Accessing static files *************** */

export function getVideoPath(recordingName, videoName) {
    return API_URL + RECORDINGS_STATIC_PATH + `${recordingName}/${videoName}.mp4`
}

export function getAudioPath(recordingName) {
    return API_URL + RECORDINGS_STATIC_PATH + `${recordingName}/mic0.wav`;
}

export function getLiveVideo() {
    return `${API_URL}/mjpeg/main`;
}
/************** End Accessing static files ************/


/* *********** fetch data from API *************** */

export async function getEyeData(recordingName) {
    // const url ="https://api.ptg.poly.edu/recordings/static/coffee-test-1/eye.json";
    const url = API_URL +  RECORDINGS_STATIC_PATH + `${recordingName}/eye.json`;
    const response = await fetch(url).then((res) => res.json());
    return response;
}

export async function getHandData (recordingName) {
    // const url ="https://api.ptg.poly.edu/recordings/static/coffee-test-1/hand.json";
    const url = API_URL +  RECORDINGS_STATIC_PATH + `${recordingName}/hand.json`;
    const response = await fetch(url).then((res) => res.json());
    return response;
}

export async function getAllRecordings(token, fetchAuth) {
    // query the streamings endpoint (only if we have a token)
    const uid: Key = token && `${API_URL}/recordings`;
    const response = await fetchAuth(uid).then((res) => res.json());
    return response;
}

/* *********** End fetch data from API *************** */

