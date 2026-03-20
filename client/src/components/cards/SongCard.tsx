import { Link } from "@tanstack/react-router";
import { PauseIcon, PlayIcon } from "lucide-react";
import { memo, useEffect } from "react";
import { BASE_URL } from "src/env/HostURL";
import { useAudioControls } from "src/player-context/AudioContext";
import { SongDTO } from "src/types/types";
import { TextUtils } from "src/utils/FormatText";


interface Props {
    song: SongDTO;
    playSelected: (id: number) => void;
    isActive?: boolean;
    isPlaying?: boolean;
    artist?: boolean;
    album?: boolean;
    year?: boolean;
}


export default function SongCard({ song, playSelected, isActive, isPlaying, artist, album, year }: Props) {
    useEffect(() => { console.log(`%cRendering Song Card`, 'background: #1a1a1a; color: #b437ff;') })

    const audioControls = useAudioControls();

    const playSong = (e: React.MouseEvent) => {
        e.preventDefault();
        playSelected(song.songId)
    }

    const play = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isActive)
            audioControls.play();
    }

    const pause = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isActive)
            audioControls.pause();
    }

    return (
        <div
            title={song.songTitle}
            className={`
            ${isActive ? "bg-white/25 rounded-md" : ""}
            w-full h-full mx-auto flex flex-col gap-2 justify-center items-center p-2.5
            relative 
            after:absolute after:top-0 after:left-0 after:z-0 after:w-full after:h-full
            after:scale-80 hover:after:scale-100 after:transition-transform after:ease-out after:duration-300
            hover:after:bg-white/10
            after:rounded-lg
            group
        `}>
            <div
                className="
                    album-cover
                    relative z-1
                    overflow-hidden
                    rounded-md
                    before:absolute before:top-0 before:left-0 before:z-0
                    before:w-full before:h-full
                    before:bg-linear-to-t xs:before:bg-none
                    group-hover:before:bg-linear-to-t
                    before:from-[rgba(0,0,0,0.75)] before:from-25% 
                "
            >
                <img src={`${BASE_URL}/${song.cover?.x256}`} alt="" className="w-full h-auto select-none" />
                <div className={`
                    ${isActive ? "translate-y-0" : "translate-y-0 xs:translate-y-[150%]"}
                    absolute bottom-3 right-3
                    group-hover:translate-y-0
                    transition-transform duration-200 ease-in-out
                    `}>
                    {
                        !isActive ?
                            <button title="Play" onClick={playSong} className="relative w-[48px] h-[48px] flex justify-center items-center rounded-full bg-white/10 backdrop-blur-xs cursor-pointer group/pause shadow-md shadow-black/15">
                                <div className="absolute top-0 left-0 w-full h-full group-hover/pause:bg-white/25 rounded-full scale-[0.85] group-hover/pause:scale-[1] transition-all duration-150 ease-out z-0"></div>
                                <i className="relative z-1">
                                    <PlayIcon className="w-[24px] h-[24px] fill-white stroke-0"></PlayIcon>
                                </i>
                            </button>
                            : isPlaying ?
                                <button title="Pause" onClick={pause} className="relative w-[48px] h-[48px] flex justify-center items-center rounded-full bg-white/10 backdrop-blur-xs cursor-pointer group/pause">
                                    <div className="absolute top-0 left-0 w-full h-full group-hover/pause:bg-white/25 rounded-full scale-[0.85] group-hover/pause:scale-[1] transition-all duration-150 ease-out z-0"></div>
                                    <i className="relative z-1">
                                        <PauseIcon className="w-[24px] h-[24px] fill-white stroke-0"></PauseIcon>
                                    </i>
                                </button>
                                :
                                <button title="Play" onClick={play} className="relative w-[48px] h-[48px] flex justify-center items-center rounded-full bg-white/10 backdrop-blur-xs cursor-pointer group/pause">
                                    <div className="absolute top-0 left-0 w-full h-full group-hover/pause:bg-white/25 rounded-full scale-[0.85] group-hover/pause:scale-[1] transition-all duration-150 ease-out z-0"></div>
                                    <i className="relative z-1">
                                        <PlayIcon className="w-[24px] h-[24px] fill-white stroke-0"></PlayIcon>
                                    </i>
                                </button>
                    }
                </div>
            </div>
            <div className="album-info w-full h-auto flex justify-between flex-col gap-1 relative z-1 grow">
                <span
                    className="select-none w-full text-[16px] font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                    {song.songTitle}
                </span>
                {
                    artist &&
                    <Link
                        title={song.artistName}
                        to="/artists/$artistId/$artistName" params={{ artistId: song.artistId, artistName: TextUtils.toKebabCase(song.artistName) }}
                        className="w-full text-sm font-medium decoration-2 hover:underline cursor-pointer overflow-hidden whitespace-nowrap text-ellipsis">
                        {song.artistName}
                    </Link>
                }
                {
                    album &&
                    <Link
                        title={song.albumName}
                        to="/albums/$albumId/$albumName" params={{ albumId: song.albumId, albumName: TextUtils.toKebabCase(song.albumName) }}
                        className="w-full text-sm font-medium decoration-2 hover:underline overflow-hidden whitespace-nowrap text-ellipsis">
                        {song.albumName}
                    </Link>
                }
                {
                    year &&
                    <span className="text-sm font-medium">
                        {song.releaseYear}
                    </span>
                }
            </div>
        </div>
    )

}

export const SongCardMemo = memo(SongCard, (prev: Props, next: Props) => {
    return prev.isActive === next.isActive && prev.isPlaying === next.isPlaying;
});

export function SongCardSkeleton() {
    return (
        <div className="card-skeleton animate-pulse">
            <div className="card-cover relative block mb-3 group">
                <div className=" w-max-[256px] aspect-square bg-neutral-900 rounded-md flex justify-end items-end p-2">
                    <div className="play  bg-neutral-800 w-10 h-10 rounded-full"></div>
                </div>
            </div>
            <div className="card-info font-semibold mt-3 overflow-hidden whitespace-nowrap text-ellipsis">
                <div className="w-full p-2 bg-neutral-900 rounded-md mb-3"></div>
                <div className="w-[75%] p-2 bg-neutral-900 rounded-md"></div>
            </div>
        </div>
    )
}


export function SongSkeletonLoader(props: { items: number }) {
    return (
        <>
            {
                Array(props.items).fill(0).map(i => <SongCardSkeleton></SongCardSkeleton>)
            }
        </>
    )
}