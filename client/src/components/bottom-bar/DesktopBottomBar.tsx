import { Link } from "@tanstack/react-router";
import { ChevronUpIcon, Disc2Icon, HeartIcon, ListMusicIcon, MicVocalIcon } from "lucide-react";
import { BASE_URL } from "src/env/HostURL";
import { usePlaylistCurrent, usePlaylistProps } from "src/player-context/PlaylistContext";
import { TextUtils } from "src/utils/FormatText";
import { PlayerPlayButtons, PlayerProgressBar, PlayerRepeatButton, PlayerShuffleButton, PlayerVolumeControl } from "../player/PlayerButtons";
import { usePlaylistVisibilityActions } from "src/context/PlaylistVisibilityContext";
import { useFullscreenPlayerActions, useFullscreenPlayerState } from "src/context/FullscrenPlayerVisibility";
import { useEffect, useState } from "react";


function PlayerBarCurrentSong() {
    const { song } = usePlaylistCurrent();
    return (
        <div className="flex items-center w-[30%] ">
            <div className="hidden lg:block song-art w-auto h-auto ">
                {
                    song ?
                        <img className="max-w-[64px] h-auto rounded-md" src={`${BASE_URL}/${song.cover?.x64}`} alt="" />
                        :
                        <Disc2Icon></Disc2Icon>
                }
            </div>
            <div className="song-meta min-w-0 px-2 leading-5 ">

                {
                    song &&
                    <>
                        <div className="text-[15px] font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                            <span title={song.songTitle}>
                                {song.songTitle}
                            </span>
                        </div>
                        <div className="overflow-hidden whitespace-nowrap text-ellipsis">
                            <Link
                                title={song.artistName}
                                className="text-xs font-medium  hover:underline cursor-pointer"
                                to="/artists/$artistId/$artistName" params={{ artistId: `${song.artistId}`, artistName: `${TextUtils.toKebabCase(song.artistName)}` }}>
                                {song.artistName}
                            </Link>
                        </div>
                        <div className="overflow-hidden whitespace-nowrap text-ellipsis">
                            <Link
                                title={song.albumName}
                                className="text-xs font-medium  hover:underline cursor-pointer"
                                to="/albums/$albumId/$albumName" params={{ albumId: `${song.albumId}`, albumName: `${TextUtils.toKebabCase(song.albumName)}` }}>
                                {song.albumName}
                            </Link>
                        </div>

                    </>
                }
            </div>

        </div>
    )
}


function PlayerBarControls() {

    return (
        <div className="grow h-full text-zinc-50 flex flex-col justify-evenly ">

            <div className="player-controls w-full flex justify-center items-center lg:gap-5 ">
                <PlayerRepeatButton></PlayerRepeatButton>

                <PlayerPlayButtons></PlayerPlayButtons>

                <PlayerShuffleButton></PlayerShuffleButton>

            </div>
            <PlayerProgressBar></PlayerProgressBar>
        </div >
    )
}



function PlayerBarMediaControls() {

    const playlistVisibilitActions = usePlaylistVisibilityActions();
    const fullscreenPlayerActions = useFullscreenPlayerActions();
    return (
        <div className="extra-controls shrink-0 w-[30%] flex justify-end items-center gap-6   ">
            <div className="favorite relative group">
                <button className="group cursor-pointer flex justify-center items-center  aspect-square" data-tooltip="Add to favorites">
                    <HeartIcon className="stroke-[2.25] hover:stroke-stone-400  transition-color duration-300 ease-in-out" width={20} />
                </button>
            </div>
            <div className="hidden lg:block">
                <button className="group cursor-pointer flex justify-center items-center  aspect-square" data-tooltip="Show lyrics">
                    <MicVocalIcon className="stroke-[2.25] hover:stroke-stone-400  transition-color duration-300 ease-in-out" width={20} />
                </button>
            </div>

            <PlayerVolumeControl ></PlayerVolumeControl>
            <div className="">
                <button onClick={playlistVisibilitActions.updateVisibility} className="cursor-pointer flex justify-center items-center  aspect-square" data-tooltip="Show Queue" >
                    <ListMusicIcon className="stroke-[2.25] hover:stroke-stone-400  transition-color duration-300 ease-in-out" width={20} />
                </button>
            </div>
            <div >
                <button data-tooltip="Full Screen Player" data-flow="top-left" onClick={fullscreenPlayerActions.updateVisibility} className="disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex justify-center items-center aspect-square hover:opacity-75 transition-colors ease-out duration-300">
                    <i>
                        <ChevronUpIcon className={`${false ? "rotate-180" : "rotate-0"} stroke-3 stroke-white`} width={20} />
                    </i>
                </button>
            </div>
        </div>
    )
}



export default function DesktopBottomBar() {
    const playlistProps = usePlaylistProps();
    const fullscrenPlayerState = useFullscreenPlayerState();
    const [enableControls, setEnableControls] = useState(false);

    useEffect(() => {
        if (!playlistProps.isEmpty)
            setEnableControls(true);
    }, [playlistProps]);

    return (
        <div className="fixed bottom-0 left-0 z-10 w-full h-auto">
            <div className={`${enableControls ? "translate-y-0" : "translate-y-full"} w-full h-[88px]  bg-[#030303]/90 backdrop-blur-[26px] border-t border-[rgba(35,35,35)] transition-transform ease-out duration-200 `}>
                <div className={`
                px-4  w-full h-full flex lg:flex-row lg:justify-between lg:items-center bg-transparent relative    
            `}>
                    {
                        !fullscrenPlayerState.isVisible &&
                        <>
                            <PlayerBarCurrentSong></PlayerBarCurrentSong>
                            <PlayerBarControls></PlayerBarControls>
                            <PlayerBarMediaControls></PlayerBarMediaControls>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}