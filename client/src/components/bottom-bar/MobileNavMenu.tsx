import { Disc3Icon, HandMetalIcon, HeartIcon, ListMusicIcon, MusicIcon, UserCircle2Icon, UserCog2 } from "lucide-react";
import MobileNavLink from "./MobileNavLink";



interface Props {
    isOpened: boolean;
    menuHandler: () => void;
}

export default function MobileNavMenu({ isOpened, menuHandler }: Props) {

    return (
        <header className={`${isOpened ? "translate-0" : "translate-x-full"} w-full h-full fixed top-0 right-0 z-2 bg-black/80 backdrop-blur-2xl transition-transform duration-200 ease-out`}>
            <div id='title' className={`w-full h-[64px]  relative flex justify-center items-end desktop:items-center`}>
                <h3 className={`mx-auto  ${isOpened ? "w-[90%] px-2" : "md:w-[40px] md:justify-center w-[90%] px-2 md:px-4"} flex gap-2 `}>
                    <i className="group-hover:scale-[1.1] transition-transform ease-in-out duration-400 flex justify-center items-center">
                        <svg className="transform-(--logo-transform) w-[28px] h-[28px] fill-white transition-transform ease-in-out duration-300" width="128" height="128" viewBox="0 0 128 128" fill="white" xmlns="http://www.w3.org/2000/svg">
                            <path d="M36.832 44.9648V93.9219H85.7559L110.218 118.4H9.65234V17.875L36.832 44.9648Z" fill="" />
                            <path d="M64 25.5723L79.9619 9.59961H118.4L118.372 9.62793V118.4L91.1924 91.4189V36.8262L63.9883 64.0488L44.7686 44.8164L44.7812 44.8047L9.59961 9.59961H48.0381L64 25.5723Z" fill="" />
                        </svg>
                    </i>
                    <span className={`font-oswald text-white text-[24px] ${!isOpened && "md:hidden"} font-semibold group-hover:text-white`}>LM Player</span>
                </h3>
            </div>
            <nav className="flex  w-full h-[calc(100vh-(100px+64px+64px))]  p-4 ">
                <ul id="app-nav" className="
                        w-full h-auto
                        flex flex-wrap justify-around items-center 
                           ">

                    <MobileNavLink to="/artists" Icon={UserCircle2Icon} label="Artists" handleClose={menuHandler}></MobileNavLink>

                    <MobileNavLink to="/albums" Icon={Disc3Icon} label="Albums" handleClose={menuHandler}></MobileNavLink>

                    <MobileNavLink to="/songs" Icon={MusicIcon} label="Songs" handleClose={menuHandler}></MobileNavLink>

                    <MobileNavLink to="/genres" Icon={HandMetalIcon} label="Genres" handleClose={menuHandler}></MobileNavLink>

                    <MobileNavLink to="/favorites" Icon={HeartIcon} label="Favorites" handleClose={menuHandler}></MobileNavLink>

                    <MobileNavLink to="/playlists" Icon={ListMusicIcon} label="Playlists" handleClose={menuHandler}></MobileNavLink>

                    <MobileNavLink to="/profile" Icon={UserCog2} label="Profile" handleClose={menuHandler}></MobileNavLink>

                </ul>
            </nav>
        </header>
    )
}

