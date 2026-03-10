import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import useNonNullableContext from "src/hooks/useNonNullableContex";
import { SongDTO } from "src/types/types";
import { ArrayUtils } from "src/utils/ArrayUtils";
import { logger } from "src/utils/Logger";





export type PlaylistType = "none" | "artist" | "album" | "playlist" | "song";
export type RepeatMode = "none" | "song" | "playlist";
export type CursorAction = "skip" | "hold";

//state
interface PlaylistSongs {
    songs: SongDTO[];
}

interface PlaylistProps {
    id: number;
    type: PlaylistType;
    isEmpty: boolean;
}

interface PlaylistPlayMode {
    isShuffle: boolean;
    repeatMode: RepeatMode;
}

interface PlaylistCurrent {
    song: SongDTO | null;
    pos: number;
    of: number;
}

interface PlaylistCursor {
    hasPrev: boolean;
    idx: number;
    hasNext: boolean;
    hasEnded: boolean;
    action: CursorAction;
}

//actions
interface PlaylistActions {
    update: (songs: SongDTO[], id: number, type: PlaylistType, initShuffle?: boolean, initFrom?: number) => void;
    add: (song: SongDTO) => void;
    remove: (songID: number, idx: number) => void;
    clear: () => void;
}

interface PlaylistControls {
    skipPrev: () => void;
    skipToPos: (idx: number) => void;
    skipToId: (idx: number) => void;
    skipNext: () => void;
    toggleShuffle: () => void;
    toggleRepeat: () => void;
}

const PlaylistContext = createContext<PlaylistSongs | null>(null); PlaylistContext.displayName = "PlaylistSongs";
const PlaylistMeta = createContext<PlaylistProps | null>(null); PlaylistMeta.displayName = "PlaylistProps";

const PlaylistPlayMode = createContext<PlaylistPlayMode | null>(null); PlaylistPlayMode.displayName = "PlaylistPlayMode";

const PlaylistCursor = createContext<PlaylistCursor | null>(null); PlaylistCursor.displayName = "PlaylistCursor";

const PlaylistCurrent = createContext<PlaylistCurrent | null>(null); PlaylistCurrent.displayName = "PlaylistCurrentSong";
const PlaylistActions = createContext<PlaylistActions | null>(null); PlaylistActions.displayName = "PlaylistActions";
const PlaylistControls = createContext<PlaylistControls | null>(null); PlaylistControls.displayName = "PlaylistControls";

interface ProviderProps {
    children: React.ReactNode;
    playlist?: {
        songs: SongDTO[];
        id: number;
        type: PlaylistType;
    }
}


