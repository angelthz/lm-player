import { createFileRoute, Link } from '@tanstack/react-router'
import { AlbumDTO, } from '../../types/types'
import { ArrowLeftIcon, PauseIcon, PlayIcon } from 'lucide-react'
import { useRouter, useCanGoBack } from '@tanstack/react-router'
import AlbumPlayList from 'src/components/playlist/AlbumPlayList'
import { useCallback, useEffect, useRef, useState } from 'react'
import { logger } from 'src/utils/Logger'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { FetchAlbums } from 'src/api/music/albums/FetchAlbums'
import { usePlaylistActions, usePlaylistControls, usePlaylistPlayMode, usePlaylistProps } from 'src/player-context/PlaylistContext'
import { useAudioControls, useAudioState } from 'src/player-context/AudioContext'
import { AlbumCoverMemo } from 'src/components/covers/AlbumCover'
import { BASE_URL } from 'src/env/HostURL'
import { TextUtils } from 'src/utils/FormatText'



export const queryAlbumOptions = (albumId: string) => queryOptions({
  queryKey: ["album", albumId],
  queryFn: async () => FetchAlbums.getAlbumById(albumId),
  staleTime: 1000 * 60 * 5, //five minutes
})

export const Route = createFileRoute('/albums/$albumId/$albumName')({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    return context.queryClient.ensureQueryData(queryAlbumOptions(params.albumId));
  },
  staleTime: 1000 * 60 * 5, //five minutes
})

