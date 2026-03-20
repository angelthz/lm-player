import { Link } from "@tanstack/react-router";
import { ClockIcon, HeartIcon, MoreHorizontalIcon, PauseIcon, PlayIcon } from "lucide-react";
import React, { memo, useCallback, useEffect, useState } from "react";
import { BASE_URL } from "src/env/HostURL";
import { useAudioContext, useAudioControls, useAudioState } from "src/player-context/AudioContext";
import { usePlaylistActions, usePlaylistProps } from "src/player-context/PlaylistContext";
import { SongDTO } from "src/types/types";
import { TextUtils } from "src/utils/FormatText";


interface RankedPlaylistProps {
    songs: SongDTO[],
    title: string,
    artist?: boolean,
    album?: boolean
}


interface RowItemProps {
    song: SongDTO;
    idx: number;
    mostPlayedValue: number;
    playSelectedHandler: (id: number) => void;
    isActive?: boolean;
    isPlaying?: boolean;
    artist?: boolean;
    album?: boolean;
}

function RowItem({ song, idx, mostPlayedValue, playSelectedHandler, isActive, isPlaying, artist = true, album = false }: RowItemProps) {
    const audio = useAudioContext();
    const audioActions = useAudioControls();
    const play = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isActive)
            audio.play();
    }

    const pause = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isActive)
            audio.pause();
    }

    useEffect(() => {
        console.log(`%cRendering Row`, 'background: #1a1a1a; color: #ED3E67;')
        console.log(Math.round((song.playCount * 100) / mostPlayedValue))
    })
    return (
        <div
            className={`${isActive && "bg-white/5"} grid grid-cols-[repeat(2,48px)_repeat(8,1fr)_repeat(2,48px)] grid-rows-[repeat(2,24px)]  rounded-md my-2 text-sm font-semibold hover:backdrop-blur-xl  hover:bg-white/15  transition-colors duration-300 ease-in-out`}>

            <div id="song-num" className="song-num col-span-1 row-span-2  flex justify-center items-center">
                <span>{idx + 1}</span>
            </div>

            <div id="song-controls" className="col-span-1 row-span-2 flex items-center cursor-pointer p-1 ">
                {
                    !isActive ?
                        <button onClick={() => playSelectedHandler(song.songId)} className="block relative group cursor-pointer" >
                            <img className="w-[46px] aspect-square rounded-sm" src={`${BASE_URL}/${song.cover?.x64}`} alt="" />
                            <div className="absolute top-0 left-0 bottom-0 right-0 bg-main-dark-950/50 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-sm">
                                <PlayIcon className="fill-white stroke-0" />
                            </div>
                        </button>
                        :
                        isPlaying ?
                            <button onClick={pause} className="block relative group cursor-pointer" >
                                <img className="w-[46px] aspect-square rounded-sm" src={`${BASE_URL}/${song.cover?.x64}`} alt="" />
                                <div className={`${isActive && isPlaying ? "opacity-100" : ""} absolute top-0 left-0 bottom-0 right-0 bg-main-dark-950/50 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-sm`}>
                                    <PauseIcon className="fill-white stroke-0" />
                                </div>
                            </button>
                            :
                            <button onClick={play} className="block relative group cursor-pointer" >
                                <img className="w-[46px] aspect-square rounded-sm" src={`${BASE_URL}/${song.cover?.x64}`} alt="" />
                                <div className="absolute top-0 left-0 bottom-0 right-0 bg-main-dark-950/50 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-sm">
                                    <PlayIcon className="fill-white stroke-0" />
                                </div>
                            </button>
                }
            </div>

            <div id="song-title" title={song.songTitle}
                className="col-span-6 md:col-span-2 col-start-3 row-span-1 md:row-span-2  flex items-center pl-4">
                <p className="block overflow-hidden whitespace-pre text-ellipsis cursor-pointer">
                    {song.songTitle}
                </p>
            </div>

            <div id="song-artists" className="col-span-6 md:col-span-2  col-start-3 row-span-1 md:row-span-2 md:columns-3 row-start-2   flex gap-6 items-center px-4">
                <Link
                    to="/artists/$artistId/$artistName"
                    params={{
                        artistName: TextUtils.toKebabCase(song.artistName),
                        artistId: song.artistId,
                    }}
                    className="overflow-hidden whitespace-pre text-ellipsis cursor-pointer hover:underline hover:decoration-2 transition-all ease-in-out duration-300"
                >
                    {song.artistName}
                </Link>
                {
                    song.collaborators && song.collaborators.length > 1 &&
                    <button className="w-[32px] aspect-square flex justify-center items-center rounded-full cursor-pointer hover:bg-white/30 transition-colors ease-in-out duration-300">

                    </button>
                }

                {
                    (song.collaborators && song.collaborators.length === 1) &&
                    song.collaborators.map((col) => (
                        <Link
                            to="/artists/$artistName/$artistId"
                            params={{ artistName: TextUtils.toKebabCase(col.name), artistId: col.id, }}
                            className="overflow-hidden whitespace-pre text-ellipsis cursor-pointer hover:underline hover:decoration-2 transition-all ease-in-out duration-300"
                        >
                            {col.name}
                        </Link>
                    ))
                }
            </div>

            <div className="song-chart col-span-3  row-span-2   flex gap-6 items-center px-4">
                <div id='play-charts' className='w-full md:w-(--bar-w) h-[26px] md:bg-white/10 backdrop-blur-2xl rounded-2xl flex justify-start px-3 items-center' style={{ "--bar-w": `${(song.playCount * 100) / mostPlayedValue}%` } as React.CSSProperties}>
                    {
                        // Array(Math.round((song.playCount * 100) / mostPlayedValue)).fill(0).map(n => <span>|</span>)
                    }
                    <span className="text-xs text-center md:text-left font-semibold inline-block w-full">{song.playCount}</span>
                </div>
            </div>

            {/* <div className=" col-span-1 row-span-2 flex justify-center items-center ">
                <button className="cursor-pointer">
                    <i>
                        <HeartIcon className="w-[20px] aspect-square hover:fill-alabaster-50 stroke-2 transition-colors ease-in-out duration-300"></HeartIcon>
                    </i>
                </button>
            </div>
            <div className="col-span-1 row-span-2 justify-center items-center hidden md:flex">
                <span className="">
                    {song.duration?.minutes.toFixed(2).replace(".", ":")}
                </span>
            </div> */}

            <div className="song-favorite col-span-1 row-span-2 hidden md:flex justify-center items-center ">
                <button className="cursor-pointer">
                    <i>
                        <HeartIcon className="w-[20px] aspect-square hover:fill-alabaster-50 stroke-2 transition-colors ease-in-out duration-300"></HeartIcon>
                    </i>
                </button>
            </div>

            <div className="song-menu col-span-1 row-span-2 justify-center items-center flex">
                <span className="">
                    <i>
                        <MoreHorizontalIcon></MoreHorizontalIcon>
                    </i>
                </span>
            </div>
        </div>
    );

}