const PlaylistContextProvider = ({ children, playlist }: ProviderProps) => {
    //state
    //playlist props
    const [songs, setSongs] = useState<SongDTO[]>(playlist ? playlist.songs : []);


    const [playlistProps, setPlaylistProps] = useState<PlaylistProps>({
        id: playlist ? playlist.id : 0,
        type: playlist ? playlist.type : "none",
        isEmpty: playlist ? playlist.songs.length < 1 : true
    });
    //playlist modes
    const [isShuffle, setShuffle] = useState(false);
    const [repeatMode, setRepeatMode] = useState<RepeatMode>("none");
    //current
    const [currentSong, setCurrentSong] = useState<PlaylistCurrent | null>({ song: null, pos: 0, of: 0 });
    //cursor
    const [cursor, setCursor] = useState<PlaylistCursor>({ hasPrev: false, idx: 0, hasNext: false, hasEnded: false, action: "skip" });

    //refs
    const songsRef = useRef(songs);
    const cursorRef = useRef(cursor);
    const repeatRef = useRef(repeatMode);
    const shuffleRef = useRef(isShuffle);
    const shuffledSongs = useRef<SongDTO[]>([]);

    //init


    useEffect(() => {
        //update current song state
        setCurrentSong({ song: songs[cursor.idx], pos: cursor.idx, of: songs.length });
        cursorRef.current = cursor;
    }, [cursor]);

    useEffect(() => {
        //update empty state
        // if (songs.length < 1)
        //     setIsEmpty(true);
        // else if (isEmpty)
        //     setIsEmpty(false);
        if (songs.length < 1)
            setPlaylistProps(prev => ({ ...prev, isEmpty: true }))
        else if (playlistProps.isEmpty)
            setPlaylistProps(prev => ({ ...prev, isEmpty: false }))

        // setIsEmpty(false);
        shuffledSongs.current = songs;

    }, [songs]);

    //update refs
    useEffect(() => { repeatRef.current = repeatMode }, [repeatMode]);
    useEffect(() => {
        shuffleRef.current = isShuffle;

    }, [isShuffle]);

    // props
    const playlistSongsCtx: PlaylistSongs = useMemo(() => ({ songs }), [songs,]);

    const playlistPropsCtx: PlaylistProps = useMemo(() => playlistProps, [playlistProps])

    const playlistPlayModesCtx = useMemo(() => ({
        isShuffle,
        repeatMode
    }), [isShuffle, repeatMode]);

    const playlistCursor = useMemo(() => cursor, [cursor]);

    const playlistCurrent = useMemo(() => currentSong, [currentSong]);

    // actions
    const playlistActions = useMemo(() => ({
        update: (songs: SongDTO[], id: number, type: PlaylistType, initShuffle = false, initFrom = 0) => {
            // logger.log("initShuffle? ", initShuffle);
            let songsNum = songs.length;

            setSongs(initShuffle ? ArrayUtils.shuffle(songs) : songs);
            setPlaylistProps({ id, type, isEmpty: songsNum < 1 })
            setShuffle(initShuffle);
            if (initFrom > songs.length || initFrom < 0)
                setCursor({ hasPrev: false, idx: 0, hasNext: songsNum > 1, hasEnded: songsNum <= 1, action: "skip" });
            else
                setCursor({ hasPrev: initFrom > 0, idx: initFrom, hasNext: initFrom < songsNum - 1, hasEnded: initFrom === songsNum - 1, action: "skip" });

            // if (initFrom < 0 || initFrom > songsLenght - 1)
            //     setCursor({ hasPrev: false, idx: 0, hasNext: songsLenght > 1, hasEnded: songsLenght <= 1, action: "skip" })
            // else
            //     setCursor({ hasPrev: initFrom > 0, idx: initFrom, hasNext: initFrom < songsLenght - 1, hasEnded: initFrom === songsLenght - 1, action: "skip" })
            songsRef.current = songs;
        },
        add: (song: SongDTO) => {
            setSongs(prev => {
                let newSongs = [...prev, song];
                songsRef.current = newSongs;
                return newSongs;
            });
            setCursor(prev => ({
                ...prev,
                hasPrev: cursorRef.current.idx > 0,
                hasNext: songsRef.current.length > 1,
                hasEnded: cursorRef.current.idx === songsRef.current.length - 1,
                action: songsRef.current.length > 1 ? "hold" : "skip"
            }));

        },
        remove: (songID: number, index: number) => {
            setSongs(prev => {
                let filteredSongs = prev.filter((song, idx) => index !== idx);
                songsRef.current = filteredSongs;
                return filteredSongs;
            })

            logger.log(songsRef.current.length)

            //previous to lastest and latest is current
            if (cursorRef.current.idx > index) {
                logger.log("previous to latest current");
                let cur = cursorRef.current.idx - 1;
                // setCursor(prev => ({ ...prev, idx: cursorRef.current.idx - 1, action: "hold" }));
                setCursor({
                    hasPrev: cur > 0,
                    idx: cur,
                    hasNext: false,
                    hasEnded: cur === songsRef.current.length,
                    action: "hold"
                });
                return;
            }

            // empty playlist
            if (songsRef.current.length === 0) {
                logger.log("empty playlist");
                setCursor({ hasPrev: false, idx: 0, hasNext: false, hasEnded: true, action: "skip" });
                return;
            }

            //latest item removed
            if (index === songsRef.current.length && index === cursorRef.current.idx) {
                logger.log("latest item removed")
                setCursor(prev => ({ ...prev, idx: index - 1, action: "skip" }));
                return;
            }

            //current item removed
            if (index === cursorRef.current.idx) {
                logger.log("current item removed")
                setCursor(prev => ({ ...prev, index, action: "skip" }));
                return;
            }

            // if (songsRef.current.length === 1)
            setCursor(prev => ({
                ...prev,
                hasPrev: cursorRef.current.idx > 0,
                hasNext: songsRef.current.length > 1,
                hasEnded: cursorRef.current.idx === songsRef.current.length - 1,
                action: "hold"
            }));
        },
        clear: () => {
            setSongs([]);
        }
    }), [])



    const playlistControls = useMemo(() => ({
        skipPrev: () => {
            let cur = cursorRef.current.idx;
            let idx = cur - 1;
            // 0 1 2 / 1 2 3
            if (idx < 0) return;
            console.debug(`%cskip to Prev song`, "background:#181818; color:#c276d9; font-weight:700;")
            // 1, 0, -1
            setCursor({
                hasPrev: idx > 0, // 1>0: true, 0>0: false
                idx,  // 1, 0
                hasNext: songsRef.current.length > 1, // true, 3>1: true
                hasEnded: idx === songsRef.current.length - 1, // false, 0===3: false,
                action: "skip"
            })
        },
        skipToPos: (idx: number) => {

            let songsLenght = songsRef.current.length - 1;
            //songsLenght = 3, idx=-1 -1<0 return / idx=4, 4>2 return / idx=2 2<0 false, 2>3 false
            if (idx < 0 || idx > songsLenght) return;

            //[0,1,2,3,4,5] cur=2 skipTo= 4
            setCursor({
                hasPrev: idx > 0,
                idx,
                hasNext: idx < songsLenght,
                hasEnded: idx === songsLenght,
                action: "skip"
            })

        },
        skipToId: (id: number) => {
            logger.log("skip to song by id: ", id)
            let idx = shuffledSongs.current.findIndex(s => s.songId === id) || 0;
            let songsLenght = songsRef.current.length - 1;
            logger.log("find at idx: ", idx)
            //[0,1,2,3,4,5] cur=2 skipTo= 4
            setCursor({
                hasPrev: idx > 0,
                idx,
                hasNext: idx < songsLenght,
                hasEnded: idx === songsLenght,
                action: "skip"
            })

        },
        skipNext: () => {
            let cur = cursorRef.current.idx;
            let idx = cur + 1;
            // 0 1 2 / 1 2 3
            if (idx > songsRef.current.length - 1) return; // 3<3 false-return
            console.debug(`%cskip to Next song`, "background:#181818; color:#c276d9; font-weight:700;")
            //0+1=1, 1+1=2, 2+1=3
            setCursor({
                hasPrev: songsRef.current.length > 1, // 3>1:true, 3>1:true
                idx,// 1, 2
                hasNext: idx < songsRef.current.length - 1, // 1<3: true, 2<3:true
                hasEnded: idx === songsRef.current.length - 1, // 1===2:false, 2==2, true
                action: "skip"
            })
        },
        toggleShuffle: () => {
            if (shuffleRef.current) {
                setSongs(songsRef.current);
                setShuffle(false)
            }
            else {
                setSongs(ArrayUtils.shuffle(songsRef.current));
                setShuffle(true)
            }
            setCursor({ hasPrev: false, idx: 0, hasNext: songsRef.current.length > 1, hasEnded: false, action: "skip" });
        },
        toggleRepeat: () => {
            let mode: RepeatMode = "none";

            if (repeatRef.current === "none")
                mode = "song"
            if (repeatRef.current === "song")
                mode = "playlist"
            if (repeatRef.current === "playlist")
                mode = "none"

            setRepeatMode(mode);
        }
    }), []);

    return (
        <PlaylistContext.Provider value={playlistSongsCtx}>
            <PlaylistMeta.Provider value={playlistPropsCtx}>
                <PlaylistPlayMode.Provider value={playlistPlayModesCtx}>
                    <PlaylistCursor.Provider value={playlistCursor}>
                        <PlaylistCurrent.Provider value={playlistCurrent}>
                            <PlaylistActions.Provider value={playlistActions}>
                                <PlaylistControls.Provider value={playlistControls}>
                                    {children}
                                </PlaylistControls.Provider>
                            </PlaylistActions.Provider>
                        </PlaylistCurrent.Provider>
                    </PlaylistCursor.Provider>
                </PlaylistPlayMode.Provider>
            </PlaylistMeta.Provider>
        </PlaylistContext.Provider >
    )
}


const usePlaylistContext = () => useNonNullableContext(PlaylistContext);
const usePlaylistProps = () => useNonNullableContext(PlaylistMeta);
const usePlaylistPlayMode = () => useNonNullableContext(PlaylistPlayMode);
const usePlaylistCurrent = () => useNonNullableContext(PlaylistCurrent);
const usePlaylistCursor = () => useNonNullableContext(PlaylistCursor);
const usePlaylistActions = () => useNonNullableContext(PlaylistActions);
const usePlaylistControls = () => useNonNullableContext(PlaylistControls);

export {
    PlaylistContext,
    PlaylistContextProvider,
    usePlaylistContext,
    usePlaylistProps,
    usePlaylistPlayMode,
    usePlaylistCursor,
    usePlaylistCurrent,
    usePlaylistActions,
    usePlaylistControls
}