function RouteComponent() {
  //route
  const { albumName, albumId } = Route.useParams();
  const { data: album } = useSuspenseQuery(queryAlbumOptions(albumId));
  const router = useRouter();
  const canGoBack = useCanGoBack();

  //context
  const playlistActions = usePlaylistActions();
  const playlistControls = usePlaylistControls();
  const playlistProps = usePlaylistProps();
  const playlistPlayModes = usePlaylistPlayMode();
  const audioState = useAudioState();
  const audioControls = useAudioControls();

  //component state
  const [isActive, setIsActive] = useState(playlistProps.type === 'album' && playlistProps.id === album.albumId);

  //refs
  const elementRef = useRef<HTMLElement | null>(null);


  //handlers
  const playAlbum = () => {

    if (!isActive) {
      playlistActions.update(album.songs, album.albumId, 'album', false, 0);
      setIsActive(true);
    }
    else
      audioControls.play();

  }

  const pauseAlbum = () => {
    audioControls.pause();
  }

  const shuffleAlbum = () => {
    if (!isActive) {
      playlistActions.update(album.songs, album.albumId, 'album', true);
      setIsActive(true);
    }
    else
      playlistControls.toggleShuffle();
  }

  const playSelected = useCallback((idx: number) => {
    // logger.log("playselected isActive ", isActive)
    if (!isActive) {
      logger.log("skip to set songs")
      playlistActions.update(album.songs, album.albumId, 'album', false, idx);
      setIsActive(true);
    }
    else {
      logger.log("skip to idx")
      playlistControls.skipToId(idx);
    }
  }, [isActive])

  // useEffect(() => { logger.log(`%c-> Album Page `, `background:#0a0a0a; color:#FF5B03; font-weight:bold;`) })
  useEffect(() => { logger.log(`%c-> Album Page audioState: ${audioState.isPlaying}`, `background:#0a0a0a; color:#FF5B03; font-weight:bold;`) }, [audioState])
  useEffect(() => { logger.log(`%c-> Album Page isActive: ${isActive}`, `background:#0a0a0a; color:#FF5B03; font-weight:bold;`) }, [isActive])
  useEffect(() => { logger.log(`%c-> Album Page: playlistProps`, `background:#0a0a0a; color:#FF5B03; font-weight:bold;`) }, [playlistProps])


  return (
    <>
      <AlbumCoverMemo src={`${BASE_URL}/${album?.cover.x1200}`} elementToObserve={elementRef}></AlbumCoverMemo>
      <div id='album-top-bar-controls' className='w-full h-[84px] sticky top-0 z-2 flex md:justify-between items-center gap-4 md:gap-8 px-2 md:px-10 bg-(--active-bg) border-b border-(--active-border) backdrop-blur-(--active-blur)'>
        {
          canGoBack &&
          <div id='go-back' className="">
            <button onClick={() => router.history.back()} className='w-[34px] h-[34px]  aspect-square rounded-full cursor-pointer relative group'>
              <div className='w-full h-full flex justify-center items-center '>
                <i className=''>
                  <ArrowLeftIcon className='w-[16px] aspect-square stroke-3'></ArrowLeftIcon>
                </i>
              </div>
              <div className=' absolute top-0 left-0 z-1 w-full h-full rounded-full scale-[0.85] group-hover:scale-100 group-hover:bg-white/25 transition-[colors_transform] duration-100 ease-out'></div>
            </button>
          </div>
        }
        <div id='artist-info' className='grow md:grow-0 md:w-[480px] opacity-(--active-opacity) transition-opacity ease-out duration-500 flex justify-between items-center '>
          <div id='artist-photo' className='flex items-center gap-4'>
            <img src={`${BASE_URL}/${album?.cover.x128}`} alt="" className='rounded-4xl w-[64px] h-auto' />
            <div>
              <p className='font-medium text-xs md:text-md'><span>{album?.artistName}</span></p>
              <p className='font-medium text-sm md:text-md'><span>{album?.albumName}</span></p>
            </div>
          </div>
          <div id='artist-controls' className='flex gap-6 text-sm font-medium'>
            {
              // (isActive && audioState.isPlaying) ?
              false ?
                <button onClick={pauseAlbum} className='flex flex-col items-center justify-center group w-[40px] h-[40px] aspect-square cursor-pointer'>
                  <i className=''>
                    <svg className='group-hover:opacity-75 transition-opacity duration-200' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z" /><path d="M17 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z" /></svg>
                  </i>
                  <span className=''>Pause</span>
                </button>
                :
                <button onClick={playAlbum} className='flex flex-col items-center justify-center group w-[40px] h-[40px] aspect-square cursor-pointer'>
                  <i className=''>
                    <svg className='group-hover:opacity-75 transition-opacity duration-200' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" /></svg>
                  </i>
                  <span className=''>Play</span>
                </button>
            }
            <button onClick={shuffleAlbum} className={`
            ${playlistPlayModes.isShuffle ? "bg-white/30" : ""}
            flex flex-col items-center justify-center group w-[40px] h-[40px] aspect-square cursor-pointer`}>
              <i className={` ${playlistPlayModes.isShuffle ? "opacity-100" : "opacity-50"}`}>
                {/* <svg className='group-hover:opacity-75 transition-opacity duration-200' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 4l3 3l-3 3" /><path d="M18 20l3 -3l-3 -3" /><path d="M3 7h3a5 5 0 0 1 5 5a5 5 0 0 0 5 5h5" /><path d="M3 17h3a5 5 0 0 0 5 -5a5 5 0 0 1 5 -5h5" /></svg> */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 4l3 3l-3 3" /><path d="M18 20l3 -3l-3 -3" /><path d="M3 7h3a5 5 0 0 1 5 5a5 5 0 0 0 5 5h5" /><path d="M3 17h3a5 5 0 0 0 5 -5a5 5 0 0 1 5 -5h5" /></svg>
              </i>
              <span>Shuffle</span>
            </button>
          </div>
        </div>
      </div>

      <div id='album-details' className='w-full h-auto px-4 md:px-8 py-8 relative z-1 '>
        <section className="w-full h-auto md:h-[calc(85vh-(90px+84px))] flex flex-col justify-end ">
          <div className="w-full h-auto mb-10 md:h-[90%] flex flex-col gap-6 md:flex-row items-center">
            <div id="album-cover" className="w-auto md:w-[50%] h-auto flex justify-center items-center ">
              <img className="w-[256px] md:w-[320px] 2xl:w-[400px] h-auto rounded-lg shadow-2xl shadow-black" src={`${BASE_URL}/${album?.cover.x512}`} alt="" />
            </div>
            <div id="album-info" className="grow flex flex-col justify-center gap-10">
              <div className="flex flex-col justify-center gap-4 text-center md:text-left">
                <h1 className="font-oswald font-bold text-3xl text-center md:text-left md:text-5xl ">{album?.albumName}</h1>
                <Link

                  to="/artists/$artistId/$artistName" params={{ artistId: album?.artistId, artistName: TextUtils.toKebabCase(album?.artistName || "") }}
                  className="font-oswald font-medium text-xl text-center md:text-left decoration-2 hover:underline cursor-pointer">
                  {album?.artistName}
                </Link>
                <p className="font-oswald font-medium text-lg text-center md:text-left">{album?.releaseYear}</p>
                <p className="font-oswald font-medium text-md text-center md:text-left">{album?.songsCount} Songs <span className="text-[#ccc]/90">●</span> {album?.duration.minutes.toFixed(2).replace(".", ":")} mins.</p>
              </div>

              <div className="w-full md:w-fit flex justify-evenly gap-4">
                {
                  isActive && audioState.isPlaying ?

                    <button onClick={pauseAlbum} className='w-[160px] md:w-[148px] flex justify-center items-center gap-2 p-2.5 rounded-4xl bg-white text-black hover:bg-white/60 cursor-pointer transition-colors ease-in-out duration-200'>
                      <i><PauseIcon className='fill-black'></PauseIcon></i>
                      <span>Pause</span>
                    </button>
                    :
                    <button onClick={playAlbum} className='w-[160px] md:w-[148px] flex justify-center items-center gap-2 p-2.5 rounded-4xl bg-white text-black hover:bg-white/60 cursor-pointer transition-colors ease-in-out duration-200'>
                      <i><PlayIcon className='fill-black'></PlayIcon></i>
                      <span>Play</span>
                    </button>
                }
                <button onClick={shuffleAlbum} className={`${playlistPlayModes.isShuffle ? "opacity-100 bg-white/25" : "opacity-50 bg-white/10"} w-[160px] md:w-[148px] flex justify-center items-center gap-2 p-2.5 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer transition-colors ease-in-out duration-200`}>
                  <i >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 4l3 3l-3 3" /><path d="M18 20l3 -3l-3 -3" /><path d="M3 7h3a5 5 0 0 1 5 5a5 5 0 0 0 5 5h5" /><path d="M3 17h3a5 5 0 0 0 5 -5a5 5 0 0 1 5 -5h5" /></svg>
                  </i>
                  <span>Shuffle</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="albums-songs" className='w-full h-auto '>
          <AlbumPlayList
            album={album}
            isActive={isActive}
            isPlaying={isActive && audioState.isPlaying}
            playSelected={playSelected}
          ></AlbumPlayList>
        </section>
      </div>

    </>
  )
}

