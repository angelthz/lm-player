import { useCallback, useEffect, useRef, useState } from "react";
import { BASE_URL } from "src/env/HostURL";
import { useAudioContext } from "src/player-context/AudioContext";
import { usePlaylistCurrent } from "src/player-context/PlaylistContext";

export default function useRegisterActivity() {
    //context
    const audio = useAudioContext();
    const { song } = usePlaylistCurrent();

    //hook state
    const [isRegistered, setIsRegistered] = useState(false);
    const [reset, setReset] = useState(false);
    const counterRef = useRef(0);
    const playedTimeRef = useRef(0);
    const counterLim = useRef(30);

    const runCounter = useCallback((run: boolean) => {
        if (run && playedTimeRef.current <= counterLim.current) {
            // console.log("new counter")
            counterRef.current = setInterval(() => {
                // console.log("counter: ", playedTimeRef.current)
                if (playedTimeRef.current <= counterLim.current)
                    playedTimeRef.current += 1;
                else {
                    clearInterval(counterRef.current);
                    setIsRegistered(true);
                }
            }, 1000);

        }
        else if (playedTimeRef.current <= counterLim.current) {
            console.log("clear counter")
            clearInterval(counterRef.current);
        }
    }, []);

    const resetRegister = useCallback(() => {
        clearInterval(counterRef.current);
        counterRef.current = 0;
        playedTimeRef.current = 0;
        setIsRegistered(false);
    }, []);

    //setup audio events
    useEffect(() => {
        const audioTimeUpdate = () => {
            if (audio.currentTime === 0) {
                console.log(`%cReset Register Activity`, 'background: #1a1a1a; color: #ED7987;')
                // setReset(prev => !prev)
                resetRegister();
                runCounter(true);
            }
        }
        const audioPlay = () => {
            console.log(`%cReset Running register Activity`, 'background: #1a1a1a; color: #F39F78;')
            runCounter(true);
        }

        const audioPause = () => {
            console.log(`%cPause register Activity`, 'background: #1a1a1a; color: #60BED1;')
            runCounter(false);
        }

        audio.addEventListener("timeupdate", audioTimeUpdate);
        audio.addEventListener("play", audioPlay);
        audio.addEventListener("pause", audioPause);

        return () => {
            audio.removeEventListener("timeupdate", audioTimeUpdate)
            audio.removeEventListener("play", audioPlay)
            audio.removeEventListener("pause", audioPause)
        };
    }, [])

    useEffect(() => {
        const registerActivity = async (id: number) => {
            try {
                // console.log("Song Registered Successfully", id)
                const req = await fetch(
                    `${BASE_URL}/api/music/songs/register-activity`, {
                    method: "POST",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify({ id })
                });

                if (!req.ok) throw new Error("Error at Song Activity register in POST request")
                const res = await req.json();
                console.log("Song activity registered succesfully ", id, res);
            } catch (err) {
                console.error(err);
            }
        };

        if (isRegistered && song)
            registerActivity(song.songId);

    }, [isRegistered]);

    useEffect(() => {
        resetRegister();
    }, [song, reset]);

    // useEffect(() => {
    //     resetRegister();
    // }, [reset])
}