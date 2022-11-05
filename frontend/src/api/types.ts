import { Dispatch, SetStateAction} from 'react';

export interface ContextProps {
    login:  Dispatch<SetStateAction<[string | null, string | null]>>;
    token: string | undefined;
    fetchAuth:  "" | ((url: string, opts?: RequestInit) => Promise<Response>) | undefined;
    headers: "" | { Authorization: string; } | undefined,
}

export interface ProviderProps {
    children?: React.ReactNode;
}

// const TokenContext = React.createContext<ContextProps>({
//   login: () => {},
//   token: "",
//   fetchAuth: () => {},
//   headers: { Authorization: ""}
// });

export interface Recipe {
    id: string;
    name: string;
    ingredients: string [];
    tools: string [];
    instructions: string [];
}

export interface LoginCredential {
    username: string,
    password: string,
}

export enum dataType {
    VIDEO = 'VIDEO',
    JSON = 'JSON',
    AUDIO = 'AUDIO',
  }
  
export enum streamingType {
    VIDEO_MAIN = 'main', // Main
    VIDEO_DEPTH = 'depthlt', // Depth
    VIDEO_GLL = 'gll', // Grey Left-Left
    VIDVIDEO_GLF = 'glf', // Grey Left-Front
    VIDEO_GRF = 'grf', // Grey Right-Front
    VIDEO_GRR = 'grr', // Grey Right-Right
    MIC = 'mic0', // microphone
    EYE = 'eye', // eye
    HAND = 'hand', // hand
    POINTCLOUD = 'pointcloud',
    IMUACCEL = 'imuaccel', //imu acceleration/accelerometer
    IMUGYRO = 'imugyro', //imu angular velocity/gyroscope
    IMUMAG = 'imumag' //imu magnetic force/magnetometer
}

export enum RequestStatus {
    STARTED = 'STARTED',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
    IN_PROGRESS = 'IN_PROGRESS',
    END = 'END',
  }

export interface responseServer {
    response: any,
    error: any,
    status: RequestStatus,
  }