interface MemoryObject {
    center: {
        x: number,
        y: number,
        z: number
    },
    label: string,
    trackId: string,
    seenBefore: boolean
}

interface GazeInfo {
    gazeOrigin: number[],
    gazeDirection: number[]
}

export type {MemoryObject, GazeInfo};