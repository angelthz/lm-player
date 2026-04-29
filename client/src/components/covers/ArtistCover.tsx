import { memo, useEffect, useRef, useState } from "react";

interface Props {
    src: string;
}

/* 

           before:absolute before:top-0 before:left-0
                before:w-full before:h-full
                before:bg-[rgba(3,3,3,0.5)]
                before:bg-linear-to-t before:from-[rgba(3,3,3,0.5)] before:from-20%   before:to-[rgba(3,3,3,0.25)]

                after:absolute
                after:top-0 after:left-0
                after:w-full after:h-full
                after:bg-linear-to-t after:from-[rgba(3,3,3,1)] 

*/
//threshold: [0, 0.5, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1]
export default function ArtistCover({ src }: Props) {
    const bgRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                // console.log("visibility ratio:", entry.intersectionRatio)
                // document.body.style.setProperty("--active-bg", `rgba(3,3,3,${0.90 - entry.intersectionRatio})`)
                // document.body.style.setProperty("--active-border", `rgba(255,255,255,${1 - entry.intersectionRatio})`)



                if (!entry.isIntersecting) {
                    document.body.style.setProperty("--active-bg", `rgba(3,3,3,0.9)`)
                    document.body.style.setProperty("--active-blur", `40px`);
                    document.body.style.setProperty("--active-border", `rgba(255,255,255,0.10)`)
                    document.body.style.setProperty("--active-opacity", `1`);
                }
                else {
                    document.body.style.setProperty("--active-bg", `rgba(3,3,3,0)`)
                    document.body.style.setProperty("--active-blur", `0px`);
                    document.body.style.setProperty("--active-border", `rgba(255,255,255,0)`)
                    document.body.style.setProperty("--active-opacity", `0`);
                }
            });
        }, {
            threshold: [0, 0.5, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1]
        });

        // rootMargin: "-250px"
        if (bgRef.current)
            observer.observe(bgRef.current);

        document.body.style.setProperty("--active-border", `rgba(255,255,255,0)`)
        return () => {
            observer.disconnect();
            document.body.style.setProperty("--active-border", `rgba(255,255,255,0.10)`)
            // document.body.style.setProperty("--active-bg", `rgba(3,3,3,0)`)
            // document.body.style.setProperty("--active-border", `1px solid rgba(35,35,35,0)`)
            // document.body.style.setProperty("--active-color", `rgba(35,35,35,1)`)

        };
    }, []);


    // useEffect(() => {
    //     console.log("%cre-rendering, COVER", 'background: #222; color: #ff00ff; font-size: 16px; padding: 1px;')
    // })

    return (
        <>
            <div className="
                w-full h-[480px] absolute top-0 left-0 z-0 

                
                before:absolute before:top-0 before:left-0
                before:w-full before:h-full
                before:bg-linear-to-t before:from-[rgba(3,3,3,0.9)] before:from-10% before:to-[rgba(3,3,3,0.5)] before:to-90% 

                after:absolute after:top-0 after:left-0
                after:w-full after:h-full
                after:bg-linear-to-t after:from-[rgba(3,3,3,1)] after:from-20% after:to-[rgba(3,3,3,0)] 
   
                "
                style={{
                    backgroundImage: `url(${src})`,
                    backgroundPosition: "50% 30%",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundAttachment: "scroll",
                }}
                ref={bgRef}
            ></div>
        </>
    )
}

export const ArtistCoverMemo = memo(ArtistCover);