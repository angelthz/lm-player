import { createFileRoute } from '@tanstack/react-router'

import { SongDTO } from '../../types/types';

import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';

import { useCallback, useEffect, useRef, useState } from 'react';

import { AlbumCardFlexMemo } from 'src/components/cards/AlbumCardFlex';

import { logger } from 'src/utils/Logger';
import { FetchAlbums } from 'src/api/music/albums/FetchAlbums';
import { usePlaylistActions, usePlaylistProps } from 'src/player-context/PlaylistContext';
import { useAudioContext, useAudioState } from 'src/player-context/AudioContext';
import { BASE_URL } from 'src/env/HostURL';


const queryAlbumsOptions = infiniteQueryOptions({
    queryKey: ["albums-page"],
    queryFn: FetchAlbums.getPaginatedAlbums,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
        if (lastPage.length === 0) {
            return undefined
        }
        return lastPageParam + 1
    },
    staleTime: 1000 * 60 * 5, //five minutes
})


export const Route = createFileRoute('/albums/')({
    component: RouteComponent,
    loader: async ({ context: { queryClient } }) => {
        return queryClient.ensureInfiniteQueryData(queryAlbumsOptions);
    },
    staleTime: 1000 * 60 * 5, //five minutes
})


function RouteComponent() {
    //route query
    const { data, isPending, fetchNextPage, status, isFetching, hasNextPage } = useInfiniteQuery(queryAlbumsOptions);

    //context
    const playlistProps = usePlaylistProps();
    const playlistActions = usePlaylistActions();
    const audioState = useAudioState();
    const audio = useAudioContext();

    //component state
    const [activeAlbumID, setActiveAlbumID] = useState((playlistProps.type === 'album') ? playlistProps.id : -1);

    const targetEl = useRef<HTMLDivElement | null>(null);

    //infinite scroll setup
    useEffect(() => {
        console.debug("setup observer")
        const options = {
            rootMargin: "0px",
            scrollMargin: "0px",
            threshold: 1.0,
        };

        let observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // console.debug(entry)
                if (entry.isIntersecting) {
                    // console.debug("is intersecting")
                    fetchNextPage()
                }
            })
        }, options);

        if (targetEl.current)
            observer.observe(targetEl.current);
        // logger.log(observer)

        return () => observer.disconnect();
    }, []);


    //log component rendering
    useEffect(() => { logger.log(`%c-> Rendering: Album Index`, 'background: #1a1a1a; color: #FA6781; font-weight:700;') })


    const activeHandler = useCallback(async (id: number) => {
        try {
            if (id === activeAlbumID) return;
            let req = await fetch(`${BASE_URL}/api/music/album/songs/${id}`);
            if (!req.ok) throw new Error(`Error fetching album: ${id}`)
            let json = await req.json() as SongDTO[];
            playlistActions.update(json, id, 'album');
            setActiveAlbumID(id);

        } catch (err) {
            console.error(err);
        }
    }, []);

    return (
        <div className="px-4 md:px-8 pt-8 pb-14 ">
            <section className="relative">
                <header className="my-4">
                    <h2 className="text-4xl font-semibold ">Albums</h2>
                </header>

                <div className="flex flex-wrap w-full h-full">
                    {
                        status === "success" &&
                        data.pages.flat().map((album, idx) =>
                            <div id={`cell-${idx}`} className={`bg w-[calc(100%/2)] xs:w-[calc(100%/3)] md:w-[calc(100%/4)] lg:w-[calc(100%/5)] xl:w-[calc(100%/6)] h-auto p-1`}>
                                <div className="w-full h-full ">
                                    <AlbumCardFlexMemo
                                        album={album}
                                        activeHandler={activeHandler}
                                        isActive={album.albumId === activeAlbumID}
                                        isPlaying={album.albumId === activeAlbumID && audioState.isPlaying}
                                    ></AlbumCardFlexMemo>
                                </div>
                            </div>
                        )
                    }
                </div>
                {
                    isFetching &&
                    <div className='w-full h-[48px] my-1 flex justify-center items-center'>
                        <svg className='fill-white w-[28px] h-[28px]' fill="hsl(228, 97%, 42%)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="6" width="2.8" height="12"><animate begin="spinner_Diec.begin+0.4s" attributeName="y" calcMode="spline" dur="0.6s" values="6;1;6" keySplines=".14,.73,.34,1;.65,.26,.82,.45" /><animate begin="spinner_Diec.begin+0.4s" attributeName="height" calcMode="spline" dur="0.6s" values="12;22;12" keySplines=".14,.73,.34,1;.65,.26,.82,.45" /></rect><rect x="5.8" y="6" width="2.8" height="12"><animate begin="spinner_Diec.begin+0.2s" attributeName="y" calcMode="spline" dur="0.6s" values="6;1;6" keySplines=".14,.73,.34,1;.65,.26,.82,.45" /><animate begin="spinner_Diec.begin+0.2s" attributeName="height" calcMode="spline" dur="0.6s" values="12;22;12" keySplines=".14,.73,.34,1;.65,.26,.82,.45" /></rect><rect x="10.6" y="6" width="2.8" height="12"><animate id="spinner_Diec" begin="0;spinner_dm8s.end-0.1s" attributeName="y" calcMode="spline" dur="0.6s" values="6;1;6" keySplines=".14,.73,.34,1;.65,.26,.82,.45" /><animate begin="0;spinner_dm8s.end-0.1s" attributeName="height" calcMode="spline" dur="0.6s" values="12;22;12" keySplines=".14,.73,.34,1;.65,.26,.82,.45" /></rect><rect x="15.4" y="6" width="2.8" height="12"><animate begin="spinner_Diec.begin+0.2s" attributeName="y" calcMode="spline" dur="0.6s" values="6;1;6" keySplines=".14,.73,.34,1;.65,.26,.82,.45" /><animate begin="spinner_Diec.begin+0.2s" attributeName="height" calcMode="spline" dur="0.6s" values="12;22;12" keySplines=".14,.73,.34,1;.65,.26,.82,.45" /></rect><rect x="20.2" y="6" width="2.8" height="12"><animate id="spinner_dm8s" begin="spinner_Diec.begin+0.4s" attributeName="y" calcMode="spline" dur="0.6s" values="6;1;6" keySplines=".14,.73,.34,1;.65,.26,.82,.45" /><animate begin="spinner_Diec.begin+0.4s" attributeName="height" calcMode="spline" dur="0.6s" values="12;22;12" keySplines=".14,.73,.34,1;.65,.26,.82,.45" /></rect></svg>
                    </div>
                }

                {
                    status === "success" &&
                    // <div ref={targetEl} style={{ display: data?.pages && hasNextPage ? "block" : "none" }} className="w-full h-[46px] bg-red-600"></div>
                    <div ref={targetEl} style={{ display: data?.pages && hasNextPage ? "block" : "none" }} className=""></div>
                }
            </section>

        </div>

    )

}


