import axios, {AxiosResponse, AxiosRequestConfig} from 'axios';
import React, { useEffect, useRef, useCallback, useState } from 'react';
import useSWR, { Key } from 'swr';
import { DeleteInfo } from '../components/HistoricalDataView';
import { API_URL, WS_API_URL, RECORDINGS_STATIC_PATH } from '../config';
import { RequestStatus } from './types';
import { useToken } from './TokenContext';
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


const useInterval = (callback, delay) => {
    const cb = useRef(callback);
    useEffect(() => { cb.current = callback; }, [callback]);
    useEffect(() => {
      const id = delay && setInterval(() => cb.current?.(), delay);
      return () => id && clearInterval(id);
    }, [delay]);
  };
  
export const useRecordingControls = () => {
    const { fetchAuth } = useToken();
    // store errors for starting and stopping requests
    const [ [startError, stopError], setClickError ] = useState([null, null]);
    const [ loading, setLoading ] = useState(null);
    // used to store the meta about a recording that just finished
    const [ finishedRecording, setFinishedRecording ] = useState(null);

    // stay up to date on the current recording info
    const { data: recordingData, error: recordingDataError, mutate } = useSWR(
        fetchAuth && `${API_URL}/recordings/current?info=true`, 
        url => fetchAuth && fetchAuth(url).then(r=>r.json()));
    const recordingId = recordingData?.name;

    // update the recording info while it's active
    useInterval(() => { mutate() }, recordingId ? 1000 : null)

    // start/stop
    const startRecording = () => {
        setLoading(true);
        fetchAuth && fetchAuth(`${API_URL}/recordings/start`, { method: 'PUT' })
                .then(r=>r.text())
                .then(d=>{ console.log(d);mutate();setClickError([null,null]) })
                .catch(e=>setClickError([e,null]));
        setFinishedRecording(null);
    }
    // useCallback(, [fetchAuth])
    const stopRecording = () => {
        setLoading(true);
        fetchAuth && fetchAuth(`${API_URL}/recordings/stop`, { method: 'PUT' })
                .then(r=>r.text()).then(d=>{ mutate(); setClickError([null,null]); setLoading(false) })
                .catch(e=>{ setClickError([null,e]); setLoading(false) });
        fetchAuth && recordingId && fetchAuth(`${API_URL}/recordings/${recordingId}`)
                .then(r=>r.json())
                .then(d=>setFinishedRecording(d)).catch(e=>console.error(e));
    }
    // useCallback(, [fetchAuth, recordingId])

    return {
      recordingId, 
      recordingData, finishedRecording,
      loading, 
      recordingDataError, startError, stopError,
      startRecording,
      stopRecording,
    }
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

export const unpackEntries = (offsets, content, parse=null, utf=false) => {
    offsets = JSON.parse(offsets);
    return offsets.map(([sid, ts, ii], i) => {
        let data = content.slice(ii, offsets?.[i+1]?.[2]);
        data = utf ? new TextDecoder("utf-8").decode(data) : data;
        data = parse ? parse(data) : data;
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

export const useStreamData = ({ streamId, params=null, parse=null, utf=false, multiple=false, timeout=12000 }) => {
    // query websocket
    const { token } = useToken();
    params = token && new URLSearchParams({ token, ...params }).toString()
    
    const didUnmount = useRef(false);
    useEffect(() => (() => { didUnmount.current = true }), []);
    const { lastMessage, readyState } = useWebSocket(
        token && streamId && `${WS_API_URL}/data/${streamId}/pull?${params}` || null, {
            shouldReconnect: e => didUnmount.current === false,
            reconnectInterval: 5000,
            reconnectAttempts: 12,
            filter: e => {
                if(typeof e?.data === 'string') {
                    offsets.current = e.data;
                    return false;
                }
                return true;
            }
    });

    // parse data
    const offsets = useRef(null);
    const [ [sid, ts, time, data], setData ] = useState([null, null, null,  null])
    useEffect(() => {
        if(!lastMessage?.data || !offsets.current) return;
        lastMessage.data.arrayBuffer().then(buf => {
            const data = unpackEntries(offsets.current, buf, parse, utf)
            setData(multiple ? data : data[data.length-1]);  // here we're assuming we're only querying one stream
        })
    }, [lastMessage]);

    useTimeout(() => {setData([null, null, null, null])}, timeout, data)
    return {sid, ts, time, data, readyState}
}
