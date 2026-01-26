import { DzArtistDetails } from "../types/DzArtistDetails";
import { DzSearchResult } from "../types/DzSearchResult";
import { Formmatter } from "../utils/FormatText";
import { fetchFromAPI } from "./FetchData";
import util from "node:util"

export class DzScrapper {
    private static token: string;

    constructor() {
        DzScrapper.token = "";
    }

    private parseToken(): { unlogged: boolean, scopes: string[], iss: string, exp: number, iat: number } {
        var base64Url = DzScrapper.token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload)
    }

    private tokenHasExpired(): boolean {
        if (DzScrapper.token === "")
            return true;
        else
            return Math.floor(Date.now() / 1000) > this.parseToken().exp;

    }

    private async getToken(): Promise<string | null> {
        if (this.tokenHasExpired()) {
            const tokenResponse = await fetchFromAPI<{ jwt: string, refresh_token: string }>("https://auth.deezer.com/login/anonymous?jo=p&rto=c", "GET");
            DzScrapper.token = tokenResponse.jwt;
            return DzScrapper.token;
        }
        else {
            // console.log("Temp Token")
            return DzScrapper.token;
        }
        // return DzScrapper.token;
    }

    public async getArtist(artist: string) {
        try {
            const artistName = new Formmatter(artist).sanitize().get();
            const token = await this.getToken();

            // console.log("Token: ", token);

            const body = {
                "operationName": "SearchFull",
                "variables": {
                    "query": artistName,
                    "firstGrid": 10,
                    "firstList": 6,
                    "includeRelatedContent": true,
                    "channelPlaylistFirst": 10
                },
                "query": "query SearchFull($query: String!, $firstGrid: Int!, $firstList: Int!, $includeRelatedContent: Boolean!, $channelPlaylistFirst: Int!) {\n  instantSearch(query: $query) {\n    bestResult {\n      __typename\n      ... on InstantSearchAlbumBestResult {\n        album {\n          ...SearchAlbum\n          __typename\n        }\n        __typename\n      }\n      ... on InstantSearchArtistBestResult {\n        artist {\n          ...BestResultArtist\n          __typename\n        }\n        relatedContent @include(if: $includeRelatedContent) {\n          ...RelatedContentArtist\n          __typename\n        }\n        __typename\n      }\n      ... on InstantSearchPlaylistBestResult {\n        playlist {\n          ...SearchPlaylist\n          __typename\n        }\n        __typename\n      }\n      ... on InstantSearchPodcastBestResult {\n        podcast {\n          ...SearchPodcast\n          __typename\n        }\n        __typename\n      }\n      ... on InstantSearchLivestreamBestResult {\n        livestream {\n          ...SearchLivestream\n          __typename\n        }\n        __typename\n      }\n      ... on InstantSearchTrackBestResult {\n        foundByLyrics\n        track {\n          ...TableTrack\n          __typename\n        }\n        __typename\n      }\n      ... on InstantSearchPodcastEpisodeBestResult {\n        podcastEpisode {\n          ...SearchPodcastEpisode\n          __typename\n        }\n        __typename\n      }\n      ... on InstantSearchFlowConfigBestResult {\n        flowConfig {\n          ...SearchFlowConfig\n          __typename\n        }\n        __typename\n      }\n      ... on InstantSearchChannelBestResult {\n        channel {\n          ...SearchChannel\n          __typename\n        }\n        relatedContent {\n          ...ChannelBestResultRelatedContent\n          __typename\n        }\n        __typename\n      }\n    }\n    results {\n      artists(first: $firstGrid) {\n        edges {\n          node {\n            ...SearchArtist\n            __typename\n          }\n          __typename\n        }\n        pageInfo {\n          endCursor\n          __typename\n        }\n        priority\n        __typename\n      }\n      albums(first: $firstGrid) {\n        edges {\n          node {\n            ...SearchAlbum\n            __typename\n          }\n          __typename\n        }\n        pageInfo {\n          endCursor\n          __typename\n        }\n        priority\n        __typename\n      }\n      channels(first: $firstGrid) {\n        edges {\n          node {\n            ...SearchChannel\n            __typename\n          }\n          __typename\n        }\n        pageInfo {\n          endCursor\n          __typename\n        }\n        priority\n        __typename\n      }\n      flowConfigs(first: $firstGrid) {\n        edges {\n          node {\n            ...SearchFlowConfig\n            __typename\n          }\n          __typename\n        }\n        pageInfo {\n          endCursor\n          __typename\n        }\n        priority\n        __typename\n      }\n      livestreams(first: $firstGrid) {\n        edges {\n          node {\n            ...SearchLivestream\n            __typename\n          }\n          __typename\n        }\n        pageInfo {\n          endCursor\n          __typename\n        }\n        priority\n        __typename\n      }\n      playlists(first: $firstGrid) {\n        edges {\n          node {\n            ...SearchPlaylist\n            __typename\n          }\n          __typename\n        }\n        pageInfo {\n          endCursor\n          __typename\n        }\n        priority\n        __typename\n      }\n      podcasts(first: $firstGrid) {\n        edges {\n          node {\n            ...SearchPodcast\n            __typename\n          }\n          __typename\n        }\n        pageInfo {\n          endCursor\n          __typename\n        }\n        priority\n        __typename\n      }\n      tracks(first: $firstList) {\n        edges {\n          node {\n            ...TableTrack\n            __typename\n          }\n          __typename\n        }\n        pageInfo {\n          endCursor\n          __typename\n        }\n        priority\n        __typename\n      }\n      users(first: $firstGrid) {\n        edges {\n          node {\n            ...SearchUser\n            __typename\n          }\n          __typename\n        }\n        pageInfo {\n          endCursor\n          __typename\n        }\n        priority\n        __typename\n      }\n      podcastEpisodes(first: $firstList) {\n        edges {\n          node {\n            ...SearchPodcastEpisode\n            __typename\n          }\n          __typename\n        }\n        pageInfo {\n          endCursor\n          __typename\n        }\n        priority\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment SearchAlbum on Album {\n  id\n  displayTitle\n  isFavorite\n  releaseDateAlbum: releaseDate\n  isExplicitAlbum: isExplicit\n  cover {\n    ...PictureLarge\n    __typename\n  }\n  contributors {\n    edges {\n      roles\n      node {\n        ... on Artist {\n          id\n          name\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  tracksCount\n  __typename\n}\n\nfragment PictureLarge on Picture {\n  id\n  large: urls(pictureRequest: {width: 500, height: 500})\n  explicitStatus\n  __typename\n}\n\nfragment BestResultArtist on Artist {\n  ...SearchArtist\n  hasSmartRadio\n  hasTopTracks\n  __typename\n}\n\nfragment SearchArtist on Artist {\n  id\n  isFavorite\n  name\n  fansCount\n  picture {\n    ...PictureLarge\n    __typename\n  }\n  __typename\n}\n\nfragment RelatedContentArtist on InstantSearchArtistBestResultRelatedContent {\n  __typename\n  ... on InstantSearchArtistBestResultRelatedContentNewRelease {\n    album {\n      ...BestResultAlbumWithTracks\n      __typename\n    }\n    __typename\n  }\n  ... on InstantSearchArtistBestResultRelatedContentRelevantAlbum {\n    album {\n      ...BestResultAlbumWithTracks\n      __typename\n    }\n    __typename\n  }\n  ... on InstantSearchArtistBestResultRelatedContentTopTracks {\n    tracks {\n      ...TableTrack\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment BestResultAlbumWithTracks on Album {\n  ...SearchAlbum\n  tracks {\n    edges {\n      node {\n        ...TableTrack\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment TableTrack on Track {\n  id\n  title\n  duration\n  popularity\n  isExplicit\n  lyrics {\n    id\n    __typename\n  }\n  media {\n    id\n    rights {\n      ads {\n        available\n        availableAfter\n        __typename\n      }\n      sub {\n        available\n        availableAfter\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  album {\n    id\n    displayTitle\n    cover {\n      ...PictureXSmall\n      ...PictureLarge\n      __typename\n    }\n    __typename\n  }\n  contributors {\n    edges {\n      node {\n        ... on Artist {\n          id\n          name\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  credits: contributors(roles: [AUTHOR, COMPOSER]) {\n    edges {\n      roles\n      node {\n        ... on Artist {\n          id\n          name\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment PictureXSmall on Picture {\n  id\n  xxx_small: urls(pictureRequest: {width: 40, height: 40})\n  explicitStatus\n  __typename\n}\n\nfragment SearchPlaylist on Playlist {\n  id\n  title\n  isFavorite\n  estimatedTracksCount\n  fansCount\n  isPrivate\n  isCollaborative\n  picture {\n    ...PictureLarge\n    __typename\n  }\n  owner {\n    id\n    name\n    __typename\n  }\n  __typename\n}\n\nfragment SearchPodcast on Podcast {\n  id\n  displayTitle\n  isPodcastFavorite: isFavorite\n  cover {\n    ...PictureLarge\n    __typename\n  }\n  isExplicit\n  rawEpisodes\n  __typename\n}\n\nfragment SearchLivestream on Livestream {\n  id\n  name\n  cover {\n    ...PictureLarge\n    __typename\n  }\n  __typename\n}\n\nfragment SearchPodcastEpisode on PodcastEpisode {\n  id\n  title\n  description\n  duration\n  releaseDate\n  media {\n    url\n    __typename\n  }\n  podcast {\n    id\n    displayTitle\n    isExplicit\n    cover {\n      ...PictureSmall\n      ...PictureLarge\n      __typename\n    }\n    rights {\n      ads {\n        available\n        __typename\n      }\n      sub {\n        available\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment PictureSmall on Picture {\n  id\n  small: urls(pictureRequest: {height: 100, width: 100})\n  explicitStatus\n  __typename\n}\n\nfragment SearchFlowConfig on FlowConfig {\n  id\n  title\n  visuals {\n    dynamicPageIcon {\n      id\n      large: urls(uiAssetRequest: {width: 500, height: 500})\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment SearchChannel on Channel {\n  id\n  picture {\n    ...PictureLarge\n    __typename\n  }\n  logoAsset {\n    id\n    large: urls(uiAssetRequest: {width: 500, height: 0})\n    __typename\n  }\n  name\n  slug\n  url {\n    webUrl\n    __typename\n  }\n  backgroundColor\n  __typename\n}\n\nfragment ChannelBestResultRelatedContent on InstantSearchChannelBestResultRelatedContent {\n  flowConfig {\n    ...SearchFlowConfig\n    __typename\n  }\n  playlists(first: $channelPlaylistFirst) {\n    edges {\n      node {\n        ...SearchPlaylist\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment SearchUser on User {\n  id\n  name\n  picture {\n    ...PictureLarge\n    __typename\n  }\n  __typename\n}"
            }

            const headers = {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            }

            const resp = await fetchFromAPI("https://pipe.deezer.com/api", "POST", headers, body) as DzSearchResult;

            if (resp.errors.find(err => err.extensions.type === "JwtTokenExpiredError"))
                throw { msg: "Error 401: The JWToken has expired" };

            if (resp.data.instantSearch.bestResult && resp.data.instantSearch.__typename === "InstantSearchArtistBestResult")
                return resp.data.instantSearch.bestResult.artist;
            else if (resp.data.instantSearch.results.artists.edges.length > 0)
                return resp.data.instantSearch.results.artists.edges[0].node;
            else
                throw { msg: `Error: 404, Artist ${artistName} Not Found` };
        } catch (err) {
            console.log(err)
        }
    }

    public async getArtistDetails(artistId: string | number) {
        try {
            const token = await this.getToken();

            // console.log("Token: ", token);

            const body = {
                "operationName": "ArtistFull",
                "variables": {
                    "artistId": `${artistId}`,
                    "relatedArtistFirst": 6,
                    "liveEventsFirst": 6
                },
                "query": "query ArtistFull($artistId: String!, $relatedArtistFirst: Int!, $liveEventsFirst: Int!) {\n  artist(artistId: $artistId) {\n    ...ArtistMasthead\n    relatedArtists: relatedArtist(first: $relatedArtistFirst) {\n      edges {\n        cursor\n        node {\n          ...ArtistBase\n          __typename\n        }\n        __typename\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n        __typename\n      }\n      __typename\n    }\n    liveEvents(\n      first: $liveEventsFirst\n      types: [CONCERT, FESTIVAL]\n      statuses: [PENDING]\n    ) {\n      edges {\n        node {\n          id\n          __typename\n        }\n        __typename\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  me {\n    userFavorites {\n      byArtist(artistId: $artistId) {\n        estimatedTracksCount\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment ArtistMasthead on Artist {\n  ...ArtistBase\n  ...ArtistBio\n  ...ArtistSocial\n  onTour\n  status\n  __typename\n}\n\nfragment ArtistBase on Artist {\n  id\n  name\n  fansCount\n  hasSmartRadio\n  isFavorite\n  picture {\n    ...PictureSmall\n    ...PictureMedium\n    ...PictureLarge\n    __typename\n  }\n  __typename\n}\n\nfragment PictureSmall on Picture {\n  id\n  small: urls(pictureRequest: {height: 100, width: 100})\n  explicitStatus\n  __typename\n}\n\nfragment PictureMedium on Picture {\n  id\n  medium: urls(pictureRequest: {width: 264, height: 264})\n  explicitStatus\n  __typename\n}\n\nfragment PictureLarge on Picture {\n  id\n  large: urls(pictureRequest: {width: 500, height: 500})\n  explicitStatus\n  __typename\n}\n\nfragment ArtistBio on Artist {\n  bio {\n    full\n    __typename\n  }\n  __typename\n}\n\nfragment ArtistSocial on Artist {\n  social {\n    twitter\n    facebook\n    website\n    __typename\n  }\n  __typename\n}"
            }

            const headers = {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            }

            const resp = await fetchFromAPI("https://pipe.deezer.com/api", "POST", headers, body) as DzArtistDetails;

            if (resp.errors.find(err => err.extensions.type === "JwtTokenExpiredError"))
                throw { msg: "Error 401: The JWTokenhas expired" };

            if (resp.data.artist)
                return resp.data.artist
            else
                throw { msg: `Error: 404, Artist ${artistId} Not Found` };
        } catch (err) {
            console.log(err);
        }
    }
}