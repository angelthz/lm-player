import { queryOptions, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { FetchSong } from 'src/api/music/songs/querySongs';
import { usePlaylistActions } from 'src/player-context/PlaylistContext';


const queryHomeOptions = queryOptions({
    queryKey: ["/", "", "/home"],
    queryFn: async () => {
        let [songs, recentPlayed, mostPlayed] = await Promise.all([FetchSong.getAllSongs(), FetchSong.getRecentPlayed(), FetchSong.getMostPlayed()]);
        return { songs, recentPlayed, mostPlayed };
    },
    staleTime: 1000 * 60 * 5, //five minutes
})

export const Route = createFileRoute('/')({
    component: RouteComponent,
    loader: ({ context: { queryClient } }) => {
        return queryClient.ensureQueryData(queryHomeOptions)
    },
    staleTime: 1000 * 60 * 5, //five minutes
})

function RouteComponent() {
    const { data } = useQuery(queryHomeOptions);
    const playlist = usePlaylistActions();
    useEffect(() => {
        playlist.update(data?.songs!, 27, "playlist");
    }, []);

    return (
        <div className="w-full mx-auto relative px-4 md:px-8 py-8" >
            <section className='relative'>
            </section>
            <section id='recent-played' className="">
                <h2>Recent Played</h2>
                {
                    data?.recentPlayed &&
                    data.recentPlayed.map(s => <span>{s.songTitle}</span>)
                }
            </section >
            <hr />
            <section id='most-played' className="">
                <h2>Most Played</h2>
                <div className="">
                    {
                        data?.mostPlayed &&
                        data.mostPlayed.map(s => <span>{s.songTitle}</span>)
                    }
                </div>
            </section >
            <hr />
            <section>
                {
                    data?.songs &&
                    data.songs.map((s, idx) => <p>{idx}: {s.songTitle}</p>)
                }
            </section>
        </div >
    )
}

