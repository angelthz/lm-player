import { queryOptions, useQuery } from '@tanstack/react-query';
import { createFileRoute, useCanGoBack, useRouter } from '@tanstack/react-router'
import { ArrowLeftIcon, PauseIcon, PlayIcon } from 'lucide-react';
import { ArtistDetailDTO, PhotoDTO, SongDTO } from 'src/types/types';
import parse from "html-react-parser";
import { useCallback, useEffect, useRef, useState } from 'react';
import { RankedPlaylist } from 'src/components/playlist/RankedPlaylist';
import { FetchArtists } from 'src/api/music/artists/FetchArtists';
import { usePlaylistActions, usePlaylistControls, usePlaylistPlayMode, usePlaylistProps } from 'src/player-context/PlaylistContext';
import { useAudioControls, useAudioState } from 'src/player-context/AudioContext';
import { BASE_URL } from 'src/env/HostURL';
import { ArtistCoverMemo } from 'src/components/covers/ArtistCover';
import { SongsCarousel } from 'src/components/carousel/SongsCarousel';
import { AlbumCarousel } from 'src/components/carousel/AlbumCarousel';
import { CollaborationsCarousel } from 'src/components/carousel/CollabsCarousel';
import ModalContainer from 'src/components/modals/ModalContainer';

export const queryArtistOptions = (artistId: string) => queryOptions({
  queryKey: ["artist-page", artistId],
  queryFn: () => FetchArtists.getArtistDetails(artistId),
  staleTime: 1000 * 60 * 5, //five minutes
})

export const Route = createFileRoute('/artists/$artistId/$artistName')({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params }) => {
    return queryClient.ensureQueryData(queryArtistOptions(params.artistId))

  },
  staleTime: 1000 * 60 * 5, //five minutes
})


