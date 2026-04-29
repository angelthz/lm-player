import { ChevronDownIcon, DiscAlbum, HeartIcon, ListMusicIcon, Mic2Icon, Music4Icon, UserCircleIcon } from "lucide-react";
import { memo, useEffect } from "react";
import { useFullscreenPlayerActions } from "src/context/FullscrenPlayerVisibility";

import { BASE_URL } from "src/env/HostURL";
import { usePlaylistCurrent } from "src/player-context/PlaylistContext";
import { PlayerProgressBar, PlayerSkipNextButton, PlayerSkipPrevButton, PlayerTogglePlayButton } from "../player/PlayerButtons";


function BackgroundCover({ src }: { src?: string }) {
    return (
        <div id="background-cover" className="
                w-full h-full absolute bottom-0 left-0 z-0
                blur-[80px]
                 after:bg-[rgba(3,3,3,0.10)]
                
                before:absolute before:top-0 before:left-0
                before:w-full before:h-full
                before:bg-[rgba(3,3,3,0.25)]
                before:bg-linear-to-t before:from-[rgba(3,3,3,0.75)] before:from-20%   before:to-[rgba(3,3,3,0.25)]
                
                after:absolute
                after:top-0 after:left-0 
                after:w-full after:h-full
                after:bg-linear-to-t after:from-[rgba(3,3,3,1)] 
                transition-[background] duration-300 ease-out
            "
            style={{
                backgroundImage: `url(${BASE_URL}/${src})`,
                backgroundPosition: "50%",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundAttachment: "fixed",

            }}></div>
    )
}

const BackgroundCoverMemo = memo(BackgroundCover);

export function DesktopPlayer() {
    useEffect(() => { console.log(`%c-> Rendering FullPlayer`, 'background: #1a1a1a; color: #219ebc;') })

    const current = usePlaylistCurrent();
    const fullscreenPlayerActions = useFullscreenPlayerActions();


    return (
        <>
            <div id="player-minimize-btn" className="absolute top-0 right-4 z-10 w-[48px] h-[48px] flex justify-center items-center">
                <button onClick={fullscreenPlayerActions.updateVisibility} className="disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex justify-center items-center aspect-square hover:opacity-75 transition-colors ease-out duration-300" data-tooltip="Player Mode" >
                    <i>
                        <ChevronDownIcon className={`${false ? "rotate-180" : "rotate-0"} stroke-3 stroke-white`} width={20} />
                    </i>
                </button>
            </div>
            <BackgroundCoverMemo src={current.song?.cover?.x1200}></BackgroundCoverMemo>

            <div id="player" className="w-full h-full grow relative flex flex-col justify-between items-center">

                <div id="player-top" className="w-full h-[calc(100%-90px)] flex justify-center items-center">
                    <div id="song-info-container" className="w-[50%] h-full flex flex-col justify-evenly items-center">
                        <div id="cover-container" className="relative z-1 w-fit h-full flex flex-col justify-evenly items-center">
                            <div id="album-cover" className=" w-full h-auto">
                                <img className="block mx-auto max-w-[450px]  h-auto rounded-md shadow-xl shadow-black" src={`${BASE_URL}/${current.song?.cover?.x512}`} alt="" />
                            </div>
                            <div id="track-info" className="w-full mx-auto my-4 flex flex-col gap-2 text-center">
                                <div id="song-counter" className="text-sm font-semibold flex justify-between items-center ">
                                    <span>{current.pos + 1} / {current.of}</span> <button className="group cursor-pointer"><i><HeartIcon className="w-[20px] h-[20px] stroke-[2.5] fill-transparent group-hover:fill-white transition-colors duration-200 ease-linear" /></i></button>
                                </div>
                                <div className="font-anton text-2xl leading-8 flex justify-start items-center gap-2"><Music4Icon className="inline w-[18px] h-[18px] stroke-[2.25]" /> <span>{current.song?.songTitle}</span></div>
                                <div className="font-semibold text-xl flex justify-start items-center gap-2">
                                    <UserCircleIcon className="inline w-[18px] h-[18px] stroke-[2.25]" />
                                    <span>{current.song?.artistName}</span>
                                </div>
                                <div className="text-lg font-semibold flex justify-start items-center gap-2"><DiscAlbum className="inline w-[18px] h-[18px] stroke-[2.25]" /> <span>{current.song?.albumName}</span></div>
                            </div>
                        </div>
                    </div>
                    <div id="playlist-container" className="w-[50%] h-full border hidden">

                    </div>
                </div>
                <div className="player-center w-full h-auto">
                    <div className="max-w-[40%] mx-auto flex justify-between">
                        <button><i><Mic2Icon /></i></button>
                        <button><i><ListMusicIcon /></i></button>
                    </div>
                </div>
                <div id="player-bottom" className="w-full h-[90px] relative flex flex-col gap-4 items-center">
                    <div className="w-[90%] md:w-[50%] h-auto mx-auto flex gap-6 justify-center items-center ">
                        <PlayerSkipPrevButton></PlayerSkipPrevButton>
                        <PlayerTogglePlayButton></PlayerTogglePlayButton>
                        <PlayerSkipNextButton></PlayerSkipNextButton>
                    </div>
                    <div className="w-[90%] md:w-[50%] h-auto ">
                        <PlayerProgressBar></PlayerProgressBar>
                    </div>
                </div>

            </div>
        </>

    )
}


