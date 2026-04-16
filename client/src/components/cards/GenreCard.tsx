import { Link } from "@tanstack/react-router";
import { PauseIcon, PlayIcon } from "lucide-react";
import { BASE_URL } from "src/env/HostURL";
import { GenresDTO } from "src/types/types"
import { FormatText, TextUtils } from "src/utils/FormatText";

interface Props {
    genre: GenresDTO;
    isActive: boolean;
}


function r() {
    return Math.floor(Math.random() * 256);
}

function rColor() {
    return "rgb(" + r() + "," + r() + "," + r() + ")";
}

export default function GenreCard({ genre, isActive }: Props) {
    const color = rColor();

    console.log(genre.id, genre.name)

    return (
        <div className={`
            ${isActive ? "bg-white/25 rounded-md" : ""}
            w-full h-full mx-auto flex flex-col gap-1 justify-center items-center p-2.5
            relative 
            after:absolute after:top-0 after:left-0 after:z-0 after:w-full after:h-full
            after:scale-80 hover:after:scale-100 after:transition-transform after:ease-out after:duration-300
            hover:after:bg-white/10
            after:rounded-md
            group
        `}>
            <Link
                to="/genres/$genreId/$genreName"
                params={{
                    genreId: genre.id,
                    genreName: FormatText.formatFileName(genre.name).toLocaleLowerCase(),
                }}
                className="
               
                    album-cover
                    relative z-1
                    cursor-pointer
                    overflow-hidden
                    rounded-md
                    before:absolute before:top-0 before:left-0 before:z-0
                    before:w-full before:h-full
                    before:bg-linear-to-t xs:before:bg-none
                    group-hover:before:bg-linear-to-t
                    before:from-[rgba(0,0,0,0.75)] before:from-25% 
                "
            >
                {/* <div className="w-full h-auto" style={{ backgroundColor: color, opacity: 75 }}>
                    <div className="max-w-[200px] max-h-[200px] w-[150px] h-[150px]"></div>
                </div> */}

                <img src={`${BASE_URL}/thumbnails/artist/aurora/the-conflict-of-the-mind/cover-256.jpg`} alt="" className="w-full h-auto" />

                <div

                    className={`
                    ${isActive ? "translate-y-0" : "translate-y-0 xs:translate-y-[150%]"}

                    absolute bottom-3 right-3
                    group-hover:translate-y-0
                    transition-transform duration-200 ease-in-out
                    
                    `}>

                    {
                        !false ?
                            <button title="Play" className="relative w-[48px] h-[48px] flex justify-center items-center rounded-full bg-white/10 backdrop-blur-xs cursor-pointer group/pause shadow-md shadow-black/15">
                                <div className="absolute top-0 left-0 w-full h-full group-hover/pause:bg-white/25 rounded-full scale-[0.85] group-hover/pause:scale-[1] transition-all duration-150 ease-out z-0"></div>
                                <i className="relative z-1">
                                    <PlayIcon className="w-[24px] h-[24px] fill-white stroke-0"></PlayIcon>
                                </i>
                            </button>
                            : false ?
                                <button title="Pause" className="relative w-[48px] h-[48px] flex justify-center items-center rounded-full bg-white/10 backdrop-blur-xs cursor-pointer group/pause">
                                    <div className="absolute top-0 left-0 w-full h-full group-hover/pause:bg-white/25 rounded-full scale-[0.85] group-hover/pause:scale-[1] transition-all duration-150 ease-out z-0"></div>
                                    <i className="relative z-1">
                                        <PauseIcon className="w-[24px] h-[24px] fill-white stroke-0"></PauseIcon>
                                    </i>
                                </button>
                                :
                                <button title="Play" className="relative w-[48px] h-[48px] flex justify-center items-center rounded-full bg-white/10 backdrop-blur-xs cursor-pointer group/pause">
                                    <div className="absolute top-0 left-0 w-full h-full group-hover/pause:bg-white/25 rounded-full scale-[0.85] group-hover/pause:scale-[1] transition-all duration-150 ease-out z-0"></div>
                                    <i className="relative z-1">
                                        <PlayIcon className="w-[24px] h-[24px] fill-white stroke-0"></PlayIcon>
                                    </i>
                                </button>
                    }
                </div>
            </Link>
            <div className="album-info w-full h-auto flex items-start flex-col gap-0.5 relative z-1">
                <Link
                    to="/genres/$genreId/$genreName"
                    params={{
                        genreId: genre.id,
                        genreName: FormatText.formatFileName(genre.name).toLocaleLowerCase(),
                    }}
                    className="w-full text-md font-medium decoration-2 hover:underline overflow-hidden whitespace-nowrap text-ellipsis">
                    {genre.name}
                </Link>
            </div>
        </div>
    )


    return (
        <div className="card-container">
            <Link to="/genres/$genreId/$genreName"
                params={{
                    genreId: genre.id,
                    genreName: FormatText.formatFileName(genre.name).toLocaleLowerCase(),
                }}
                className="card-cover relative block mb-3 group" >
                <div className={`max-w-[256px] aspect-square flex justify-center items-center rounded-md `} style={{ backgroundColor: color, opacity: 75 }}>
                    <span className="capitalize text-6xl font-bold">{genre.name.charAt(0)}</span>
                </div>
                <div className="
                    flex absolute left-0 top-0 w-full h-full justify-end items-end cursor-pointer
                    invisible 
                    group-hover:visible 
                    group-hover:bg-stone-950/50
                    transition-colors duration-300 ease-in-out
                    ">
                    <button className="play bg-stone-950/90 w-10 h-10 rounded-full flex justify-center items-center m-2 cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out">
                        <PlayIcon className="fill-white stroke-0" />
                    </button>
                </div>
            </Link>
            <div className="card-info font-semibold mt-3 overflow-hidden whitespace-nowrap text-ellipsis">
                {/* <a className="whitespace-normal leading-6 text-md decoration-0 hover:underline cursor-pointer">{props.genre.name}</a> */}
                <Link
                    to="/genres/$genreId/$genreName"
                    params={{
                        genreId: genre.id,
                        genreName: FormatText.formatFileName(genre.name).toLocaleLowerCase(),
                    }}
                    className=" leading-6 text-[1rem] decoration-0 hover:underline cursor-pointer ">
                    {genre.name}
                </Link>
            </div>
        </div>
    )
}