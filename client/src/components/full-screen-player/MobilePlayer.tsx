import { XIcon } from "lucide-react";
import { useFullscreenPlayerActions, useFullscreenPlayerState } from "src/context/FullscrenPlayerVisibility";
import { BASE_URL } from "src/env/HostURL";
import { usePlaylistCurrent } from "src/player-context/PlaylistContext";
import { TimeUtils } from "src/utils/TimeUtils";
import { PlayerPlayButtons } from "../player/PlayerButtons";
import { useAudioProgress } from "src/player-context/AudioContext";



export default function MobileFullPlayer() {
    const { song: currentSong, pos, of } = usePlaylistCurrent();
    const fullscrenPlayerState = useFullscreenPlayerState();
    const fullscreenPlayerActions = useFullscreenPlayerActions();
    return (
        <>
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

                
            "
                style={{
                    backgroundImage: `url(${BASE_URL}/${currentSong?.cover?.x1200})`,
                    backgroundPosition: "50%",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundAttachment: "fixed",

                }}></div>

            <div className="relative z-1 w-full h-dvh md:h-[calc(100vh-88px)]  px-6">
                <div className="w-full h-full flex flex-col justify-evenly">
                    <div className="w-full h-[48px] flex justify-end ">
                        <button onClick={fullscreenPlayerActions.updateVisibility} className="w-[48px] h-[48px] flex justify-center items-center group cursor-pointer">
                            <i>
                                <XIcon className="stroke-white group-hover:stroke-white/50 transtion-all ease-out duration-200"></XIcon>
                            </i>
                        </button>
                    </div>
                    <div id="album-cover" className=" w-full h-auto flex flex-col justify-center items-center">
                        <div>
                            <img className="max-w-[320px] h-auto rounded-md shadow-xl shadow-black" src={`${BASE_URL}/${currentSong?.cover?.x512}`} alt="" />
                        </div>
                    </div>
                    <div id="track-info" className="flex items-center my-4">
                        {/* <div className="text-xs font-semibold"><span>{musicPlayerHook.playerCursor.idx + 1}/{musicPlayerHook.playerCursor.queue.length}</span></div> */}
                        <div className="grow">
                            <div className="font-anton text-2xl leading-8"><span>{currentSong?.songTitle}</span></div>
                            <div className="text-sm font-semibold"><span>{currentSong?.albumName}</span></div>
                            <div className="font-semibold text-xs"><span>{currentSong?.artistName}</span></div>
                        </div>
                        <div id="right" className="w-[64px] h-auto">
                            <button className="w-[64px] h-[64px] flex justify-center items-center group cursor-pointer">
                                <i className="">
                                    <svg className="w-[26px] h-[26px] stroke-2 hover:fill-white transition-all ease-out duration-200" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" /></svg>
                                </i>
                            </button>
                        </div>
                    </div>
                    <div id="song-counter" className="text-md font-semibold flex justify-center">
                        <span className="">{pos + 1}/{of}</span>
                    </div>
                    <ProgressBar></ProgressBar>
                    <div id="controls" className="flex justify-center gap-4">
                        <div id="mid-controls" className="w-full">
                            <PlayerPlayButtons></PlayerPlayButtons>
                        </div>
                    </div>
                    <div id="bottom-controls" className=" w-full flex justify-between items-center">
                        <div id="lyrics">
                            <button className="w-[64px] h-[64px]  flex justify-center items-center group cursor-pointer">
                                <i className="hover:opacity-50 transition-opacity ease-out duration-200">
                                    <svg className="w-[26px] h-[26px] stroke-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="m11 7.601-5.994 8.19a1 1 0 0 0 .1 1.298l.817.818a1 1 0 0 0 1.314.087L15.09 12" /><path d="M16.5 21.174C15.5 20.5 14.372 20 13 20c-2.058 0-3.928 2.356-6 2-2.072-.356-2.775-3.369-1.5-4.5" /><circle cx="16" cy="7" r="5" /></svg>
                                </i>
                            </button>
                        </div>
                        <div id="queue" >
                            <button className="w-[64px] h-[64px]  flex justify-center items-center group cursor-pointer">
                                <i className="hover:opacity-50 transition-opacity ease-out duration-200">
                                    <svg className="w-[26px] h-[26px] stroke-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M21 3a1 1 0 0 1 0 2h-3v12a4 4 0 1 1 -2.001 -3.465l.001 -9.535a1 1 0 0 1 1 -1z" /><path d="M14 5a1 1 0 0 1 -1 1h-10a1 1 0 1 1 0 -2h10a1 1 0 0 1 1 1" /><path d="M14 9a1 1 0 0 1 -1 1h-10a1 1 0 1 1 0 -2h10a1 1 0 0 1 1 1" /><path d="M10 13a1 1 0 0 1 -1 1h-6a1 1 0 0 1 0 -2h6a1 1 0 0 1 1 1" /></svg>
                                </i>
                            </button>
                        </div>
                    </div>
                    {/* <div id="songs-queue" className={`
                        ${queueVisibility ? "translate-x-0" : "translate-x-full"}
                        bg-black/75 backdrop-blur-[80px] fixed  top-0 right-0 w-full md:w-[25%] h-full px-6 
                        transition-transform ease-in-out duration-200
                    `}>

                        <div className="w-full h-[10%] flex justify-between items-center pl-4">
                            <div>
                                <span className="text-2xl font-semibold font-oswald">Queue</span>
                            </div>
                            <div className="">
                                <button onClick={queueVisibilityHandler} className="w-[64px] h-[64px]  flex justify-center items-center group cursor-pointer">
                                    <i className="hover:opacity-50 transition-opacity ease-out duration-200">
                                        <XIcon className="w-[26px] h-[26px] stroke-2"> </XIcon>
                                    </i>
                                </button>
                            </div>
                        </div>
                        <div className="w-full h-[90%] overflow-y-scroll">
                            <QueuePlayList songs={player.cursor.queue}></QueuePlayList>
                        </div>
                    </div> */}
                </div>
            </div>
        </>
    )
}


function ProgressBar() {

    const { duration, currentTime, progressHandler } = useAudioProgress();
    return (
        <div id="progress" className="w-full relative">
            <div className="absolute left-0 bottom-0 text-sm font-semibold">
                <span>{TimeUtils.toShortTMS(currentTime)}</span>
            </div>

            <input
                className="block w-[90%] mx-auto my-8"
                type="range"
                step="any"
                min={0}
                max={duration}
                value={currentTime}
                onChange={progressHandler}
            >
            </input>
            <div className="absolute right-0 bottom-0 text-sm font-semibold">
                <span>{TimeUtils.toShortTMS(duration)}</span>
            </div>
        </div>
    )
}