import { Link } from "@tanstack/react-router";
import { ClockIcon, HeartIcon, MoreHorizontalIcon, PauseIcon, PlayIcon, } from "lucide-react";
import { AlbumDTO, SongDTO } from "src/types/types";
import { memo, useEffect, useState } from "react";
import { useAudioControls } from "src/player-context/AudioContext";
import { TextUtils } from "src/utils/FormatText";
import { usePlaylistCurrent } from "src/player-context/PlaylistContext";



interface AlbumPlaylistProps {
  album: AlbumDTO;
  isActive: boolean;
  isPlaying: boolean;
  playSelected: (idx: number) => void;
}

interface RowProps {
  song: SongDTO;
  idx: number;
  isCurrent: boolean;
  isPlaying: boolean;
  artistName: string;
  artistId: number;
  isActive: boolean;
  playSelected: (idx: number) => void;
}

function Row({ song, idx, isCurrent, isPlaying, artistName, artistId, playSelected, isActive }: RowProps) {
  useEffect(() => { console.log(`%c---> Rendering Playlist Row: ${idx}`, `background:#0a0a0a; color:#03E2FF; font-weight:bold; padding:0 4px;`) })

  const audioActions = useAudioControls();

  return (
    <div
      className={`${isCurrent && "bg-white/5"} grid grid-cols-[48px_repeat(8,1fr)_repeat(3,48px)] grid-rows-[repeat(2,24px)]  rounded-md my-2 text-sm font-semibold hover:backdrop-blur-xl  hover:bg-white/15  transition-colors duration-300 ease-in-out`}>
      <div id="song-num" className="row-span-2 flex items-center cursor-pointer p-1 ">

        {
          (isCurrent && isPlaying) &&
          <button onClick={audioActions.pause} className="block relative group cursor-pointer w-[46px] aspect-square rounded-sm">
            <i className="group-hover:opacity-0 absolute top-0 left-0 bottom-0 right-0 flex justify-center items-center transition-opacity duration-300 ease-in-out rounded-sm ">
              <PauseIcon className="fill-white stroke-0" />
              {/* <svg className="w-[14px] h-auto fill-white" viewBox="0 0 55 80" xmlns="http://www.w3.org/2000/svg" fill="hsl(228, 97%, 42%)"><g transform="matrix(1 0 0 -1 0 80)"><rect width="10" height="20" rx="3"><animate attributeName="height" begin="0s" dur="4.3s" values="20;45;57;80;64;32;66;45;64;23;66;13;64;56;34;34;2;23;76;79;20" calcMode="linear" repeatCount="indefinite" /></rect><rect x="15" width="10" height="80" rx="3"><animate attributeName="height" begin="0s" dur="2s" values="80;55;33;5;75;23;73;33;12;14;60;80" calcMode="linear" repeatCount="indefinite" /></rect><rect x="30" width="10" height="50" rx="3"><animate attributeName="height" begin="0s" dur="1.4s" values="50;34;78;23;56;23;34;76;80;54;21;50" calcMode="linear" repeatCount="indefinite" /></rect><rect x="45" width="10" height="30" rx="3"><animate attributeName="height" begin="0s" dur="2s" values="30;45;13;80;56;72;45;76;34;23;67;30" calcMode="linear" repeatCount="indefinite" /></rect></g></svg> */}
            </i>
            <i className="group-hover:opacity-100 opacity-0 absolute top-0 left-0 bottom-0 right-0 flex justify-center items-center transition-opacity duration-300 ease-in-out rounded-sm ">
              <PauseIcon className="w-[22px] h-auto fill-white stroke-0"></PauseIcon>
            </i>
          </button>

        }
        {
          isCurrent && !isPlaying &&
          <button onClick={audioActions.play} className="block relative group cursor-pointer w-[46px] aspect-square rounded-sm">
            <i className="absolute top-0 left-0 bottom-0 right-0 flex justify-center items-center transition-opacity duration-300 ease-in-out rounded-sm ">
              <PlayIcon className="fill-white stroke-0" />
            </i>
          </button>
        }
        {!isCurrent &&
          <button onClick={() => playSelected(song.songId)} className="block relative group cursor-pointer w-[46px] aspect-square rounded-sm">
            <span className="group-hover:opacity-0 absolute top-0 left-0 bottom-0 right-0 flex justify-center items-center ">
              {song.trackNum}
            </span>
            <i className="group-hover:opacity-100 opacity-0 absolute top-0 left-0 bottom-0 right-0 flex justify-center items-center transition-opacity duration-300 ease-in-out rounded-sm ">
              <PlayIcon className="fill-white stroke-0" />
            </i>
          </button>
        }
      </div>
      <div id="song-title" title={song.songTitle} className="col-span-10 md:col-span-4 row-span-1 md:row-span-2  flex items-center pl-4">
        <p className="block overflow-hidden whitespace-pre text-ellipsis cursor-pointer">
          {song.songTitle}
        </p>
      </div>
      <div id="artist-collaborators" className="col-span-10 md:col-span-4  row-span-1 md:row-span-2 col-start-2 md:columns-3 row-start-2   flex gap-6 items-center px-4">
        <Link
          to="/artists/$artistId/$artistName"
          params={{
            artistName: TextUtils.toKebabCase(artistName),
            artistId: artistId,
          }}
          className="overflow-hidden whitespace-pre text-ellipsis cursor-pointer hover:underline hover:decoration-2 transition-all ease-in-out duration-300"
        >
          {artistName}
        </Link>
        {
          song.collaborators && song.collaborators.length > 1 &&
          <button className="w-[32px] aspect-square flex justify-center items-center rounded-full cursor-pointer hover:bg-white/30 transition-colors ease-in-out duration-300">

          </button>
        }

        {
          (song.collaborators && song.collaborators.length === 1) &&
          song.collaborators.map((col) => (
            <Link
              to="/artists/$artistName/$artistId"
              params={{ artistName: TextUtils.toKebabCase(col.name), artistId: col.id, }}
              className="overflow-hidden whitespace-pre text-ellipsis cursor-pointer hover:underline hover:decoration-2 transition-all ease-in-out duration-300"
            >
              {col.name}
            </Link>
          ))
        }
      </div>
      <div className=" col-span-1 row-span-2 flex justify-center items-center ">
        <button className="cursor-pointer">
          <i>
            <HeartIcon className="w-[20px] aspect-square hover:fill-alabaster-50 stroke-2 transition-colors ease-in-out duration-300"></HeartIcon>
          </i>
        </button>
      </div>
      <div className="col-span-1 row-span-2 justify-center items-center hidden md:flex">
        <span className="">
          {song.duration?.minutes.toFixed(2).replace(".", ":")}
        </span>
      </div>
      <div className="col-span-1 row-span-2 justify-center items-center hidden md:flex">
        <span className="">
          <i>
            <MoreHorizontalIcon></MoreHorizontalIcon>
          </i>
        </span>
      </div>
    </div>
  );
}

