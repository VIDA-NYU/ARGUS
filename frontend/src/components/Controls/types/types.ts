export interface MediaState {
    pip?: boolean;
    playing: boolean;
    controls?: boolean;
    light?: boolean;
    played: number;
    duration?: number;
    playbackRate: number;
    loop?: boolean;
    seeking: boolean;
    totalDuration?: string;
    currentTime?: string;
}