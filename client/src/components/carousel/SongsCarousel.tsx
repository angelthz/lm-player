import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BASE_URL } from "src/env/HostURL";
import { useAudioState } from "src/player-context/AudioContext";
import { usePlaylistActions, usePlaylistProps } from "src/player-context/PlaylistContext";
import { SongDTO } from "src/types/types";
import { SongCardMemo } from "../cards/SongCard";

export function SongsCarousel({ songs }: { songs: SongDTO[] }) {

    //
    const audioState = useAudioState();
    const playlistProps = usePlaylistProps()
    const playlistActions = usePlaylistActions();

    //component state
    const [enableRight, setEnableRight] = useState(true);
    const [enableLeft, setEnableLeft] = useState(false);
    // const [activeAlbumID, setActiveAlbumID] = useState((playlistInfo.type === PlaylistType.ALBUM) ? playlistInfo.id : -1);


    const carouselRef = useRef<HTMLDivElement | null>(null);

    const leftButtonHandler = (e: React.MouseEvent) => {
        const el = carouselRef.current;
        if (el) {
            el.scrollLeft -= 340;
            if (el.scrollLeft <= (el.scrollWidth - el.clientWidth))
                setEnableRight(true)
            if (el.scrollLeft <= 340)
                setEnableLeft(false)
            console.log(el.scrollLeft, (el.scrollWidth - el.clientWidth))
        }

    }
    const rightButtonHandler = (e: React.MouseEvent) => {
        const el = carouselRef.current;
        if (el) {
            el.scrollLeft += 340;
            if (el.scrollLeft >= (el.scrollWidth - (el.clientWidth + 340)))
                setEnableRight(false)
            if (el.scrollLeft >= 0)
                setEnableLeft(true)
            console.log(el.scrollLeft, (el.scrollWidth - el.clientWidth))
        }

    }

    const playSelected = useCallback(async (id: number) => {
        try {
            //replace with stale fetch
            let req = await fetch(`${BASE_URL}/api/music/songs/${id}`);
            if (!req.ok) throw new Error(`Error fetching album: ${id}`)
            let json = await req.json() as SongDTO;
            playlistActions.update([json], id, "song");
            // setActiveAlbumID(id);

        } catch (err) {
            console.error(err);
        }
    }, []);


    useEffect(() => {
        console.log(`%cRendering Album Carousel`, 'background: #1a1a1a; color: #9B93ED;')
    })


    return (
        <div className="carousel-container w-full h-auto ">
            <div className="carousel-header flex justify-between items-center my-2 ">
                <div className="">
                    <h2 className="text-2xl font-bold text-white">Recent Played</h2>
                </div>
                <div className='carousel-controls w-[50%] flex justify-end gap-2'>
                    <div id='view-all-button' className=''>
                        <a href="" className='text-[14px] font-semibold decoration-woodsmoke-200 hover:decoration-white text-woodsmoke-200 hover:text-white hover:underline hover:decoration-2 transition-all ease-out duration-300'>View all</a>
                    </div>
                    <div className='carousel-buttons flex gap-2 items-center '>
                        <button disabled={!enableLeft} onClick={leftButtonHandler} className='disabled:opacity-50 disabled:pointer-events-none w-[24px] h-[24px] rounded-full bg-white/10 hover:bg-active-white/25 flex justify-center items-center cursor-pointer relative transition-colors ease-out duration-200'>
                            <i className="flex justify-center items-center ">
                                <ChevronLeftIcon className='w-[16px] h-[16px] stroke-3'></ChevronLeftIcon>
                            </i>
                        </button>
                        <button disabled={!enableRight} onClick={rightButtonHandler} className='disabled:opacity-50 disabled:pointer-events-none w-[24px] h-[24px] rounded-full bg-white/10 hover:bg-active-white/25 flex justify-center items-center cursor-pointer relative transition-colors ease-out duration-200'>
                            <i className="flex justify-center items-center ">
                                <ChevronRightIcon className='w-[16px] h-[16px] stroke-3'></ChevronRightIcon>
                            </i>
                        </button>
                    </div>
                </div>
            </div>

            <div className='carousel-cards scroll-smooth flex flex-nowrap gap-2 overflow-x-scroll relative scrollbar-hide px-2 py-4' ref={carouselRef}>
                {
                    songs.length > 0 ?
                        songs.map(song =>
                            <div className='max-w-[200px] h-auto shrink-0'>
                                <SongCardMemo
                                    song={song}
                                    playSelected={playSelected}
                                    artist={true}
                                    album={true}
                                    year={true}
                                    isActive={playlistProps.type === "song" && song.songId === playlistProps.id}
                                    isPlaying={(playlistProps.type === "song" && song.songId === playlistProps.id) && audioState.isPlaying}
                                ></SongCardMemo>
                            </div>
                        )
                        :
                        <h3 className="text-2xl font-bold text-white">Empty Activity</h3>

                }
            </div>
        </div>
    )
}