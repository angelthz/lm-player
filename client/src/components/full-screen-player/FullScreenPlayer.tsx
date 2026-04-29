import { useEffect } from "react";
import { useFullscreenPlayerState } from "src/context/FullscrenPlayerVisibility";
import useBreakPoint from "src/hooks/useBreakPoint";
import MobileFullPlayer from "./MobilePlayer";
import { DesktopPlayer } from "./DesktopPlayer";



export function FullscreenPlayer() {
    const { isBreakPointReach } = useBreakPoint(540);
    const fullscrenPlayer = useFullscreenPlayerState();

    useEffect(() => {
        if (fullscrenPlayer.isVisible)
            document.body.style.overflowY = "hidden";
        else
            document.body.style.overflowY = "scroll";

    }, [fullscrenPlayer]);

    return (
        <div className="full-player relative">
            <div id="player-container" className={`${fullscrenPlayer.isVisible ? "translate-y-0" : "translate-y-full"} 
            fixed top-0 left-0 z-50 
            w-full h-screen 
            bg-[rgba(3,3,3,0.75)] 
            backdrop-blur-[80px] 
            ease-[cubic-bezier(0.25,1,0.5,1)]
            duration-250
            overflow-hidden`
            }>
                {fullscrenPlayer.isVisible && !isBreakPointReach && <MobileFullPlayer></MobileFullPlayer>}
                {fullscrenPlayer.isVisible && isBreakPointReach && <DesktopPlayer></DesktopPlayer>}
            </div>
        </div>
    )

}