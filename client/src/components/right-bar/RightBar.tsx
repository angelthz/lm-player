import { Pause, PauseIcon, PlayIcon } from "lucide-react";
import React, { memo, useEffect, useMemo } from "react";
import { usePlaylistVisibilityContext } from "src/context/PlaylistVisibilityContext";
import { BASE_URL } from "src/env/HostURL";
import { useAudioControls, useAudioState } from "src/player-context/AudioContext";
import { usePlaylistContext, usePlaylistControls, usePlaylistCurrent } from "src/player-context/PlaylistContext";


import { SongDTO } from "src/types/types";
import { logger } from "src/utils/Logger";

interface PlaylistRowProps { song: SongDTO, idx: number, isCurrent: boolean, isPlaying: boolean }

function PlaylistRow({ song, idx, isCurrent, isPlaying }: PlaylistRowProps) {
    // useEffect(() => logger.log("Right Bar, Row: ", song.songId))
    const playlistControls = usePlaylistControls();
    const audioControls = useAudioControls();

    return (
        <div
            className={`
                ${isCurrent ? "bg-white/25" : ""} 
                flex my-1 rounded-md py-1 hover:bg-white/10 transition-colors duration-300 ease-in-out
                select-none
                
                `}
            title={song.songTitle}
        >
            <div className="w-[40px] song-num flex justify-center items-center ">
                <span className="text-sm font-semibold">{idx + 1}</span>
            </div>
            <div className="song-cover w-[40px] flex justify-center items-center">
                {
                    !isCurrent ?
                        <button onClick={() => playlistControls.skipToId(song.songId)} className="block relative group cursor-pointer" >
                            <img className="w-[40px] aspect-square rounded-sm" src={`${BASE_URL}/${song.cover?.x64}`} alt="" />
                            <div className="absolute top-0 left-0 bottom-0 right-0 bg-main-dark-950/50 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-sm">
                                <PlayIcon className="fill-white stroke-0" />
                            </div>
                        </button>
                        : isPlaying ?
                            <button onClick={audioControls.pause} className="block relative group cursor-pointer" >
                                <img className="w-[40px] aspect-square rounded-sm" src={`${BASE_URL}/${song.cover?.x64}`} alt="" />
                                <div className={`${isPlaying ? "opacity-100" : "opacity-0"} absolute top-0 left-0 bottom-0 right-0 bg-main-dark-950/50 flex justify-center items-center group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-sm`}>
                                    <PauseIcon className="w-[20px] h-[20px] fill-white " />
                                    {/* <svg className="fill-white w-[20px] h-[20px]" viewBox="0 0 55 80" xmlns="http://www.w3.org/2000/svg" fill="hsl(228, 97%, 42%)"><g transform="matrix(1 0 0 -1 0 80)"><rect width="10" height="20" rx="3"><animate attributeName="height" begin="0s" dur="4.3s" values="20;45;57;80;64;32;66;45;64;23;66;13;64;56;34;34;2;23;76;79;20" calcMode="linear" repeatCount="indefinite" /></rect><rect x="15" width="10" height="80" rx="3"><animate attributeName="height" begin="0s" dur="2s" values="80;55;33;5;75;23;73;33;12;14;60;80" calcMode="linear" repeatCount="indefinite" /></rect><rect x="30" width="10" height="50" rx="3"><animate attributeName="height" begin="0s" dur="1.4s" values="50;34;78;23;56;23;34;76;80;54;21;50" calcMode="linear" repeatCount="indefinite" /></rect><rect x="45" width="10" height="30" rx="3"><animate attributeName="height" begin="0s" dur="2s" values="30;45;13;80;56;72;45;76;34;23;67;30" calcMode="linear" repeatCount="indefinite" /></rect></g></svg> */}
                                </div>
                            </button>
                            :
                            <button onClick={audioControls.play} className="block relative group cursor-pointer" >
                                <img className="w-[40px] aspect-square rounded-sm" src={`${BASE_URL}/${song.cover?.x64}`} alt="" />
                                <div className={`opacity-100 absolute top-0 left-0 bottom-0 right-0 bg-main-dark-950/50 flex justify-center items-center group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-sm`}>
                                    <PlayIcon className="fill-white stroke-0" />
                                </div>
                            </button>
                }
            </div>
            <div className="song-info w-[calc(100%-80px)]  h-auto px-2">
                <div className="w-full" style={{ "--ch-w": `${song.songTitle.length * 12.8}px` } as React.CSSProperties}>
                    <span className="text-nowrap block overflow-hidden whitespace-pre text-ellipsis font-semibold text-md">
                        {song.songTitle}
                    </span>
                </div>
                <div className=" w-full">
                    <span className="text-nowrap block overflow-hidden whitespace-pre text-ellipsis text-sm font-medium">
                        {song.artistName}
                    </span>
                </div>
            </div>
        </div>
    )
}

const PlaylistRowMemo = memo(PlaylistRow, (prev: PlaylistRowProps, next: PlaylistRowProps) => {
    return prev.isCurrent === next.isCurrent && prev.isPlaying === next.isPlaying;
})

export default function RightBar() {
    const playlist = usePlaylistContext();
    const playlistVisibility = usePlaylistVisibilityContext();
    const playlistCurrent = usePlaylistCurrent();
    const audioState = useAudioState();


    return (
        <div id='right-bar' className={`max-fit h-auto relative flex-[0_0_auto] hidden sm:block border-l border-(--active-border)`}>
            <div id="right-bar-container" className={`
                ${playlistVisibility.visible ? "w-[280px] px-2 " : "w-0 px-0"}
                pb-2
                h-[calc(100vh-90px)]
                sticky top-0 z-2 flex flex-col
                
                overflow-hidden
            `}>

                {playlistVisibility.visible &&
                    <>
                        <header className={`shrink-0`}>
                            <div id='title' className={`w-full h-[84px]  relative flex justify-center items-center `}>
                                <span className={`text-nowrap font-oswald text-white text-[20px] font-semibold group-hover:text-white`}>Current Playlist</span>
                            </div>
                        </header>
                        <div className={`grow overflow-y-scroll scrollbar-xs`}>
                            {
                                playlist.songs.map((song, idx) =>
                                    <PlaylistRowMemo
                                        song={song}
                                        idx={idx}
                                        isCurrent={song.songId === playlistCurrent.song?.songId}
                                        isPlaying={(song.songId === playlistCurrent.song?.songId) && audioState.isPlaying}
                                    >
                                    </PlaylistRowMemo>
                                )
                            }
                        </div>
                    </>
                }
            </div>

        </div>
    );

}