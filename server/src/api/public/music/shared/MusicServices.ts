
//repositories inject the model in the service layer
//instead instantiate inside service layer


import { AlbumModel } from "../album/model/AlbumModel";
import { GetAlbumById } from "../album/services/GetAlbumById";
import { GetAlbumSongs } from "../album/services/GetAlbumSongs";
import { GetAllAlbums } from "../album/services/GetAllAlbums";
import { SongModel } from "../song/model/SongModel"
import { AddSongActivity } from "../song/services/AddSongActivity";
import { GetAllSongs } from "../song/services/GetAllSongs";


import { GetSongById } from "../song/services/GetSongById";
import { GetMostPlayedSongs } from "../song/services/MostPlayedSongs";
import { GetRecentPlayedSongs } from "../song/services/RecentPlayedSongs";



//ej:
//const songModel = new SongModel();

/* 
const MusicServices = {
    song: {
        getAll: SongGetAll(songModel),
        getById: songGetById(songModel),
    }
}
*/

//song model

const songModel = new SongModel();
const albumModel = new AlbumModel();


const MusicServices = {
    song: {
        getAll: new GetAllSongs(songModel),
        getById: new GetSongById(songModel),
        addActivity: new AddSongActivity(songModel),
        getRecentPlayed: new GetRecentPlayedSongs(songModel),
        getMostPlayed: new GetMostPlayedSongs(songModel),
    },
    album: {
        getAll: new GetAllAlbums(albumModel),
        getById: new GetAlbumById(albumModel),
        getAlbumSongs: new GetAlbumSongs(albumModel)
    },
};


export { MusicServices };