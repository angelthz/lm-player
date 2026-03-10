import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePlaylistContext, usePlaylistControls, usePlaylistCursor, usePlaylistPlayMode } from "./PlaylistContext";
import useNonNullableContext from "../hooks/useNonNullableContex";
import { logger } from "src/utils/Logger";
import { BASE_URL } from "src/env/HostURL";


export interface MediaError {
    code: number;
    type: string;
    msg: string;
}
const MediaErorrs: MediaError[] = [
    { code: 0, type: "NONE", msg: "" },
    { code: 1, type: "ABORTED_ERR", msg: "The fetching of the associated resource was aborted." },
    { code: 2, type: "NETWORK_ERR", msg: "Some kind of network error occurred which prevented the media from being successfully fetched." },
    { code: 3, type: "DECODE_ERR", msg: "An error occurred while trying to decode the media resource." },
    { code: 4, type: "SOURCE_ERR", msg: "The associated resource or media provider object has been found to be unsuitable." },
    { code: 5, type: "BROKE_ERR", msg: "Something broke. The solicited audio was impossible to play." },
];


interface AudioState {
    isPlaying: boolean;
    isLoading: boolean;
    // isReady: boolean;
    // hasError: boolean;
}

interface AudioControls {
    play: () => void;
    pause: () => void;
    togglePlay: () => void;
}

interface AudioProgress {
    currentTime: number;
    duration: number;
    progressHandler: (e: React.ChangeEvent) => void;
}

interface AudioVolume {
    volume: number;
    volumeHandler: (e: React.ChangeEvent) => void;
    mute: () => void;
    unmute: () => void;
    toggleVolume: () => void;
}


const AudioContext = createContext<HTMLAudioElement | null>(null); AudioContext.displayName = "AudioRef";
const AudioState = createContext<AudioState | null>(null); AudioState.displayName = "AudioState";
const AudioControls = createContext<AudioControls | null>(null); AudioControls.displayName = "AudioControls";
const AudioProgress = createContext<AudioProgress | null>(null); AudioProgress.displayName = "AudioProgress";
const AudioVolume = createContext<AudioVolume | null>(null); AudioVolume.displayName = "AudioVolume";
const AudioErrors = createContext<MediaError | null>(null); AudioErrors.displayName = "AudioErrors";