function RouteComponent() {
  //context

  const playlistActions = usePlaylistActions();
  const playlistControls = usePlaylistControls();
  const playlistProps = usePlaylistProps();
  const playlistPlayModes = usePlaylistPlayMode();
  const audioState = useAudioState();
  const audioControls = useAudioControls();

  //route
  const { artistName, artistId } = Route.useParams();
  const { data } = useQuery(queryArtistOptions(artistId));
  const artist = data as ArtistDetailDTO;
  const router = useRouter()
  const canGoBack = useCanGoBack();

  //component state
  const [isActive, setIsActive] = useState(playlistProps.type === "artist" && playlistProps.id === artist.artistId);


  //refs
  const targetEl = useRef<HTMLElement | null>(null);

  const playArtist = useCallback(async () => {
    try {
      console.log(artist.artistId)
      //replace with a stale fetch
      let req = await fetch(`http://localhost:3000/api/music/artist/${artist.artistId}/songs`);
      if (!req.ok) throw new Error(`Error fetching artist songs: ${artist.artistId}`)
      let json = await req.json() as SongDTO[];
      playlistActions.update(json, artist.artistId, "artist");
      setIsActive(true)
    } catch (err) {
      console.error(err);
    }
  }, []);

  const shuffleArtist = useCallback(async () => {
    try {
      if (!isActive) {
        //replace with a stale fetch
        let req = await fetch(`http://localhost:3000/api/music/artist/${artist.artistId}/songs`);
        if (!req.ok) throw new Error(`Error fetching artist songs: ${artist.artistId}`)
        let json = await req.json() as SongDTO[];
        playlistActions.update(json, artist.artistId, "artist", true);
        return;
      }
      else
        playlistControls.toggleShuffle();

    } catch (err) {
      console.error(err);
    }
  }, [isActive])


  useEffect(() => { console.log(`%c rendering: Artist Page`, 'background: #1a1a1a; color: #bada55;') })

  return (
    <>
      <ArtistCoverMemo src={`${BASE_URL}/${artist.photo.x1200}`}></ArtistCoverMemo>

      <div id='sticky-controls' className='w-full h-[84px] sticky top-0 z-2 flex justify-between items-center gap-8 px-8 md:px-10 bg-(--active-bg)  border-b  border-(--active-border) backdrop-blur-(--active-blur)'>
        {
          canGoBack &&
          <div id='go-back'>
            <button onClick={() => router.history.back()} className='w-[34px] h-[34px] rounded-full cursor-pointer relative group'>
              <div className='w-full h-full flex justify-center items-center '>
                <i className=''>
                  <ArrowLeftIcon className='w-[16px] aspect-square stroke-3'></ArrowLeftIcon>
                </i>
              </div>
              <div className=' absolute top-0 left-0 z-1 w-full h-full rounded-full scale-[0.85] group-hover:scale-100 group-hover:bg-white/25 transition-[colors_transform] duration-100 ease-out'></div>
            </button>
          </div>
        }
        <div id='artist-info' className='grow md:grow-0 md:w-[480px] opacity-(--active-opacity) transition-opacity ease-out duration-200 flex justify-between items-center gap-8'>
          <div id='artist-photo' className='flex items-center gap-4 '>
            <picture>
              <img src={`${BASE_URL}/${artist.photo.x256}`} alt="" className='rounded-4xl w-[48px] md:w-[60px] h-auto' />
            </picture>
            <div>
              <h3 className='font-medium text-md'>{artist.artistName}</h3>
            </div>
          </div>
          <div id='artist-controls' className='flex gap-6 text-sm font-medium'>
            {
              !isActive ?
                <button onClick={playArtist} className='flex flex-col items-center justify-center group w-[40px] h-[40px] aspect-square cursor-pointer'>
                  <i className=''>
                    <svg className='group-hover:opacity-75 transition-opacity duration-200' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" /></svg>
                  </i>
                  <span className=''>Play</span>
                </button>
                : audioState.isPlaying ?
                  <button onClick={() => audioControls.pause()} className='flex flex-col items-center justify-center group w-[40px] h-[40px] aspect-square cursor-pointer'>
                    <i className='group-hover:opacity-75 transition-opacity duration-200'>
                      <PauseIcon className='fill-white stroke-0'></PauseIcon>
                    </i>
                    <span className=''>Pause</span>
                  </button>
                  :
                  <button onClick={() => audioControls.play()} className='flex flex-col items-center justify-center group w-[40px] h-[40px] aspect-square cursor-pointer'>
                    <i className=''>
                      <svg className='group-hover:opacity-75 transition-opacity duration-200' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" /></svg>
                    </i>
                    <span className=''>Play</span>
                  </button>
            }

            <button className='flex flex-col items-center justify-center group w-[40px] h-[40px] aspect-square cursor-pointer'>
              <i className=''>
                <svg className='group-hover:opacity-75 transition-opacity duration-200' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 4l3 3l-3 3" /><path d="M18 20l3 -3l-3 -3" /><path d="M3 7h3a5 5 0 0 1 5 5a5 5 0 0 0 5 5h5" /><path d="M3 17h3a5 5 0 0 0 5 -5a5 5 0 0 1 5 -5h5" /></svg>
              </i>
              <span>Shuffle</span>
            </button>
          </div>
        </div>
      </div>

      <div id='artist-details' className='w-full h-auto px-4 md:px-8 py-8 relative z-1 '>

        <section ref={targetEl} id='artist-cover' className=" w-full h-[calc(100vh-(90px+84px))] flex flex-col">
          <div className='w-full grow flex flex-col justify-end'>
            <header className=''>
              <h1 className="text-4xl md:text-6xl font-bold uppercase font-oswald my-4 whitespace-break-spaces">{artist.artistName}</h1>
              <p className='font-semibold'><span>Albums: {artist.albumsCount}</span> </p>
              <p><span className='font-semibold'>Songs: {artist.songsCount}</span> </p>
            </header>

            <div id='artist-controls' className='flex gap-4 mt-4 font-bold'>
              {
                !isActive ?
                  <button onClick={playArtist} className='w-[148px] flex justify-center items-center gap-2 p-2.5 rounded-full bg-white text-black hover:bg-white/60 cursor-pointer transition-colors ease-in-out duration-200'>
                    <i><PlayIcon className='fill-black'></PlayIcon></i>
                    <span>Play</span>
                  </button>
                  :
                  audioState.isPlaying ?
                    <button onClick={() => audioControls.pause()} className='w-[148px] flex justify-center items-center gap-2 p-2.5 rounded-full bg-white text-black hover:bg-white/60 cursor-pointer transition-colors ease-in-out duration-200'>
                      <i><PauseIcon className='fill-black'></PauseIcon></i>
                      <span>Pause</span>
                    </button>
                    :
                    <button onClick={() => audioControls.play()} className='w-[148px] flex justify-center items-center gap-2 p-2.5 rounded-full bg-white text-black hover:bg-white/60 cursor-pointer transition-colors ease-in-out duration-200'>
                      <i><PlayIcon className='fill-black'></PlayIcon></i>
                      <span>Play</span>
                    </button>
              }
              <button onClick={shuffleArtist} className={`${(isActive && playlistPlayModes.isShuffle) ? "opacity-100" : "opacity-50"}  w-[148px] flex justify-center items-center gap-2 p-2.5 bg-white/15 rounded-full border border-white/15 cursor-pointer transition-colors ease-in-out duration-200`}>
                <i>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 4l3 3l-3 3" /><path d="M18 20l3 -3l-3 -3" /><path d="M3 7h3a5 5 0 0 1 5 5a5 5 0 0 0 5 5h5" /><path d="M3 17h3a5 5 0 0 0 5 -5a5 5 0 0 1 5 -5h5" /></svg>
                </i>
                <span className='text-white'>Shuffle</span>
              </button>

            </div>
            {
              artist.bio &&

              <article className='my-2 py-4 w-full md:w-[70%] h-auto'>
                <p className='text-[15px] text-lg'>
                  {`${artist.bio.replaceAll(/(<\w+>|<\/\w+>)/g, "").split(" ").splice(0, 55).join(" ")}... `}
                  <BiographyModal bio={artist.bio} name={artist.artistName} photo={artist.photo}></BiographyModal>
                </p>
              </article>

            }
          </div>
        </section>

        {
          artist.recentPlayed.length > 0 &&
          <section id="recent-played" className='my-10'>
            <SongsCarousel songs={artist.recentPlayed.slice(0, 10)}></SongsCarousel>
          </section>
        }
        {
          artist.mostPlayed.length > 0 &&
          <section id="artist-most-played" className='my-10'>
            <RankedPlaylist songs={artist.mostPlayed} title='Most Played' album={true}></RankedPlaylist>
          </section>
        }
        {
          artist.albums.length > 0 &&
          <section id='artist-albums' className='mt-10'>
            <div>
              <AlbumCarousel albums={artist.albums}></AlbumCarousel>
            </div>
          </section>
        }
        {
          artist.collaborations.length > 0 &&
          <section id='artist-collaborations' className='mt-10'>
            <CollaborationsCarousel albums={artist.collaborations} artistName={artist.artistName} artistId={artist.artistId}></CollaborationsCarousel>
          </section>
        }
      </div>

    </>
  )
}


function BiographyModal({ bio, name, photo }: { bio: string, name: string, photo: PhotoDTO }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  return (<>
    <button className='hover:underline cursor-pointer font-bold' onClick={openModal}>Read More</button>
    {
      isModalOpen &&
      <ModalContainer isOpen={isModalOpen} onClose={closeModal}>
        <>
          <div className='px-2 w-full h-auto flex justify-start items-center gap-4'>
            <div>
              <picture className=''>
                <img src={`${BASE_URL}/${photo.x128}`} alt="" className='rounded-full max-w-[128px] h-auto aspect-square' />
              </picture>
            </div>
            <div>
              <h1 className='font-oswald font-semibold text-2xl '>{name}</h1>
            </div>
          </div>
          <div className='my-4 px-4 grow overflow-y-scroll scrollbar-xs'>
            <div className='text-justify leading-[1.75]'>
              {parse(bio)}
            </div>
          </div>
        </>
      </ModalContainer>
    }
  </>
  )
}




