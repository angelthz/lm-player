import { useMutation } from "@tanstack/react-query";
import { createContext } from "react";
import { FetchSong } from "src/api/music/songs/querySongs";

const RegisterActivity = createContext(null);

const RegisterActivityProvider = () => {
    const mutation = useMutation({
        mutationFn: FetchSong.registerActivity,

    })

};