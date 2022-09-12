import axios, {AxiosResponse, AxiosRequestConfig} from 'axios';
import React, { useRef, useEffect, useState } from 'react';
import useSWR, { Key } from 'swr';
import { DeleteInfo } from '../components/HistoricalDataView';
import { API_URL, WS_API_URL, RECORDINGS_STATIC_PATH } from '../config';
import { RequestStatus } from './types';
import { useToken } from '../api/TokenContext';
import useWebSocket, { ReadyState } from 'react-use-websocket';

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

export const unpackEntries = (offsets, content, utf=false) => {
    offsets = JSON.parse(offsets);
    return offsets.map(([sid, ts, ii], i) => {
        let data = content.slice(ii, offsets?.[i+1]?.[2]);
        data = utf ? new TextDecoder("utf-8").decode(data) : data
        return [sid, ts, parseInt(ts.split('-')), data]
    })
}

const useTimeout = (callback, delay, tock=null) => {
    const cb = useRef(callback);
    useEffect(() => { cb.current = callback; }, [callback]);
    useEffect(() => {
      const id = delay && setTimeout(() => cb.current?.(), delay);
      return () => id && clearTimeout(id);
    }, [delay, tock]);
};

export const useStreamData = ({ streamId, params=null, utf=false, timeout=6000 }) => {
    // query websocket
    const { token } = useToken();
    params = token && new URLSearchParams({ token, ...params }).toString()
    const { lastMessage, readyState,  ...wsData } = useWebSocket(
        token && streamId && `${WS_API_URL}/data/${streamId}/pull?${params}`);

    // parse data
    const offsets = useRef(null);
    const [ [sid, ts, time, data], setData ] = useState([null, null, null,  null])
    useEffect(() => {
        if(!lastMessage?.data) return;
        if(typeof lastMessage?.data === 'string') {
            offsets.current = lastMessage.data;
        } else {
            lastMessage.data.arrayBuffer().then((buf) => {
                const data = unpackEntries(offsets.current, buf, utf)
                setData(data[data.length-1]);  // here we're assuming we're only querying one stream
            })
        }
    }, [lastMessage]);

    useTimeout(() => {setData([null, null, null, null])}, timeout, data)
    return {sid, ts, time, data, readyState}
}