const RowItemMemo = memo(RowItem, (prev: RowItemProps, next: RowItemProps) => {
    return prev.isActive === next.isActive && prev.isPlaying === next.isPlaying;
})


export function RankedPlaylist({ songs, title, artist = true, album = false }: RankedPlaylistProps) {
    const [mostPlayedValue, setMostPlayedValue] = useState(songs.sort((a, b) => b.playCount - a.playCount)[0].playCount);
    //context
    const playlistActions = usePlaylistActions();
    const playlistProps = usePlaylistProps();
    const audioState = useAudioState();


    const playSelected = useCallback(async (id: number) => {
        try {
            //replace with a stale fetch
            let req = await fetch(`${BASE_URL}/api/music/songs/${id}`);
            if (!req.ok) throw new Error(`Error fetching album: ${id}`)
            let json = await req.json() as SongDTO;
            playlistActions.update([json], id, "song");
        } catch (err) {
            console.error(err);
        }
    }, []);


    useEffect(() => { console.log(`%cRendering Ranked Playlist`, 'background: #1a1a1a; color: #EDC43E;') })

    return (
        <div className='ranked-playlist'>
            <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
            <div className="table-header my-2 border-b border-b-stone-800 py-1">
                <div className="grid grid-cols-[repeat(2,48px)_repeat(6,1fr)_repeat(4,48px)] text-sm font-semibold">
                    <div className="col-span-1 text-center">
                        <span className="">#</span>
                    </div>
                    <div className="col-span-2 col-start-3 px-4">
                        <span>Song</span>
                    </div>
                    {
                        (artist && !album) &&
                        <div className="col-span-2 col-start-5 px-4 hidden md:block">
                            <span>Artist</span>
                        </div>
                    }
                    {
                        (album) &&
                        <div className="col-span-2 col-start-5 px-4 hidden md:block">
                            <span>Album</span>
                        </div>
                    }
                    <div className="col-span-2 col-start-10  md:col-start-7 px-2 ">
                        <span>Plays</span>
                    </div>
                    {/* <div className="col-span-1 col-start-10 px-2 hidden md:flex justify-center ">
                        <i><ClockIcon className="w-[18px] h-[18px]"></ClockIcon></i>
                    </div> */}

                </div>
            </div>
            <div className="table-body">
                {
                    songs.length > 0 ?
                        songs.slice(0, 10).map((song, idx) =>
                            <RowItemMemo
                                song={song}
                                idx={idx}
                                mostPlayedValue={mostPlayedValue}
                                playSelectedHandler={playSelected}
                                isActive={(playlistProps.type === "song") && (song.songId === playlistProps.id)}
                                isPlaying={(playlistProps.type === "song" && song.songId === playlistProps.id) && audioState.isPlaying}
                                album={album}
                            ></RowItemMemo>)
                        :
                        <h3 className="text-2xl font-bold text-white">Empty Activity</h3>

                }
            </div>
        </div>

    )
}