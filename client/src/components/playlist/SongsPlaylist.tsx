
import { ClockIcon, HeartIcon, MoreHorizontalIcon, PauseIcon, PlayIcon, UserRoundIcon } from "lucide-react";
import { CollaboratorDTO, MostPlayedSongDTO, RecentPlayedSongDTO, SongDTO } from "src/types/types";
import { Link } from "@tanstack/react-router";
import { memo, useCallback, useEffect, useState } from "react";
import { logger } from "src/utils/Logger";
import { FormatText, TextUtils } from "src/utils/FormatText";
import { useAudioControls, useAudioState } from "src/player-context/AudioContext";
import { BASE_URL } from "src/env/HostURL";
import { usePlaylistActions, usePlaylistCurrent } from "src/player-context/PlaylistContext";




interface PlayListProps {
    songList: SongDTO[];
    title: string;
}

interface ItemProps {
    song: SongDTO;
    idx: number;
    isCurrent: boolean;
    isPlaying: boolean;
    playSong: (song: SongDTO) => void;
}

interface CollaboratorProps {
    collaborators: CollaboratorDTO[];
}


function CollaboratorItem(props: CollaboratorProps) {
    return (
        <>
            {
                props.collaborators.length > 1 ?
                    <UserRoundIcon></UserRoundIcon>
                    // <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-users-group"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1" /><path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M17 10h2a2 2 0 0 1 2 2v1" /><path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M3 13v-1a2 2 0 0 1 2 -2h2" /></svg>
                    :
                    <Link to="/artists/$artistName/$artistId"
                        params={{
                            artistName: FormatText.formatFileName(props.collaborators[0].name).toLocaleLowerCase(),
                            artistId: props.collaborators[0].id
                        }}
                        className="block overflow-hidden whitespace-pre text-ellipsis hover:underline cursor-pointer">
                        {props.collaborators[0].name}
                    </Link>

            }
        </>
    )
}

function PlaylistItem({ song, idx, isCurrent, isPlaying, playSong }: ItemProps) {

    const audioControls = useAudioControls();
    useEffect(() => logger.log("Row Item", idx))
    return (
        <div className={`
            grid 
            grid-cols-[repeat(2,48px)_repeat(7,1fr)_72px_repeat(2,48px)] 
            grid-rows-2
            rounded-md my-2 text-sm font-semibold hover:bg-white/10 transition-colors duration-300 ease-in-out
            ${isCurrent ? "bg-white/25" : ""}
        `}>
            <div className="num-row col-span-1 row-span-2 justify-self-center self-center">
                <span className="">{idx + 1}</span>
            </div>

            <div className="cover-row song-num col-span-1 row-span-2  justify-self-center self-center cursor-pointer p-1">
                {
                    !isCurrent ?
                        <button onClick={() => playSong(song)} className="block relative group cursor-pointer" >
                            <img className="w-[46px] aspect-square rounded-sm" src={`${BASE_URL}/${song.cover?.x64}`} alt="" />
                            <div className="absolute top-0 left-0 bottom-0 right-0 bg-main-dark-950/50 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-sm">
                                <PlayIcon className="fill-white stroke-0" />
                            </div>
                        </button>
                        : isPlaying ?
                            <button onClick={audioControls.pause} className="block relative group cursor-pointer" >
                                <img className="w-[46px] aspect-square rounded-sm" src={`${BASE_URL}/${song.cover?.x64}`} alt="" />
                                <div className={`${isCurrent ? "opacity-100" : ""} absolute top-0 left-0 bottom-0 right-0 bg-main-dark-950/50 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-sm`}>
                                    <PauseIcon className="fill-white stroke-0" />
                                </div>
                            </button>
                            :
                            <button onClick={audioControls.play} className="block relative group cursor-pointer" >
                                <img className="w-[46px] aspect-square rounded-sm" src={`${BASE_URL}/${song.cover?.x64}`} alt="" />
                                <div className={`${isCurrent ? "opacity-100" : ""} absolute top-0 left-0 bottom-0 right-0 bg-main-dark-950/50 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-sm`}>
                                    <PlayIcon className="fill-white stroke-0" />
                                </div>
                            </button>
                }
            </div>
            <div className="title-row col-span-9 row-span-1 col-start-3 lg:col-span-3 lg:row-span-2 self-center px-4">
                <span className="block overflow-hidden whitespace-pre text-ellipsis hover:underline cursor-pointer">
                    {song.songTitle}
                </span>
            </div>
            <div className="artist-row hidden lg:block col-span-2 row-span-2 self-center px-4" data-tooltip={song.albumName}>
                <Link
                    to="/albums/$albumId/$albumName"
                    params={{ albumId: song.albumId, albumName: TextUtils.toKebabCase(song.albumName) }}
                    className="block overflow-hidden whitespace-pre text-ellipsis hover:underline decoration-2  cursor-pointer"
                >
                    {song.albumName}
                </Link>
            </div>
            <div

                className="album-row col-span-9 row-span-1 col-start-3 row-start-2 lg:col-span-2 lg:row-span-2 lg:row-col-start-6 self-center px-4 ">
                <Link
                    to="/artists/$artistId/$artistName"
                    params={{ artistId: song.artistId, artistName: TextUtils.toKebabCase(song.artistName) }}
                    className="block overflow-hidden whitespace-pre text-ellipsis hover:underline decoration-2 cursor-pointer"
                >
                    {song.artistName}
                </Link>
            </div>
            <div className="dur-row hidden lg:block col-span-1 row-span-2  justify-self-center self-center">
                <span className="">{song.duration?.minutes.toFixed(2).replace(".", ":")}</span>
            </div>
            <div className="fav-row hidden lg:block col-span-1 row-span-2 justify-self-center self-center">
                <button className="group/fav cursor-pointer">
                    <i className=""><HeartIcon className="group-hover/fav:fill-white transition-[fill] duration-500"></HeartIcon></i>
                </button>
            </div>
            <div className="menu-row col-span-1 row-span-2 justify-self-center self-center">
                <span className=""><i><MoreHorizontalIcon></MoreHorizontalIcon></i></span>
            </div>
        </div>
    )
}

