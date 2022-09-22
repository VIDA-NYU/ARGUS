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

export type {MemoryObject};