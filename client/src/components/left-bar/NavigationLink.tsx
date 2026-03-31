import { Link } from "@tanstack/react-router";
import { LucideProps } from "lucide-react";
import React from "react";


interface Props {
    path: string;
    label: string;
    isOpened?: boolean;
    img?: string;
    Icon?: React.FC<LucideProps>;
}
// className={`${isOpened ? "w-[90%] px-2" : "md:w-[40px] md:justify-center w-[90%] px-4"}  h-[40px] mx-auto  flex items-center rounded-xl hover:bg-white/10 transition-colors ease-in-out duration-400 group`}

export default function NavigationLink({ path, label, isOpened, img, Icon }: Props) {
    return (
        <Link

            data-tooltip={isOpened ? "" : `${label}`}
            data-flow="right"
            to={path}
            className={`
                w-[48px] h-[48px] aspect-square
                2xl:w-[58px] 2xl:h-[58px]
                mx-auto
                flex justify-center items-center rounded-xl 
                relative
                group
                ${isOpened ? "xl:w-[90%] 2xl:w-[90%]" : "xl:w-[48px] 2xl:w-[58px]"}
            `}
            activeProps={{
                style: { backgroundColor: "rgba(255,255,255,0.15)", "--active-color": "#ffffff" } as React.CSSProperties
            }}
            activeOptions={{ exact: true }}
        >
            {({ isActive }) => {
                return (
                    <>
                        <div className="absolute top-0 left-0 w-full h-full z-0 scale-[0.85]  group-hover:scale-[1] rounded-xl  hover:bg-white/10 transition-all duration-200 ease-out"></div>
                        <div className={`
                            w-full h-full
                            flex justify-center items-center gap-3 group
                            pointer-events-none
                            ${isOpened && "justify-start mx-4"}
                        `}>
                            <i className={`${!isOpened && ""}`}>{Icon && <Icon className={`${isActive ? "stroke-white scale-[1.15]" : "scale-[1] stroke-woodsmoke-300"} w-[20px] desktop:w-[20px] 2xl:w-[20px] aspect-square stroke-[2.7]  group-hover:stroke-white  group-hover:scale-[1.15] transition-transform ease-out duration-700`}></Icon>}</i>
                            <span className={`${isActive ? "text-white " : "text-woodsmoke-200 "}  ${isOpened ? "xl:inline-block" : "xl:hidden"} text-nowrap hidden text-white  text-sm font-medium group-hover:text-white `}>{label}</span>
                        </div>
                    </>
                )
            }}
        </Link>

    )
    return (
        <Link
            data-tooltip={isOpened ? "" : `${label}`}
            data-flow="right"
            to={path}
            className={`
                w-[48px] h-[48px] aspect-square
                2xl:w-[58px] 2xl:h-[58px]
                mx-auto
                flex justify-center items-center rounded-xl 
                relative
                group
                ${isOpened ? "xl:w-[90%] 2xl:w-[90%]" : "xl:w-[48px] 2xl:w-[58px]"}
            `}
            activeProps={{
                style: { backgroundColor: "rgba(255,255,255,0.15)", "--active-color": "#ffffff" } as React.CSSProperties
            }}
            activeOptions={{ exact: true }}
        >
            {({ isActive }) => {
                return (
                    <>
                        <div className="absolute top-0 left-0 w-full h-full z-0 scale-[0.85]  group-hover:scale-[1] rounded-xl  hover:bg-white/10 transition-all duration-200 ease-out"></div>
                        <div className={`
                            w-full h-full
                            flex justify-center items-center gap-3 group
                            pointer-events-none
                            ${isOpened && "justify-start mx-4"}
                        `}>
                            <i className={`${!isOpened && ""}`}>{Icon && <Icon className={`${isActive ? "stroke-white scale-[1.15]" : "scale-[1] stroke-woodsmoke-300"} w-[20px] desktop:w-[20px] 2xl:w-[20px] aspect-square stroke-[2.7]  group-hover:stroke-white  group-hover:scale-[1.15] transition-transform ease-out duration-700`}></Icon>}</i>
                            <span className={`${isActive ? "text-white " : "text-woodsmoke-200 "}  ${isOpened ? "xl:inline-block" : "xl:hidden"} text-nowrap hidden text-white  text-sm font-medium group-hover:text-white `}>{label}</span>
                        </div>
                    </>
                )
            }}
        </Link>

    )

}


