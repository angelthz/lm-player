import { Link } from "@tanstack/react-router";
import { ChevronUpIcon, Disc2Icon, HomeIcon, MenuIcon, PauseIcon, PlayIcon, SearchIcon, SkipForwardIcon, UserCircle2, UserCircle2Icon, UserSquare2Icon, XIcon } from "lucide-react";
import { useState } from "react";

import { useFullscreenPlayerActions, useFullscreenPlayerState } from "src/context/FullscrenPlayerVisibility";
import { BASE_URL } from "src/env/HostURL";
import { useAudioProgress } from "src/player-context/AudioContext";
import { usePlaylistCurrent } from "src/player-context/PlaylistContext";
import { PlayerSkipNextButton, PlayerTogglePlayButton } from "../player/PlayerButtons";
import MobileNavMenu from "./MobileNavMenu";




function BottomProgressBar() {
    const { duration, currentTime, progressHandler } = useAudioProgress();
    return (
        <div className="w-[95%] h-auto mx-auto">
            <input
                className="inline-block w-full h-auto"
                type="range"
                step="any"
                min={0}
                max={duration}
                value={currentTime}
                onChange={progressHandler}
            />
        </div>
    )
}

function MobilePlayerBar() {
    const { song: currentSong } = usePlaylistCurrent();
    const fullscreenPlayerActions = useFullscreenPlayerActions();

    return (
        <div id="bottom-bar-container" className={`${currentSong ? "h-[94px]" : "h-0"}  w-full flex flex-col justify-between overflow-hidden transition-[height] duration-200 ease-out `}>
            <div id="bottom-bar-song-info" className={`${!currentSong && "hidden"} w-[98%] grow px-2 flex`}>
                <div className='w-[70%] h-full'>
                    <button onClick={fullscreenPlayerActions.updateVisibility} className=" w-full h-full flex justify-start items-center gap-4 ">
                        <div className="shrink-0 ">
                            <img src={`${BASE_URL}/${currentSong?.cover?.x64}`} alt="" className='rounded-full w-[54px] h-[54px] inset-shadow-lg shadow-black' />
                        </div>
                        <div className="text-left  font-semibold grow h-auto ">
                            <div className="mb-0.5"><span className="text-md">{currentSong?.artistName}</span></div>
                            <div className="w-full text-sm">
                                <span className="overflow-hidden whitespace-break-spaces text-ellipsis">{currentSong?.songTitle}</span>
                            </div>
                        </div>
                    </button>
                </div>

                <div id="bottom-bar-player-controls" className='grow h-full flex justify-evenly items-center'>
                    <PlayerTogglePlayButton></PlayerTogglePlayButton>
                    <PlayerSkipNextButton></PlayerSkipNextButton>
                </div>
            </div>

            <div className={`${!currentSong && "hidden"} w-full h-auto`}>
                <BottomProgressBar></BottomProgressBar>
            </div>
        </div>
    )
}


export default function MobileBottomBar() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuHandler = () => setIsMenuOpen(prev => !prev);
    const fullscrenPlayerState = useFullscreenPlayerState();

    return (
        <>
            <MobileNavMenu isOpened={isMenuOpen} menuHandler={menuHandler}></MobileNavMenu>

            <div id="mobile-bottom-bar" className={`${false ? "translate-y-full" : "translate-y-0"} px-2 w-full min-h-[60px] fixed bottom-0 left-0 z-10 bg-[#030303]/90 backdrop-blur-2xl  border border-white/10 transition-transform ease-out duration-200`}>

                {!fullscrenPlayerState.isVisible &&
                    <MobilePlayerBar ></MobilePlayerBar>}

                <div className={`w-full h-[60px] px-4`}>
                    <nav className="w-full h-full">
                        <ul className="w-full h-full flex justify-between items-center">
                            <li className="w-[48px] h-[48px] ">
                                <Link to="/" className='w-full h-full cursor-pointer group relative'>
                                    <i className='w-full h-full flex justify-center items-center'>
                                        <HomeIcon className='w-[20px] aspect-square stroke-[2.5]'></HomeIcon>
                                    </i>
                                    <div className="rounded-2xl absolute top-0 left-0 z-0 w-full h-full scale-[0.85] group-hover:bg-white/25 group-hover:scale-[1] transition-all ease-out duration-200"></div>
                                </Link>
                            </li>
                            <li className="w-[48px] h-[48px] ">
                                <Link to="/albums" className='w-full h-full cursor-pointer group relative'>
                                    <i className='w-full h-full flex justify-center items-center'>
                                        <Disc2Icon className='w-[20px] aspect-square stroke-[2.5]'></Disc2Icon>
                                    </i>
                                    <div className="rounded-2xl absolute top-0 left-0 z-0 w-full h-full scale-[0.85] group-hover:bg-white/25 group-hover:scale-[1] transition-all ease-out duration-200"></div>
                                </Link>
                            </li>
                            <li className="w-[48px] h-[48px] ">
                                <Link to="/artists" className='w-full h-full cursor-pointer group relative'>
                                    <i className='w-full h-full flex justify-center items-center'>
                                        <UserCircle2 className='w-[20px] aspect-square stroke-[2.5]'></UserCircle2>
                                    </i>
                                    <div className="rounded-2xl absolute top-0 left-0 z-0 w-full h-full scale-[0.85] group-hover:bg-white/25 group-hover:scale-[1] transition-all ease-out duration-200"></div>
                                </Link>
                            </li>
                            <li className="w-[48px] h-[48px] ">
                                <Link to="/artists" className='w-full h-full cursor-pointer group relative'>
                                    <i className='w-full h-full flex justify-center items-center'>
                                        <SearchIcon className='w-[20px] aspect-square stroke-[2.5]'></SearchIcon>
                                    </i>
                                    <div className="rounded-2xl absolute top-0 left-0 z-0 w-full h-full scale-[0.85] group-hover:bg-white/25 group-hover:scale-[1] transition-all ease-out duration-200"></div>
                                </Link>
                            </li>
                            <li className="w-[48px] h-[48px] ">
                                <button onClick={menuHandler} className='w-full h-full cursor-pointer group relative'>
                                    <i className='w-full h-full flex justify-center items-center'>
                                        {!isMenuOpen ?
                                            <MenuIcon className='w-[20px] stroke-[2.5] aspect-square'></MenuIcon> :
                                            <XIcon className='w-[20px] stroke-[2.5] aspect-square'></XIcon>
                                        }
                                    </i>
                                    <div className="rounded-2xl absolute top-0 left-0 z-0 w-full h-full scale-[0.85] group-hover:bg-white/25 group-hover:scale-[1] transition-all ease-out duration-200"></div>
                                </button>
                            </li>
                        </ul>
                    </nav>

                </div>
            </div>
        </>
    )

}