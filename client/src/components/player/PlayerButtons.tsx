import { PauseIcon, PlayIcon, Volume2Icon, VolumeOffIcon } from "lucide-react";
import { useAudioControls, useAudioProgress, useAudioState, useAudioVolume } from "src/player-context/AudioContext";
import { usePlaylistControls, usePlaylistCursor, usePlaylistPlayMode } from "src/player-context/PlaylistContext";
import { TimeUtils } from "src/utils/TimeUtils";



function PlayerRepeatButton() {
    const { repeatMode } = usePlaylistPlayMode();
    const playlistControls = usePlaylistControls();

    return (
        <div>
            <button onClick={playlistControls.toggleRepeat} id="" className="w-[32px] h-[32px] flex justify-center items-center group cursor-pointer" data-tooltip="Repeat Mode">
                <i>
                    {repeatMode === "none" && <svg className="w-[24px] h-[20px] stroke-[2.5] stroke-white/25" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3" /><path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3" /></svg>}
                    {repeatMode === "song" && <svg className="w-[24px] h-[20px] stroke-[2.5] strooke-white-25" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3" /><path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3" /><path d="M11 11l1 -1v4" /></svg>}
                    {repeatMode === "playlist" && <svg className="w-[24px] h-[20px] stroke-[2.5] strooke-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3" /><path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3" /></svg>}
                </i>
            </button>
        </div>
    )
}

function PlayerPlayButtons() {
    const cursor = usePlaylistCursor();
    const playlistControls = usePlaylistControls();
    const audioState = useAudioState();
    const audioControls = useAudioControls();

    return (
        <div className="player-mid grow md:grow-0  md:w-fit flex justify-center place-items-center gap-6 ">
            <button disabled={!cursor.hasPrev} onClick={playlistControls.skipPrev} id="skip-prev" className="w-[32px] h-[32px] flex justify-center items-center group cursor-pointer disabled:opacity-25 disabled:pointer-events-none">
                <i className="hover:opacity-50 transition-opacity ease-out duration-200">
                    {/* <svg className="w-[22px] h-[22px] fill-white " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M20 5v14l-12 -7l12 -7" /><path d="M4 5l0 14" /></svg> */}
                    <svg className="w-[18px] h-[18px] fill-white rotate-180" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 24 24" ><path d="M16.92 9.712 4.525 1.449A2.75 2.75 0 0 0 .25 3.737v16.526a2.748 2.748 0 0 0 4.275 2.288l12.4-8.263a2.749 2.749 0 0 0 0-4.576zM21.5 1.25a2.253 2.253 0 0 0-2.25 2.25v17a2.25 2.25 0 0 0 4.5 0v-17a2.253 2.253 0 0 0-2.25-2.25z" ></path></svg>
                </i>
            </button>

            {
                audioState.isLoading ?
                    <button className='pointer-events-none w-[38px] h-[38px] flex justify-center items-center gap-2 p-2.5 rounded-full bg-white text-black hover:bg-white/60 cursor-pointer transition-colors ease-in-out duration-200'>
                        <i><svg className='w-[22px] h-[22px] fill-black stroke-[2.5]' fill="" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><rect x="11" y="1" width="2" height="5" opacity=".14" /><rect x="11" y="1" width="2" height="5" transform="rotate(30 12 12)" opacity=".29" /><rect x="11" y="1" width="2" height="5" transform="rotate(60 12 12)" opacity=".43" /><rect x="11" y="1" width="2" height="5" transform="rotate(90 12 12)" opacity=".57" /><rect x="11" y="1" width="2" height="5" transform="rotate(120 12 12)" opacity=".71" /><rect x="11" y="1" width="2" height="5" transform="rotate(150 12 12)" opacity=".86" /><rect x="11" y="1" width="2" height="5" transform="rotate(180 12 12)" /><animateTransform attributeName="transform" type="rotate" calcMode="discrete" dur="0.75s" values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12" repeatCount="indefinite" /></g></svg></i>
                    </button>
                    :
                    audioState.isPlaying ?
                        <button onClick={audioControls.pause} style={{ opacity: `${audioState.isLoading ? "0.5" : "1"}` }} className='w-[38px] h-[38px] flex justify-center items-center gap-2 p-2.5 rounded-full bg-white text-black hover:bg-white/60 cursor-pointer transition-colors ease-in-out duration-200'>
                            <i><PauseIcon className='w-[22px] h-[22px] fill-black '></PauseIcon></i>
                        </button>
                        :
                        <button onClick={audioControls.play} style={{ opacity: `${audioState.isLoading ? "0.5" : "1"}` }} className='w-[38px] h-[38px] flex justify-center items-center gap-2 p-2.5 rounded-full bg-white text-black hover:bg-white/60 cursor-pointer transition-colors ease-in-out duration-200'>
                            <i><PlayIcon className='w-[22px] h-[22px] fill-black stroke-[2.5]'></PlayIcon></i>
                        </button>
            }

            <button disabled={!cursor.hasNext} onClick={playlistControls.skipNext} id="skip-next" className="w-[32px] h-[32px]   flex justify-center items-center group cursor-pointer disabled:opacity-25 disabled:pointer-events-none">
                <i className="hover:opacity-50 transition-opacity ease-out duration-200">
                    {/* <svg className="w-[24px] h-[24px] fill-white stroke-3 rotate-180" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M20 5v14l-12 -7l12 -7" /><path d="M4 5l0 14" /></svg> */}
                    <svg className="w-[18px] h-[18px] fill-white" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 24 24" ><path d="M16.92 9.712 4.525 1.449A2.75 2.75 0 0 0 .25 3.737v16.526a2.748 2.748 0 0 0 4.275 2.288l12.4-8.263a2.749 2.749 0 0 0 0-4.576zM21.5 1.25a2.253 2.253 0 0 0-2.25 2.25v17a2.25 2.25 0 0 0 4.5 0v-17a2.253 2.253 0 0 0-2.25-2.25z" ></path></svg>
                </i>
            </button>
        </div>
    )
}

function PlayerSkipPrevButton() {
    const cursor = usePlaylistCursor();
    const playlistControls = usePlaylistControls();
    return (
        <button disabled={!cursor.hasPrev} onClick={playlistControls.skipPrev} id="skip-prev" className="w-[32px] h-[32px] flex justify-center items-center group cursor-pointer disabled:opacity-25 disabled:pointer-events-none">
            <i className="hover:opacity-50 transition-opacity ease-out duration-200">
                {/* <svg className="w-[22px] h-[22px] fill-white " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M20 5v14l-12 -7l12 -7" /><path d="M4 5l0 14" /></svg> */}
                <svg className="w-[18px] h-[18px] fill-white rotate-180" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 24 24" ><path d="M16.92 9.712 4.525 1.449A2.75 2.75 0 0 0 .25 3.737v16.526a2.748 2.748 0 0 0 4.275 2.288l12.4-8.263a2.749 2.749 0 0 0 0-4.576zM21.5 1.25a2.253 2.253 0 0 0-2.25 2.25v17a2.25 2.25 0 0 0 4.5 0v-17a2.253 2.253 0 0 0-2.25-2.25z" ></path></svg>
            </i>
        </button>
    )
}
function PlayerSkipNextButton() {
    const cursor = usePlaylistCursor();
    const playlistControls = usePlaylistControls();
    return (
        <button disabled={!cursor.hasNext} onClick={playlistControls.skipNext} id="skip-next" className="w-[32px] h-[32px]   flex justify-center items-center group cursor-pointer disabled:opacity-25 disabled:pointer-events-none">
            <i className="hover:opacity-50 transition-opacity ease-out duration-200">
                {/* <svg className="w-[24px] h-[24px] fill-white stroke-3 rotate-180" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M20 5v14l-12 -7l12 -7" /><path d="M4 5l0 14" /></svg> */}
                <svg className="w-[18px] h-[18px] fill-white" xmlns="http://www.w3.org/2000/svg" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 24 24" ><path d="M16.92 9.712 4.525 1.449A2.75 2.75 0 0 0 .25 3.737v16.526a2.748 2.748 0 0 0 4.275 2.288l12.4-8.263a2.749 2.749 0 0 0 0-4.576zM21.5 1.25a2.253 2.253 0 0 0-2.25 2.25v17a2.25 2.25 0 0 0 4.5 0v-17a2.253 2.253 0 0 0-2.25-2.25z" ></path></svg>
            </i>
        </button>
    )
}

function PlayerPlayButton() {
    const audioControls = useAudioControls();
    return (
        <button onClick={audioControls.play} className='w-[38px] h-[38px] flex justify-center items-center gap-2 p-2.5 rounded-full bg-white text-black hover:bg-white/60 cursor-pointer transition-colors ease-in-out duration-200'>
            <i><PlayIcon className='w-[22px] h-[22px] fill-black stroke-[2.5]'></PlayIcon></i>
        </button>

    )
}

function PlayerPauseButton() {
    const audioControls = useAudioControls();
    return (

        <button onClick={audioControls.pause} className='w-[38px] h-[38px] flex justify-center items-center gap-2 p-2.5 rounded-full bg-white text-black hover:bg-white/60 cursor-pointer transition-colors ease-in-out duration-200'>
            <i><PauseIcon className='w-[22px] h-[22px] fill-black '></PauseIcon></i>
        </button>
    )
}

function PlayerTogglePlayButton() {
    const audioState = useAudioState();
    const audioControls = useAudioControls();

    return (
        audioState.isPlaying ?
            <button onClick={audioControls.pause} className='w-[38px] h-[38px] flex justify-center items-center gap-2 p-2.5 rounded-full bg-white text-black hover:bg-white/60 cursor-pointer transition-colors ease-in-out duration-200'>
                <i><PauseIcon className='w-[22px] h-[22px] fill-black '></PauseIcon></i>
            </button>
            :
            <button onClick={audioControls.play} style={{ opacity: `${audioState.isLoading ? "0.5" : "1"}` }} className='w-[38px] h-[38px] flex justify-center items-center gap-2 p-2.5 rounded-full bg-white text-black hover:bg-white/60 cursor-pointer transition-colors ease-in-out duration-200'>
                <i><PlayIcon className='w-[22px] h-[22px] fill-black stroke-[2.5]'></PlayIcon></i>
            </button>
    )
}


function PlayerShuffleButton() {
    const { isShuffle } = usePlaylistPlayMode();
    const playlistControls = usePlaylistControls();
    return (
        <div className="">
            <button onClick={playlistControls.toggleShuffle} className="w-[32px] h-[32px] flex justify-center items-center group cursor-pointer" data-tooltip="Shuffle">
                <i className={`${isShuffle ? "opacity-100" : "opacity-50"}`}>
                    <svg className="w-[24px] h-[20px] stroke-2 strooke-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 4l3 3l-3 3" /><path d="M18 20l3 -3l-3 -3" /><path d="M3 7h3a5 5 0 0 1 5 5a5 5 0 0 0 5 5h5" /><path d="M3 17h3a5 5 0 0 0 5 -5a5 5 0 0 1 5 -5h5" /></svg>
                </i>
            </button>
        </div>
    )
}

function PlayerVolumeControl() {
    const { volume, volumeHandler, mute, unmute } = useAudioVolume();

    return (
        <div className="relative flex justify-between items-center hover:gap-2 group cursor-pointer">
            <div className="px-2 py-1 bg-white/25 rounded-md absolute -top-[100%] left-[50%] -translate-x-[50%]  flex  justify-between items-center opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto  w-[100px]  transition-all duration-300 ease-in-out">
                <input
                    id="player-vol-control"
                    type="range"
                    step="any"
                    min={0}
                    max={1}
                    value={volume}
                    onChange={volumeHandler}
                />
            </div>
            {/* <div className="" data-tooltip="Volume"> */}
            <div className="" >
                {
                    volume > 0 ?
                        <button onClick={mute} className="flex justify-center items-center  aspect-square cursor-pointer">
                            <Volume2Icon className="stroke-[1.8] hover:stroke-stone-400  transition-color duration-300 ease-in-out" width={20} />
                        </button>
                        :
                        <button onClick={unmute} className="flex justify-center items-center  aspect-square cursor-pointer">
                            <VolumeOffIcon className="stroke-[1.8] hover:stroke-stone-400  transition-color duration-300 ease-in-out" width={20} />
                        </button>
                }
            </div>
        </div>
    )
}

function PlayerProgressBar() {
    const { currentTime, duration, progressHandler } = useAudioProgress();

    return (
        <div className="mx-auto w-full relative h-auto progress-bar select-none flex justify-between items-center text-xs font-medium">
            <div className="w-[10%] absolute -top-5 md:-top-6 left-0 ">
                <span className="elapsed-time text-center">{TimeUtils.toShortTMS(currentTime)}</span>
            </div>
            <div className="grow flex items-center">
                <input
                    id="player-progress-control"
                    type="range"
                    step="any"
                    min={0}
                    max={duration}
                    value={currentTime}
                    onChange={progressHandler}
                    className="inline-block w-full h-auto"
                />
            </div>
            <div className="w-[10%] absolute -top-5 md:-top-6  right-0 text-right">
                <span className="current-time">{TimeUtils.toShortTMS(duration)}</span>
            </div>
        </div >
    )

}


export {
    PlayerRepeatButton,
    PlayerPlayButtons,
    PlayerPlayButton, PlayerPauseButton, PlayerTogglePlayButton,
    PlayerSkipPrevButton, PlayerSkipNextButton,
    PlayerShuffleButton,
    PlayerVolumeControl,
    PlayerProgressBar
}