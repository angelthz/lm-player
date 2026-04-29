
import useRegisterActivity from "src/hooks/useRegisterActivity";
import DesktopBottomBar from "./DesktopBottomBar";
import MobileBottomBar from "./MobileBottomBar";
import useBreakPoint from "src/hooks/useBreakPoint";

export default function BottomBar() {
    const { isBreakPointReach } = useBreakPoint(540);

    useRegisterActivity();
    return (
        <>
            {isBreakPointReach && <DesktopBottomBar></DesktopBottomBar>}
            {!isBreakPointReach && <MobileBottomBar></MobileBottomBar>}
        </>

    )
}