const RowMemo = memo(Row, (prev: RowProps, next: RowProps) => {
  return prev.isCurrent === next.isCurrent && prev.isPlaying === next.isPlaying && prev.isActive === next.isActive;
});

export default function AlbumPlayList({ album, isActive, isPlaying, playSelected }: AlbumPlaylistProps) {

  const current = usePlaylistCurrent();


  useEffect(() => { console.log(`%c--> Rendering Album Playlist`, `background:#0a0a0a; color:#C0FF03; font-weight:bold; padding:0 4px;`) })

  return (
    <div className="w-full h-auto relative flex flex-col">

      <header className="opacity-75">
        <div className="border-b border-white/15">
          <div className="hidden md:grid grid-cols-[48px_repeat(8,1fr)_repeat(3,48px)] py-2 items-center text-sm text-white ">
            <div className="text-center">#</div>
            <div className="col-span-5 px-4">Title</div>
            <div className="col-span-5 md:col-span-3 px-4 ">Artist</div>
            <div className="col-start-11 col-span-1">
              <ClockIcon className="w-4 h-4 mx-auto" />
            </div>
          </div>
        </div>
      </header>
      <div className="">
        <div className="">
          {
            album.songs.map((song, idx) =>
              <RowMemo
                song={song}
                artistName={album.artistName}
                artistId={album.artistId}
                isCurrent={isActive && current.song?.songId === song.songId}
                isPlaying={(isActive && current.song?.songId === song.songId) && isPlaying}
                idx={idx}
                key={song.songId}
                playSelected={playSelected}
                isActive={isActive}
              ></RowMemo>
            )}
        </div>
      </div>
    </div>
  );
}

export const AlbumPlayListMemo = memo(AlbumPlayList);
