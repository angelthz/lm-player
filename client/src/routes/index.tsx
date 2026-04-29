import { queryOptions, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { FetchSong } from 'src/api/music/songs/querySongs';
import { SongsCarousel } from 'src/components/carousel/SongsCarousel';
import { RankedPlaylist } from 'src/components/playlist/RankedPlaylist';


const queryHomeOptions = queryOptions({
    queryKey: ["/", "", "/home"],
    queryFn: async () => {
        let [recentPlayed, mostPlayed] = await Promise.all([FetchSong.getRecentPlayed(), FetchSong.getMostPlayed()]);
        return { recentPlayed, mostPlayed };
    },
    staleTime: 1000 * 60 * 3, //five minutes
})

export const Route = createFileRoute('/')({
    component: RouteComponent,
    loader: ({ context: { queryClient } }) => {
        return queryClient.ensureQueryData(queryHomeOptions)
    },
    staleTime: 1000 * 60 * 3, //five minutes
})

function RouteComponent() {
    const { data } = useQuery(queryHomeOptions);


    return (
        <div className="w-full mx-auto relative px-4 md:px-8 py-8 " >
            <section id='recent-played' className="">
                {
                    data?.recentPlayed &&
                    <SongsCarousel songs={data.recentPlayed}></SongsCarousel>
                }
            </section >

            <section id='most-played' className="">
                <div className="">
                    {
                        data?.mostPlayed && <RankedPlaylist songs={data?.mostPlayed} title='Most Played'></RankedPlaylist>

                    }
                </div>
            </section >

        </div >
    )
}

