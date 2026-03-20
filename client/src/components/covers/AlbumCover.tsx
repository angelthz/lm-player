import React, { memo, RefObject, useEffect, useRef } from "react";
import { logger } from "src/utils/Logger";

interface Props {
    src: string;
    elementToObserve: RefObject<HTMLElement | null>;
}

export default function AlbumCover({ src, elementToObserve }: Props) {
    useEffect(() => { logger.log(`%c-> Album Parallax Cover`, `background:#0a0a0a; color:#FFE700; font-weight:bold;`) })

    const bgRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                // console.log(entry.intersectionRatio)
                // document.body.style.setProperty("--active-bg", `rgba(3,3,3,${0.7 - entry.intersectionRatio})`)
                // document.body.style.setProperty("--active-border", `rgba(35,35,35,${1 - entry.intersectionRatio})`)

                // document.body.style.setProperty("--active-color", `rgba(35,35,35,${0.7 - entry.intersectionRatio})`)
                // document.body.style.setProperty("--active-opacity", `${1 - entry.intersectionRatio}`);
                if (!entry.isIntersecting) {
                    // if (entry.intersectionRatio < 0.60) {

                    document.body.style.setProperty("--active-opacity", `1`);
                    document.body.style.setProperty("--active-blur", `26px`);

                    document.body.style.setProperty("--active-bg", `rgba(3,3,3,0.9)`)
                    document.body.style.setProperty("--active-border", `rgba(255,255,255,0.10)`)
                    document.body.style.setProperty("--active-color", `rgba(35,35,35,0.9`)
                }
                else {
                    document.body.style.setProperty("--active-blur", `0px`);
                    document.body.style.setProperty("--active-opacity", `0`);

                    document.body.style.setProperty("--active-bg", `rgba(3,3,3,0)`)
                    document.body.style.setProperty("--active-border", `rgba(255,255,255,0.0)`)
                    document.body.style.setProperty("--active-color", `rgba(35,35,35,0`)
                }
            });
        }, {
            threshold: [0, 0.5, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1],

        });

        // rootMargin: "-250px"
        // if (elementToObserve.current) {
        //     observer.observe(elementToObserve.current);
        //     console.log(elementToObserve.current)
        // }
        if (bgRef.current) {
            observer.observe(bgRef.current);

        }

        document.body.style.setProperty("--global-border", `rgba(255,255,255,0)`)
        return () => {
            observer.disconnect();
            document.body.style.setProperty("--global-border", `rgba(255,255,255,0.10)`)
            // document.body.style.setProperty("--active-bg", `rgba(3,3,3,0)`)
            // document.body.style.setProperty("--active-border", `rgba(255,255,255,0.10)`)
            // document.body.style.setProperty("--active-color", `rgba(35,35,35,1)`)
            // document.body.style.setProperty("--active-opacity", `0`);
        };
    }, []);



    return (
        <div className="
                absolute 
                top-0 left-0 z-0
                w-full 
                h-[480px]
                before:absolute before:top-0 before:left-0
                before:w-full before:h-full
                before:bg-linear-to-t before:from-[rgba(3,3,3,0.9)] before:from-10% before:to-[rgba(3,3,3,0.5)] before:to-90% 

                after:absolute after:top-0 after:left-0
                after:w-full after:h-full
                after:bg-linear-to-t after:from-[rgba(3,3,3,1)] after:from-20% after:to-[rgba(3,3,3,0)] 
                
                "
            style={{
                backgroundImage: `url(${src})`,
                backgroundColor: "linear-gradient(180deg, rgba(3,3,3,0.25) 0, rgba(3,3,3,1) 100%)",
                backgroundPosition: "50% 35%",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundAttachment: "scroll",
            }}
            ref={bgRef}
        ></div>
    )

}


export const AlbumCoverMemo = memo(AlbumCover);