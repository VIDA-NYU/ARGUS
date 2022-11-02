

interface AnnotationReasoningStep {
    type: "new_step",
    time: number,
    step: number
}


interface AnnotationData {
    reasoningSteps: Array<AnnotationReasoningStep>
};

interface AnnotationProviderState {
    annotationData: AnnotationData,
    setAnnotationData: (newData: AnnotationData) => void | ((fn: (prevData: AnnotationData) => AnnotationData) => void)
}


export type {AnnotationData, AnnotationProviderState}