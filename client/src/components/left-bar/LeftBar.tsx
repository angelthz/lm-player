import { ChevronLeftIcon, CircleUserIcon, Disc2Icon, HandMetalIcon, HeartIcon, HomeIcon, LibraryIcon, ListMusicIcon, MenuIcon, MusicIcon, SearchIcon, User2Icon } from "lucide-react";
import NavigationLink from "./NavigationLink";
import { useState } from "react";
import { useAudioState } from "src/player-context/AudioContext";



interface Props {
    leftMenuIsOpen: boolean;
    leftMenuHandler: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LeftBar() {
    const [isOpened, setIsOpened] = useState(true);
    const { isPlaying } = useAudioState();



    return (
        <div id='navigation-bar' className={`${isOpened ? "xl:w-[240px]" : "xl:w-[72px]"} w-[72px]  h-auto relative flex-[0_0_auto] hidden sm:block border-r border-(--active-border) `}>

            <div id="left-container" className='w-full h-screen sticky top-0 z-2 pb-[90px]'>
                <header className="w-full h-full  flex flex-col ">
                    <div id='title' className={`w-full h-[84px] relative flex justify-center items-center `}>
                        <button className='hidden xl:block absolute top-0 left-0 w-fit h-full cursor-pointer group' onClick={() => setIsOpened(prev => !prev)}>
                            <i className=''>
                                <ChevronLeftIcon className={`${!isOpened && "rotate-180"} stroke-3 stroke-[#ccc] group-hover:stroke-white w-[22px] h-[22px] transition-all duration-300`}></ChevronLeftIcon>
                            </i>
                        </button>
                        <h3 className={`${isOpened ? "xl:w-[90%] xl:px-2" : "xl:w-[40px] xl:justify-center"}  flex gap-2 group`}>
                            <i className={`flex justify-center items-center`}>
                                {
                                    <>
                                        <svg className={`fill-white w-[28px] h-[28px] ${isPlaying ? "" : "hidden"}`} fill="hsl(228, 97%, 42%)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="1" y="6" width="2.8" height="12">
                                                <animate begin="spinner_Diec.begin+0.4s" attributeName="y" calcMode="spline" dur="0.4s" values="6;1;6" keySplines=".14,.73,.34,1;.65,.26,.82,.45" />
                                                <animate begin="spinner_Diec.begin+0.4s" attributeName="height" calcMode="spline" dur="0.4s" values="12;22;12" keySplines=".14,.73,.34,1;.65,.26,.82,.45" />
                                            </rect><rect x="5.8" y="6" width="2.8" height="12">
                                                <animate begin="spinner_Diec.begin+0.2s" attributeName="y" calcMode="spline" dur="0.4s" values="6;1;6" keySplines=".14,.73,.34,1;.65,.26,.82,.45" />
                                                <animate begin="spinner_Diec.begin+0.2s" attributeName="height" calcMode="spline" dur="0.4s" values="12;22;12" keySplines=".14,.73,.34,1;.65,.26,.82,.45" />
                                            </rect><rect x="10.6" y="6" width="2.8" height="12">
                                                <animate id="spinner_Diec" begin="0;spinner_dm8s.end-0.1s" attributeName="y" calcMode="spline" dur="0.4s" values="6;1;6" keySplines=".14,.73,.34,1;.65,.26,.82,.45" />
                                                <animate begin="0;spinner_dm8s.end-0.1s" attributeName="height" calcMode="spline" dur="0.4s" values="12;22;12" keySplines=".14,.73,.34,1;.65,.26,.82,.45" />
                                            </rect><rect x="15.4" y="6" width="2.8" height="12">
                                                <animate begin="spinner_Diec.begin+0.2s" attributeName="y" calcMode="spline" dur="0.4s" values="6;1;6" keySplines=".14,.73,.34,1;.65,.26,.82,.45" />
                                                <animate begin="spinner_Diec.begin+0.2s" attributeName="height" calcMode="spline" dur="0.4s" values="12;22;12" keySplines=".14,.73,.34,1;.65,.26,.82,.45" />
                                            </rect><rect x="20.2" y="6" width="2.8" height="12">
                                                <animate id="spinner_dm8s" begin="spinner_Diec.begin+0.4s" attributeName="y" calcMode="spline" dur="0.4s" values="6;1;6" keySplines=".14,.73,.34,1;.65,.26,.82,.45" />
                                                <animate begin="spinner_Diec.begin+0.4s" attributeName="height" calcMode="spline" dur="0.4s" values="12;22;12" keySplines=".14,.73,.34,1;.65,.26,.82,.45" />
                                            </rect>
                                        </svg>

                                        <svg className={`fill-white w-[28px] h-[28px] ${isPlaying ? "hidden" : ""}`} fill="hsl(228, 97%, 42%)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="1" y="5" width="2.8" height="15"></rect>
                                            <rect x="5.8" y="2" width="2.8" height="20"></rect>
                                            <rect x="10.6" y="7" width="2.8" height="10"></rect>
                                            <rect x="15.4" y="2" width="2.8" height="20"></rect>
                                            <rect x="20.2" y="5" width="2.8" height="15"></rect>
                                        </svg>
                                    </>
                                }
                            </i>
                            <span className={`font-oswald text-white text-[20px] text-nowrap ${isOpened ? "xl:inline-block" : "xl:hidden"} hidden font-semibold group-hover:text-white`}>LM Player</span>
                        </h3>

                    </div>
                    <nav className=" w-full h-auto flex flex-col justify-center items-center  grow ">
                        <ul id="app-nav" className="    
                        items-center
                        w-full h-auto 
                        transition-none
                        flex flex-col justify-around gap-2 ">
                            <li className="w-full h-auto ">
                                <NavigationLink path="/" label="Home" isOpened={isOpened} Icon={HomeIcon}></NavigationLink>
                            </li>
                            <li className="w-full h-auto ">
                                <NavigationLink path="/albums" label="Albums" isOpened={isOpened} Icon={Disc2Icon}></NavigationLink>
                            </li>

                            <li className="w-full h-auto">
                                <NavigationLink path="/artists" label="Artists" isOpened={isOpened} Icon={CircleUserIcon}></NavigationLink>
                            </li>
                            <li className=" w-full h-auto">
                                <NavigationLink path="/genres" label="Genres" isOpened={isOpened} Icon={HandMetalIcon}></NavigationLink>
                            </li>
                            <li className=" w-full h-auto">
                                <NavigationLink path="/songs" label="Songs" isOpened={isOpened} Icon={MusicIcon}></NavigationLink>
                            </li>
                            <li className=" w-full h-auto">
                                <NavigationLink path="/favorites" label="Favorites" isOpened={isOpened} Icon={HeartIcon}></NavigationLink>
                            </li>
                            <li className=" w-full h-auto">
                                <NavigationLink path="/playlists" label="Playlists" isOpened={isOpened} Icon={ListMusicIcon}></NavigationLink>
                            </li>
                            <li className="w-full h-auto">
                                <NavigationLink path="/search" label="Search" isOpened={isOpened} Icon={SearchIcon}></NavigationLink>
                            </li>
                            <li className="w-full h-auto hidden">
                                <NavigationLink path="/library" label="Library" isOpened={isOpened} Icon={LibraryIcon}></NavigationLink>
                            </li>
                            <li className="w-full h-auto">
                                <NavigationLink path="/profile" label="Profile" isOpened={isOpened} Icon={User2Icon}></NavigationLink>
                            </li>
                        </ul>
                    </nav>
                </header>
            </div>
        </div>
    )
}