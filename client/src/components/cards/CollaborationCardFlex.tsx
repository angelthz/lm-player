import { Link } from "@tanstack/react-router";
import { DiscAlbumIcon, PauseIcon, PlayIcon, UserIcon, UserPenIcon, UserRoundIcon, UserRoundPenIcon } from "lucide-react";
import { memo, useEffect } from "react";
import { BASE_URL } from "src/env/HostURL";
import { useAudioContext } from "src/player-context/AudioContext";
import { AlbumCollaborationDTO } from "src/types/types";
import { TextUtils } from "src/utils/FormatText";


interface Props {
    album: AlbumCollaborationDTO;
    artistName: string;
    artistId: number;
    activeHandler: (id: number) => void;
    isActive?: boolean;
    isPlaying?: boolean;
    year?: boolean;
    artist?: boolean;
}

export default function CollaborationCardFlex({ album, artistName, artistId, activeHandler, isActive, isPlaying, year, artist }: Props) {
    useEffect(() => { console.log(`%cRendering Collaboration Card: ${album.albumId}`, 'background: #1a1a1a; color: #b437ff;') })

    const audio = useAudioContext();

    const playAlbum = (e: React.MouseEvent) => {
        e.preventDefault();
        activeHandler(album.albumId)
    }

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
    return (
        <div className={`
            ${isActive && isPlaying ? "bg-white/25 rounded-md" : ""}
            w-full h-full mx-auto flex flex-col gap-1 justify-between items-center p-2.5
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
                    group-hover:before:bg-linear-to-t before:from-[rgba(0,0,0,0.65)] before:from-25% before:to-[rgba(3,3,3,0)] before:to-90% 
                    group-hover:before:transition-all group-hover:before:duration-200
                "
            >
                <img src={`${BASE_URL}/${album.cover?.x256}`} alt="" className="w-full h-auto" />
                <div className={`
                    ${isActive ? "translate-y-0" : "translate-y-[150%] "}
                    absolute bottom-3 right-3
                    group-hover:translate-y-0
                    transition-transform duration-200 ease-in-out
                    
                    `}>

                    {
                        !isActive ?
                            <button onClick={playAlbum} className="relative w-[48px] h-[48px] flex justify-center items-center rounded-full bg-white/10 backdrop-blur-xs cursor-pointer group/pause shadow-md shadow-black/15">
                                <div className="absolute top-0 left-0 w-full h-full group-hover/pause:bg-white/25 rounded-full scale-[0.85] group-hover/pause:scale-[1] transition-all duration-150 ease-out z-0"></div>
                                <i className="relative z-1">
                                    <PlayIcon className="w-[24px] h-[24px] fill-white stroke-0"></PlayIcon>
                                </i>
                            </button>
                            : isPlaying ?
                                <button onClick={pause} className="relative w-[48px] h-[48px] flex justify-center items-center rounded-full bg-white/10 backdrop-blur-xs cursor-pointer group/pause">
                                    <div className="absolute top-0 left-0 w-full h-full group-hover/pause:bg-white/25 rounded-full scale-[0.85] group-hover/pause:scale-[1] transition-all duration-150 ease-out z-0"></div>
                                    <i className="relative z-1">
                                        <PauseIcon className="w-[24px] h-[24px] fill-white stroke-0"></PauseIcon>
                                    </i>
                                </button>
                                :
                                <button onClick={play} className="relative w-[48px] h-[48px] flex justify-center items-center rounded-full bg-white/10 backdrop-blur-xs cursor-pointer group/pause">
                                    <div className="absolute top-0 left-0 w-full h-full group-hover/pause:bg-white/25 rounded-full scale-[0.85] group-hover/pause:scale-[1] transition-all duration-150 ease-out z-0"></div>
                                    <i className="relative z-1">
                                        <PlayIcon className="w-[24px] h-[24px] fill-white stroke-0"></PlayIcon>
                                    </i>
                                </button>
                    }
                </div>
            </Link>
            <div className="album-info w-full h-auto flex items-start flex-col gap-0.5 relative z-1 grow">
                <Link
                    title={`${album.albumName}`}
                    to="/albums/$albumId/$albumName" params={{ albumId: album.albumId, albumName: TextUtils.toKebabCase(album.albumName) }}
                    className="flex justify-start items-center gap-1 w-full text-md font-medium decoration-2 hover:underline ">
                    <i><DiscAlbumIcon className="w-[15px] h-[15px] stroke-3" /></i><span className="w-full overflow-hidden whitespace-nowrap text-ellipsis">{album.albumName}</span>
                </Link>
                <Link
                    to="/artists/$artistId/$artistName" params={{ artistId: album.mainArtist.id, artistName: TextUtils.toKebabCase(album.mainArtist.name) }}
                    className="flex justify-start items-center gap-1  text-[15px] font-medium decoration-2 hover:underline cursor-pointer">
                    <i><UserPenIcon className="w-[15px] h-[15px] stroke-3" /></i><span>{album.mainArtist.name}</span>
                </Link>
                {
                    year &&
                    <span className="text-sm font-semibold">
                        {album.releaseYear}
                    </span>
                }
                <hr className="w-full h-[1px] text-white/15 my-1" />
                {/* <span>&</span> */}

                {
                    album.collaborators.map(collab =>
                        <Link
                            to="/albums/$albumId/$albumName" params={{ albumId: album.albumId, albumName: TextUtils.toKebabCase(album.albumName) }}
                            title={album.albumName}
                            className="w-full text-md font-medium decoration-2 hover:underline overflow-hidden whitespace-nowrap text-ellipsis">
                            {collab.name}
                        </Link>
                    )}


            </div>
        </div>
    )
}


export const CollaborationCardFlexMemo = memo(CollaborationCardFlex, (prev: Props, next: Props) => {
    return prev.isActive === next.isActive && prev.isPlaying === next.isPlaying;
})