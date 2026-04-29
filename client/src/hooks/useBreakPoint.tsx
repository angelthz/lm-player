import { useEffect, useState } from "react";

export default function useBreakPoint(breakPoint: number) {
    const [isBreakPointReach, setIsBreakPointState] = useState(false);

    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            entries.forEach(entry => {
                // console.log(entry)
                setIsBreakPointState(entry.contentRect.width >= breakPoint);
                // if (entry.contentRect.width <= breakPoint)
                // setIsBreakPoint(true);
                // else
                // setIsBreakPoint(false);
            })
        });

        observer.observe(document.body);

        setIsBreakPointState(document.body.clientWidth <= breakPoint);
    }, []);

    useEffect(() => { console.log(`%cUpdating breakpoint state`, 'background: #1a1a1a; color: #fb1b77;') })


    return { isBreakPointReach }
}   