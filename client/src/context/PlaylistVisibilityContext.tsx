import React, { createContext, useContext, useMemo, useState } from "react";
import ContextError from "./ContextError";

const PlaylistVisibilityContext = createContext<{ visible: boolean } | null>(null);
const PlaylistVisibilityActions = createContext<{ updateVisibility: () => void } | null>(null);

const PlaylistVisibilityContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isVisible, setIsVisible] = useState(false);

    const playlistVisibilitActions = useMemo(() => ({
        updateVisibility: () => setIsVisible(prev => !prev)
    }), []);

    const playlistVisibilityContext = useMemo(() => ({
        visible: isVisible
    }), [isVisible]);

    return (
        <PlaylistVisibilityContext.Provider value={playlistVisibilityContext}>
            <PlaylistVisibilityActions.Provider value={playlistVisibilitActions}>
                {children}
            </PlaylistVisibilityActions.Provider>
        </PlaylistVisibilityContext.Provider>
    )
}


const usePlaylistVisibilityContext = () => {
    const context = useContext(PlaylistVisibilityContext);
    if (!context) throw new ContextError("usePlaylistVisibilityContext");
    return context;
}

const usePlaylistVisibilityActions = () => {
    const context = useContext(PlaylistVisibilityActions);
    if (!context) throw new ContextError("usePlaylistVisibilityActions");
    return context;
}


export {
    PlaylistVisibilityContext,
    PlaylistVisibilityContextProvider,
    usePlaylistVisibilityContext,
    usePlaylistVisibilityActions
};