const AudioContextProvider = ({ children, enableCrossOrigin }: { children: React.ReactNode, enableCrossOrigin?: boolean }) => {
    //other contexts

    const { songs } = usePlaylistContext();
    const { isShuffle, repeatMode } = usePlaylistPlayMode();
    const playlistCursor = usePlaylistCursor();
    const playlistControls = usePlaylistControls();


    //context state
    const [isPlaying, setIsPlaying] = useState(false);
    // const [isReady, setIsReady] = useState(false);
    const [errors, setErrors] = useState<MediaError>(MediaErorrs[0]);

    const [isLoading, setIsLoading] = useState(false);

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    // const [isMuted, setIsMuted] = useState(false);

    //refs
    const audio = useRef(new Audio());
    const repeatRef = useRef(repeatMode);
    const cursorRef = useRef(playlistCursor);
    const errorsRef = useRef(errors);


    //effects

    //init audio listeners
    useEffect(() => {
        if (enableCrossOrigin)
            audio.current.crossOrigin = "anonymous";

        const waitingHandler = () => {
            setIsLoading(true);
        }

        const canplayHandler = () => {
            setIsLoading(false);
        }

        const loadHandler = () => {
            if (audio.current.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
                setCurrentTime(0);
                setDuration(audio.current.duration);
                if (errorsRef.current.code > 0) setErrors(MediaErorrs[0]);
                play();
            }
        }

        const timeUpdateHandler = () => {
            setCurrentTime(audio.current.currentTime)
        };

        const endedHandler = () => {
            logger.log("%c--> Skip Next", 'background: #1a1a1a; color:#FF6D1F;')
            //has next
            if (repeatRef.current === "song") {
                logger.log("$cRepeat song", 'background: #1a1a1a; color:yellow;')
                playlistControls.skipToPos(cursorRef.current.idx);
                return;
            }
            if (repeatRef.current === "playlist" && cursorRef.current.hasEnded) {
                logger.log("%cRepeat playlist", "background: #1a1a1a; color:pink;")
                playlistControls.skipToPos(0);
                return;
            }
            if (cursorRef.current.hasNext) {
                logger.log("%cSkip to next song", "background: #1a1a1a; color:slateblue;")
                playlistControls.skipNext();
                return;
            }
            if (cursorRef.current.hasEnded) {
                setIsPlaying(false);

                return;
            }
        }

        const errorHandler = () => {
            setCurrentTime(0);
            setDuration(0);
            setIsPlaying(false);
            setErrors(MediaErorrs[audio.current.error?.code || 5]);
        }

        audio.current.addEventListener("waiting", waitingHandler);
        audio.current.addEventListener("loadstart", waitingHandler);
        audio.current.addEventListener("canplay", canplayHandler);

        audio.current.addEventListener("loadeddata", loadHandler);
        audio.current.addEventListener("timeupdate", timeUpdateHandler);
        audio.current.addEventListener("ended", endedHandler);
        audio.current.addEventListener("error", errorHandler);
        return () => {
            audio.current.removeEventListener("loadeddata", loadHandler);
            audio.current.removeEventListener("timeupdate", timeUpdateHandler);
            audio.current.removeEventListener("ended", endedHandler);
            audio.current.removeEventListener("error", errorHandler);
            audio.current.pause();
            audio.current.currentTime = 0;
        };
    }, []);

    //update source
    useEffect(() => {
        if (songs.length > 0 && playlistCursor.action == "skip") {
            audio.current.load();
            audio.current.src = `${BASE_URL}/${songs[playlistCursor.idx]?.url?.replace("music/songs", "get/song")}`;
        }
    }, [playlistCursor])

    //update refs
    useEffect(() => { repeatRef.current = repeatMode }, [repeatMode]);

    useEffect(() => { cursorRef.current = playlistCursor }, [playlistCursor]);

    useEffect(() => { errorsRef.current = errors }, [errors])

    //update audio state if playlist is empty
    useEffect(() => {
        if (songs.length === 0) {
            audio.current.load();
            audio.current.removeAttribute("src")
            resetPlayer();
        }
    }, [songs])

    //functions
    const resetPlayer = useCallback(() => {
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        setErrors(MediaErorrs[0]);
    }, []);

    const progressHandler = useCallback((e: React.ChangeEvent) => {
        const selectedValue = Number.parseFloat((e.target as HTMLInputElement).value);
        audio.current.currentTime = selectedValue;
        setCurrentTime(selectedValue);
    }, []);

    const volumeHandler = useCallback((e: React.ChangeEvent) => {
        const selectedValue = Number.parseFloat((e.target as HTMLInputElement).value);
        audio.current.volume = selectedValue;
        setVolume(selectedValue);
    }, []);

    const mute = useCallback(() => {
        audio.current.volume = 0;
        setVolume(0);
    }, []);

    const unmute = useCallback(() => {
        audio.current.volume = 1;
        setVolume(1);
    }, [])

    const toggleVolume = useCallback(() => {
        if (audio.current.volume === 1) {
            mute()
        }
        else
            unmute();
    }, []);

    const play = useCallback(async () => {
        await audio.current.play();
        setIsPlaying(true);
    }, []);

    const pause = useCallback(() => {
        audio.current.pause();
        setIsPlaying(false);
    }, []);

    const togglePlay = useCallback(() => {
        if (audio.current.paused)
            play();
        else
            pause();
    }, []);

    //to export
    const audioState = useMemo(() => ({ isPlaying, isLoading }), [isPlaying, isLoading])

    const audioControls = useMemo(() => ({
        play,
        pause,
        togglePlay,
    }), []);

    const audioProgress = {
        currentTime,
        duration,
        progressHandler
    };

    const audioVolume = useMemo(() => ({
        volume,
        volumeHandler,
        mute,
        unmute,
        toggleVolume,
    }), [volume]);

    const audioErros = useMemo(() => (errors), [errors]);

    return (
        <AudioContext.Provider value={audio.current}>
            <AudioState.Provider value={audioState}>
                <AudioControls.Provider value={audioControls}>
                    <AudioProgress.Provider value={audioProgress}>
                        <AudioVolume.Provider value={audioVolume}>
                            <AudioErrors.Provider value={audioErros}>
                                {children}
                            </AudioErrors.Provider>
                        </AudioVolume.Provider>
                    </AudioProgress.Provider>
                </AudioControls.Provider>
            </AudioState.Provider>
        </AudioContext.Provider>)
}


const useAudioContext = () => useNonNullableContext(AudioContext);
const useAudioState = () => useNonNullableContext(AudioState);
const useAudioControls = () => useNonNullableContext(AudioControls);
const useAudioProgress = () => useNonNullableContext(AudioProgress);
const useAudioVolume = () => useNonNullableContext(AudioVolume);
const useAudioErrors = () => useNonNullableContext(AudioErrors);

export {
    AudioContext,
    AudioContextProvider,
    useAudioContext,
    useAudioState,
    useAudioControls,
    useAudioProgress,
    useAudioVolume,
    useAudioErrors
}