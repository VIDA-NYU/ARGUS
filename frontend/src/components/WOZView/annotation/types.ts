

interface AnnotationReasoningStep {
    type: "new_step" | "revert" | "machine_step" | "human_go_prev" | "human_go_next",
    time: number,
    step: number,
    prev: number,
}


interface AnnotationData {
    reasoningSteps: Array<AnnotationReasoningStep>
};

interface AnnotationProviderState {
    annotationData: AnnotationData,
    setAnnotationData: (newData: AnnotationData) => void | ((fn: (prevData: AnnotationData) => AnnotationData) => void)
}


export type {AnnotationData, AnnotationProviderState, AnnotationReasoningStep}