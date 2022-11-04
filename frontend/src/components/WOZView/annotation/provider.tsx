import {createContext, useState, useContext} from "react";
import {createInitialAnnotationData} from "./utils";
import {AnnotationData, AnnotationProviderState} from "./types";

export const AnnotationContext = createContext<AnnotationProviderState>(
    {
        annotationData: createInitialAnnotationData(),
        setAnnotationData: (newAnnotationData) => {},
    });

export const useAnnotationContext = () => useContext(AnnotationContext);

export const AnnotationProvider = ({ children }) => {
    const [annotationState, setAnnotationState] = useState<AnnotationData>(createInitialAnnotationData());

    let providerState = {
        annotationData: annotationState,
        setAnnotationData: setAnnotationState
    }

    return (
        <AnnotationContext.Provider value={providerState}>
            {children}
        </AnnotationContext.Provider>
    );
};

