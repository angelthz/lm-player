import { PlaylistContextProvider, PlaylistType } from "./PlaylistContext";

import { AudioContextProvider } from "./AudioContext";
import { SongDTO } from "src/types/types";

interface Playlist {
    songs: SongDTO[];
    id: number;
    type: PlaylistType;

}

export default function PlayerProvider(
    { children, playlist, crossOrigin }:
        { children: React.ReactNode, crossOrigin?: boolean, playlist?: Playlist }) {
    return (
        <PlaylistContextProvider playlist={playlist}>
            <AudioContextProvider enableCrossOrigin={crossOrigin}>
                {children}
            </AudioContextProvider>
        </PlaylistContextProvider>
    )
}
