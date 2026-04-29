import { Link } from "@tanstack/react-router";
import { LucideProps } from "lucide-react";

interface MobileNavLinkProps {
    to: string;
    label: string;
    Icon: React.FC<LucideProps>;
    handleClose: () => void;
}

export default function MobileNavLink({ to, label, Icon, handleClose }: MobileNavLinkProps) {
    return (
        <li className="w-[40%] h-[64px]">
            <Link
                to={to}
                className={`
                w-full h-full
                flex justify-center items-center rounded-xl 
                relative
                group
                bg-white/5 hover:bg-white/25
                px-4
            `}
                preload={"intent"}
                activeProps={{
                    style: { backgroundColor: "rgba(255,255,255,0.1)", "--active-color": "#ffffff" } as React.CSSProperties
                }}
                activeOptions={{ exact: true }}
                onClick={handleClose}
            >
                {({ isActive }) => {
                    return (
                        <div className={`
                        w-full h-full 
                        flex justify-start items-center gap-3 group
                    `}>
                            <i className={``}> <Icon className={`${isActive && "stroke-white"} w-[20px] desktop:w-[20px] 2xl:w-[20px] aspect-square stroke-[2.7] stroke-[#bfbfbf] group-hover:stroke-white   group-hover:scale-[1.1] transition-transform ease-out duration-200`}></Icon></i>
                            <span className={`${isActive && "text-white font-bold"}  text-inactive-white text-sm font-medium group-hover:text-white `}>{label}</span>
                        </div>
                    )
                }}
            </Link>
        </li>
    )
}