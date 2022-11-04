

interface AnnotationReasoningStep {
    type: "new_step" | "revert" | "machine_step" | "human_go_prev" | "human_go_next",
    time: number,
    step: number,
    prev: number,
}

interface AnnotationMeta {
    mode: "undefined" | "offline" | "online",
    id: string,
    recipeID: string,
    entryTime: number,
    initialized: boolean
}


interface AnnotationData {
    reasoningSteps: Array<AnnotationReasoningStep>,
    meta: AnnotationMeta
}

interface AnnotationProviderState {
    annotationData: AnnotationData,
    setAnnotationData: (newData: AnnotationData) => void | ((fn: (prevData: AnnotationData) => AnnotationData) => void)
}


export type {AnnotationData, AnnotationProviderState, AnnotationReasoningStep, AnnotationMeta}