const PlaylistItemMemo = memo(PlaylistItem, (prev: ItemProps, next: ItemProps) => {
    return prev.isCurrent === next.isCurrent && prev.isPlaying === next.isPlaying;
});

export default function SongsPlaylist(props: PlayListProps) {
    const playlistActions = usePlaylistActions();
    const current = usePlaylistCurrent();
    const audioState = useAudioState();

    // const [isCurrent, setIsCurrent] = useState(false);

    const playSong = useCallback((song: SongDTO) => {
        playlistActions.update([song], song.songId, "song", false);
    }, []);


    return (
        <div className="">
            <div className="mb-4 text-sm font-medium text-woodsmoke-200 border-b border-white/25 py-2">
                <div className="
                    grid 
                    grid-cols-[repeat(2,48px)_repeat(7,1fr)_72px_repeat(2,48px)] 
                ">
                    <div className="col-span-1 row-span-2 justify-self-center self-center ">#</div>
                    <div className="col-start-3 col-span-3 px-4">Title</div>
                    <div className="hidden md:block col-span-2 px-4">Artist</div>
                    <div className="hidden md:block col-span-2 px-4">Album</div>
                    <div className="hidden md:block col-span-1 px-4">
                        <ClockIcon className="w-4 h-4" />
                    </div>
                </div>
            </div>
            {
                props.songList.map((song, idx) =>
                    <PlaylistItemMemo
                        song={song}
                        idx={idx}
                        playSong={playSong}
                        isCurrent={current.song?.songId === song.songId}
                        isPlaying={current.song?.songId === song.songId && audioState.isPlaying}
                    ></PlaylistItemMemo>
                )
            }
        </div>
    )
}

function RowSkeleton() {
    return (
        <div className="animate-pulse h-[46px] grid grid-cols-(--my-grid-cols) even:bg-[hsl(0,0%,6%)] odd:bg-main-dark-600 rounded-md my-2 "></div>
    )
}

export function RowSkeletonLoader(props: { items: number }) {
    return (
        (Array(props.items).fill(0).map(i => <RowSkeleton></RowSkeleton>))
    )
}