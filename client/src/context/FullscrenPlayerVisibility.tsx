import React, { createContext, useContext, useMemo, useState } from "react";
import ContextError from "./ContextError";

const FullscreenPlayerContext = createContext<{ isVisible: boolean } | null>(null);
const FullscreePlayerActions = createContext<{ updateVisibility: () => void } | null>(null);

const FullscreenPlayerContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isVisible, setIsVisible] = useState(false);

    const fullscreenPlayerActions = useMemo(() => ({
        updateVisibility: () => setIsVisible(prev => !prev)
    }), []);

    const fullscrenPlayerState = useMemo(() => ({
        isVisible
    }), [isVisible]);

    return (
        <FullscreenPlayerContext.Provider value={fullscrenPlayerState}>
            <FullscreePlayerActions.Provider value={fullscreenPlayerActions}>
                {children}
            </FullscreePlayerActions.Provider>
        </FullscreenPlayerContext.Provider>
    )
}


const useFullscreenPlayerState = () => {
    const context = useContext(FullscreenPlayerContext);
    if (!context) throw new ContextError("useFullscreenPlayerState");
    return context;
}

const useFullscreenPlayerActions = () => {
    const context = useContext(FullscreePlayerActions);
    if (!context) throw new ContextError("useFullscreenPlayerActions");
    return context;
}


export {
    FullscreenPlayerContext,
    FullscreenPlayerContextProvider,
    useFullscreenPlayerState,
    useFullscreenPlayerActions
};