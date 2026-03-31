import { Link } from "@tanstack/react-router";
import { LucideProps, Pause, PauseIcon, Play, PlayIcon } from "lucide-react";
import React, { memo, useEffect } from "react";
import { BASE_URL } from "src/env/HostURL";
import { useAudioControls } from "src/player-context/AudioContext";
import { ArtistDTO } from "src/types/types";
import { TextUtils } from "src/utils/FormatText";

interface ArtistCardProps {
    artist: ArtistDTO;
    updateCurrentArtist: (id: number) => void;
    isCurrent?: boolean;
    isPlaying?: boolean;
    idx?: number;
}

interface ButtonProps {
    clickHandler: (e: React.MouseEvent) => void;
    Icon: React.FC<LucideProps>;
    isActive?: boolean;
    title?: string;
}
function Button({ clickHandler, Icon, isActive, title }: ButtonProps) {
    return (
        <button
            title={title}
            onClick={clickHandler}
            className={`
                ${isActive ? "bg-white/25" : ""}
                w-12 h-12 rounded-full flex justify-center items-center cursor-pointer relative 
                 bg-white/15
                after:absolute after:top-0 after:left-0 after:z-0 after:w-full after:h-full
                after:scale-80 after:rounded-full
                 hover:after:bg-white/25 hover:after:scale-100 
                hover:after:transition-all hover:after:duration-300
            `}>
            <div className="">
                <Icon className="fill-white stroke-0 w-[22px] h-[22px]" />
            </div>
        </button>
    )
}

function ArtistCardFlex({ artist, updateCurrentArtist, isCurrent, isPlaying, idx }: ArtistCardProps) {
    useEffect(() => { console.log(`%cRendering Artist CardFlex: ${idx}`, 'background: #1a1a1a; color: #b437ff;') });
    const audioControls = useAudioControls();

    const playArtist = (e: React.MouseEvent) => {
        e.preventDefault();
        updateCurrentArtist(artist.artistId)
    }

    const play = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isCurrent)
            audioControls.play();
    }

    const pause = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isCurrent)
            audioControls.pause();
    }

    // card-container relative w-full h-[250px] p-3 rounded-lg
    return (
        <div className={`
            ${isCurrent ? "bg-white/25" : ""}
            card-container relative w-full h-full p-3 rounded-lg
            after:absolute after:top-0 after:left-0 after:z-0 after:w-full after:h-full
            after:scale-80 hover:after:scale-100 after:transition-transform after:ease-out after:duration-300
            hover:after:bg-white/15
            after:rounded-lg group 
        `}
        >
            <Link
                to="/artists/$artistId/$artistName" params={{ artistId: artist.artistId, artistName: TextUtils.toKebabCase(artist.artistName) }}
                className="card-content w-full h-full relative z-1  block"
                title={artist.artistName}
            >
                <div className="card-cover
                rounded-md
                w-full h-full overflow-hidden 
                flex justify-center items-center 
                before:absolute before:top-0 before:left-0 before:z-0
                before:w-full before:h-full
                before:rounded-md
                before:bg-linear-to-t 
                before:from-[rgba(0,0,0,0.8)] 
                before:from-28% ">
                    <img
                        className="w-full h-full group-hover:w-[110%] group-hover:h-[110%] object-cover transition-all duration-350"
                        src={`${BASE_URL}/${artist.photo.x512}`}
                        alt=""

                    />
                </div>
                <div className="card-info 
                    w-full h-full
                    shadow-md shadow-black/30
                    absolute top-0 left-0 flex items-end p-2 rounded-md overflow-hidden">
                    <div className="w-full h-auto flex items-end ">
                        <div className="w-[calc(100%-48px)] h-auto  ">
                            <div className="text-[0.75rem] font-medium flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out">
                                <span className="">Albums: {artist.albumsCount}</span>
                                <span className="">Songs: {artist.songsCount}</span>
                            </div>
                            <span

                                className="text-md font-semibold decoration-2 hover:underline cursor-pointer text-shadow-lg text-shadow-black/30">

                                {artist.artistName}

                            </span>

                        </div>
                        <div className={`
                            ${isCurrent ? "translate-x-0" : "translate-x-[150%]"}
                            grow h-full  group-hover:translate-x-0 transition-transform ease-in-out duration-300    
                        `}>
                            {
                                !isCurrent ?
                                    <Button clickHandler={playArtist} Icon={PlayIcon} title="Play"></Button>
                                    : isPlaying ?
                                        <Button clickHandler={pause} Icon={PauseIcon} isActive={true} title="Pause"></Button>
                                        :
                                        <Button clickHandler={play} Icon={PlayIcon} isActive={true} title="Play"></Button>
                            }
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )


}

const ArtistCardFlexMemo = memo(ArtistCardFlex, (prev: ArtistCardProps, next: ArtistCardProps) => {
    return prev.isCurrent === next.isCurrent && prev.isPlaying === next.isPlaying
});


export { ArtistCardFlex, ArtistCardFlexMemo };