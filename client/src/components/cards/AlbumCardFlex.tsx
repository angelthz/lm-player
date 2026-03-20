import { Link } from "@tanstack/react-router";
import { memo, useEffect } from "react";
import { AlbumDTO } from "src/types/types";
import { PauseIcon, PlayIcon } from "lucide-react";
import { logger } from "src/utils/Logger";
import { useAudioControls } from "src/player-context/AudioContext";
import { TextUtils } from "src/utils/FormatText";
import { BASE_URL } from "src/env/HostURL";

interface AlbumCardProps {
    album: AlbumDTO;
    activeHandler: (id: number) => void;
    artist?: boolean;
    year?: boolean;
    isActive?: boolean;
    isPlaying?: boolean;
}

function AlbumCardFlex({ album, activeHandler, artist = true, year = false, isActive, isPlaying }: AlbumCardProps) {
    useEffect(() => { logger.log(`%c-> Rendering AlbumCardFlex: ${album.albumId}`, 'background: #1a1a1a; color: #b437ff; font-weight:700;') })


    const audioActions = useAudioControls();

    const playAlbum = (e: React.MouseEvent) => {
        e.preventDefault();
        activeHandler(album.albumId)
    }

    const play = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isActive)
            audioActions.play();
    }

    const pause = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isActive)
            audioActions.pause();
    }
    return (
        <div className={`
            ${isActive ? "bg-white/25 rounded-md" : ""}
            w-full h-full mx-auto flex flex-col gap-1 justify-center items-center p-2.5
            relative 
            after:absolute after:top-0 after:left-0 after:z-0 after:w-full after:h-full
            after:scale-80 hover:after:scale-100 after:transition-transform after:ease-out after:duration-300
            hover:after:bg-white/10
            after:rounded-md
            group
        `}>
            <Link

                to="/albums/$albumId/$albumName" params={{ albumId: album.albumId, albumName: TextUtils.toKebabCase(album.albumName) }}
                className="
                    album-cover
                    relative z-1
                    cursor-pointer
                    overflow-hidden
                    rounded-md
                    before:absolute before:top-0 before:left-0 before:z-0
                    before:w-full before:h-full
                    before:bg-linear-to-t xs:before:bg-none
                    group-hover:before:bg-linear-to-t
                    before:from-[rgba(0,0,0,0.75)] before:from-25% 
                "

            >
                <img src={`${BASE_URL}/${album.cover?.x256}`} alt="" className="w-full h-auto" />
                <div className={`
                    ${isActive ? "translate-y-0" : "translate-y-0 xs:translate-y-[150%]"}
                    absolute bottom-3 right-3
                    group-hover:translate-y-0
                    transition-transform duration-200 ease-in-out
                    
                    `}>

                    {
                        !isActive ?
                            <button title="Play" onClick={playAlbum} className="relative w-[48px] h-[48px] flex justify-center items-center rounded-full bg-white/10 backdrop-blur-xs cursor-pointer group/pause shadow-md shadow-black/15">
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
            </Link>
            <div className="album-info w-full h-auto flex items-start flex-col gap-0.5 relative z-1">
                <Link
                    to="/albums/$albumId/$albumName" params={{ albumId: album.albumId, albumName: TextUtils.toKebabCase(album.albumName) }}
                    title={album.albumName}
                    className="w-full text-md font-medium decoration-2 hover:underline overflow-hidden whitespace-nowrap text-ellipsis">
                    {album.albumName}
                </Link>
                {/* <Link

                    to="/albums/$albumId/$albumName" params={{ albumId: album.albumId, albumName: TextFormmater.toKebabCase(album.albumName) }}
                    className="w-full text-md font-medium decoration-2 hover:underline overflow-hidden whitespace-nowrap text-ellipsis">
                    {album.albumName}
                </Link> */}
                {
                    artist &&
                    <Link
                        title={album.artistName}
                        to="/artists/$artistId/$artistName" params={{ artistId: album.artistId, artistName: TextUtils.toKebabCase(album.artistName) }}
                        className="text-[15px] font-medium decoration-2 hover:underline cursor-pointer">
                        {album.artistName}
                    </Link>
                }
                {
                    year &&
                    <span className="text-sm font-semibold">
                        {album.releaseYear}
                    </span>
                }
            </div>
        </div>
    )
}


const AlbumCardFlexMemo = memo(AlbumCardFlex, (prev: AlbumCardProps, next: AlbumCardProps) => {
    return prev.isActive === next.isActive && prev.isPlaying === next.isPlaying;
});


export { AlbumCardFlex, AlbumCardFlexMemo };