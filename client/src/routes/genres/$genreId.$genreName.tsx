import { infiniteQueryOptions, queryOptions, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef } from 'react';
import { FetchGenres } from 'src/api/music/genres/FetchGenres';
import { FetchSong } from 'src/api/music/songs/querySongs';
import SongsPlaylist from 'src/components/playlist/SongsPlaylist';


export const querySongsByGenreOptions = (genreId: string) => infiniteQueryOptions({
    queryKey: ["genre-page", genreId],
    queryFn: async ({ pageParam }: { pageParam: number }) => FetchGenres.getByIdPaginated(genreId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
        if (lastPage.length === 0) {
            return undefined
        }
        return lastPageParam + 1
    },
    staleTime: 1000 * 60 * 5, //five minutes

})

export const Route = createFileRoute('/genres/$genreId/$genreName')({
    component: RouteComponent,
    loader: ({ context, params }) => {
        context.queryClient.ensureInfiniteQueryData(querySongsByGenreOptions(params.genreId))
    },
    staleTime: 1000 * 60 * 5, //five minutes

})

function RouteComponent() {
    const { genreName, genreId } = Route.useParams();
    const { data, status, isFetching, hasNextPage, fetchNextPage } = useInfiniteQuery(querySongsByGenreOptions(genreId));
    const targetEl = useRef<HTMLDivElement | null>(null);

    //infinite scroll observer settings
    useEffect(() => {
        console.debug("setup observer")
        const options = {
            rootMargin: "0px",
            scrollMargin: "0px",
            threshold: 1.0,
        };

        let observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    fetchNextPage()
                }
            })
        }, options);

        if (targetEl.current)
            observer.observe(targetEl.current);

        return () => observer.disconnect();
    }, []);

    return (
        <div className="px-4 md:px-8 pt-8 pb-14">
            <section className="header relative">
                <header className="my-4">
                    <h2 className="text-4xl font-semibold ">Songs</h2>
                </header>
            </section>
            <section className="playlist-content">
                {status === "success" && <SongsPlaylist title="Songs" songList={data.pages.flat()}></SongsPlaylist>}
                {
                    isFetching &&
                    <div className='w-full h-[48px] my-1 flex justify-center items-center'>
                        <svg className='fill-white w-[28px] h-[28px]' fill='hsl(228, 97%, 42%)' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><rect x='1' y='6' width='2.8' height='12'><animate begin='spinner_Diec.begin+0.4s' attributeName='y' calcMode='spline' dur='0.6s' values='6;1;6' keySplines='.14,.73,.34,1;.65,.26,.82,.45' /><animate begin='spinner_Diec.begin+0.4s' attributeName='height' calcMode='spline' dur='0.6s' values='12;22;12' keySplines='.14,.73,.34,1;.65,.26,.82,.45' /></rect><rect x='5.8' y='6' width='2.8' height='12'><animate begin='spinner_Diec.begin+0.2s' attributeName='y' calcMode='spline' dur='0.6s' values='6;1;6' keySplines='.14,.73,.34,1;.65,.26,.82,.45' /><animate begin='spinner_Diec.begin+0.2s' attributeName='height' calcMode='spline' dur='0.6s' values='12;22;12' keySplines='.14,.73,.34,1;.65,.26,.82,.45' /></rect><rect x='10.6' y='6' width='2.8' height='12'><animate id='spinner_Diec' begin='0;spinner_dm8s.end-0.1s' attributeName='y' calcMode='spline' dur='0.6s' values='6;1;6' keySplines='.14,.73,.34,1;.65,.26,.82,.45' /><animate begin='0;spinner_dm8s.end-0.1s' attributeName='height' calcMode='spline' dur='0.6s' values='12;22;12' keySplines='.14,.73,.34,1;.65,.26,.82,.45' /></rect><rect x='15.4' y='6' width='2.8' height='12'><animate begin='spinner_Diec.begin+0.2s' attributeName='y' calcMode='spline' dur='0.6s' values='6;1;6' keySplines='.14,.73,.34,1;.65,.26,.82,.45' /><animate begin='spinner_Diec.begin+0.2s' attributeName='height' calcMode='spline' dur='0.6s' values='12;22;12' keySplines='.14,.73,.34,1;.65,.26,.82,.45' /></rect><rect x='20.2' y='6' width='2.8' height='12'><animate id='spinner_dm8s' begin='spinner_Diec.begin+0.4s' attributeName='y' calcMode='spline' dur='0.6s' values='6;1;6' keySplines='.14,.73,.34,1;.65,.26,.82,.45' /><animate begin='spinner_Diec.begin+0.4s' attributeName='height' calcMode='spline' dur='0.6s' values='12;22;12' keySplines='.14,.73,.34,1;.65,.26,.82,.45' /></rect></svg>
                    </div>
                }

                {/* <div ref={targetEl} style={{ display: hasNextPage ? "block" : "none" }} className="w-full h-[46px] bg-red-600"></div> */}
                <div ref={targetEl} style={{ display: hasNextPage ? "block" : "none" }} className=""></div>
            </section >
        </div>
    );
}
