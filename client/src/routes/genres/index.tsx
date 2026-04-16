import { queryOptions, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { FetchGenres } from 'src/api/music/genres/FetchGenres';
import GenreCard from 'src/components/cards/GenreCard';


export const genresQueryOptions = queryOptions({
    queryKey: ["genres-page"],
    queryFn: FetchGenres.getAll,
    staleTime: 1000 * 60 * 5
})

export const Route = createFileRoute('/genres/')({
    component: RouteComponent,
    loader: async ({ context: { queryClient }, params }) => {
        return queryClient.ensureQueryData(genresQueryOptions);
    },
    staleTime: 1000 * 60 * 5
})

function RouteComponent() {
    let { data } = useQuery(genresQueryOptions);

    console.log(data)
    return (
        <div className="px-4 md:px-8 pt-8 pb-14 ">
            <section className="relative">
                <header className="my-4">
                    <h2 className="text-4xl font-semibold ">Genres</h2>
                </header>

                <div className="flex flex-wrap w-full h-full">
                    {
                        data?.map((genre, idx) =>
                            <div id={`cell-${idx}`} className={`bg w-[calc(100%/2)] xs:w-[calc(100%/3)] md:w-[calc(100%/4)] lg:w-[calc(100%/5)] xl:w-[calc(100%/6)] h-auto p-1`}>
                                <div className="w-full h-full ">
                                    <GenreCard genre={genre} isActive={false}></GenreCard>
                                </div>
                            </div>
                        )
                    }
                </div>

            </section>

        </div>
    )

    return (

        <>
            <div className="px-4 md:px-8 py-4">
                <section className="relative">
                    <header className="my-4">
                        <h2 className="text-4xl font-semibold ">Genres</h2>
                    </header>
                </section>
                <section>
                    <div className="content px-8 grid grid-cols-(--responsive-grid) gap-4">
                        {data?.map(genre => <GenreCard genre={genre} isActive={false}></GenreCard>)}
                    </div>
                </section>
            </div>

        </>
    )
}
