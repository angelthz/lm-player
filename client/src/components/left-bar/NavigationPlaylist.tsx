import { Link } from "@tanstack/react-router";
import { LucideProps, PlayCircle, PlayCircleIcon } from "lucide-react";

interface Props {
    path: string;
    label: string;
    isOpened?: boolean;
    playlistName?: string;
    Icon?: React.FC<LucideProps>;
}

export default function NavigationPlaylist({ path, label, isOpened, playlistName, Icon }: Props) {

    return (
        <Link
            to={path}
            className={`${isOpened ? "w-[90%] px-2" : "md:w-[40px] md:justify-center w-[90%] px-4"} h-[40px] mx-auto my-1 flex items-center rounded-xl hover:bg-white/10 transition-colors ease-in-out duration-400 group`}
            preload={"intent"}
            activeProps={{
                style: { backgroundColor: "rgba(255,255,255,0.20)", backdropFilter: "blur(25px)" }
            }}
            activeOptions={{ exact: true }}
        >
            {({ isActive }) => {
                return (
                    <div className={`${!isOpened && "md:group-hover:scale-[1.15]"} flex items-center gap-3 transition-transform ease-in-out duration-400 group`}>
                        <i>{Icon && <Icon className={`${isActive ? "stroke-white" : "stroke-[#cccccc]"} w-[18px] aspect-square stroke-[2.5] stroke-neutral-400/90 group-hover:stroke-white`}></Icon>}</i>
                        <span className={`${isActive ? "text-white" : "text-[#cccccc]"} ${!isOpened && "md:hidden"} text-sm font-semibold group-hover:text-white`}>{playlistName}</span>
                    </div>
                )
            }}
        </Link>
    )
}