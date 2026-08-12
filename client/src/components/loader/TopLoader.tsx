import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
export default function TopLoader() {


    const isLoading = useRouterState({
        select: (state) => state.status === "pending",
    });

    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let interval: number;

        if (isLoading) {
            setVisible(true);
            setProgress(10);

            interval = window.setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) return prev;
                    return prev + (90 - prev) * 0.1;
                });
            }, 100);
        } else {
            setProgress(100);

            const timeout = setTimeout(() => {
                setVisible(false);
                setProgress(0);
            }, 300);

            return () => clearTimeout(timeout);
        }

        return () => clearInterval(interval);
    }, [isLoading]);

    return (
        <div
            className="fixed top-0 left-0 z-50 h-[3px] w-full pointer-events-none"
        >
            <div className="w-full h-full bg-white/25" style={{

                opacity: visible ? 1 : 0,
            }}>
                <div
                    className="h-full bg-white/75 transition-all duration-200"
                    style={{
                        width: `${progress}%`,
                        opacity: visible ? 1 : 0,
                    }}
                />
            </div>
        </div>
    );
}