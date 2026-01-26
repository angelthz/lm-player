import { OrderedArtist } from "./types"

interface OrderedArtistWithDetails extends OrderedArtist {
    details: {
        id: string,
        name: string,
        fans: number,
        photo: string,
        bio: Bio | null,
        social: Social | null
    }
}



export interface DzArtistDetails {
    errors: Error[]
    data: Data
    extensions: Extensions2
}

export interface Error {
    message: string
    type: string
    path: any[]
    extensions: Extensions
}

export interface Extensions {
    type: string
}

export interface Data {
    artist: Artist
    me: any
}

export interface Artist {
    id: string
    name: string
    fansCount: number
    hasSmartRadio: boolean
    isFavorite: any
    picture: Picture
    __typename: string
    bio: Bio
    social: Social
    onTour: boolean
    status: any
    relatedArtists: RelatedArtists
    liveEvents: LiveEvents
}

export interface Picture {
    id: string
    small: string[]
    explicitStatus: boolean
    __typename: string
    medium: string[]
    large: string[]
}

export interface Bio {
    full: string
    __typename: string
}

export interface Social {
    twitter: string
    facebook: string
    website: any
    __typename: string
}

export interface RelatedArtists {
    edges: Edge[]
    pageInfo: PageInfo
    __typename: string
}

export interface Edge {
    cursor: string
    node: Node
    __typename: string
}

export interface Node {
    id: string
    name: string
    fansCount: number
    hasSmartRadio: boolean
    isFavorite: any
    picture: Picture2
    __typename: string
}

export interface Picture2 {
    id: string
    small: string[]
    explicitStatus: boolean
    __typename: string
    medium: string[]
    large: string[]
}

export interface PageInfo {
    hasNextPage: boolean
    hasPreviousPage: boolean
    startCursor: string
    endCursor: string
    __typename: string
}

export interface LiveEvents {
    edges: Edge2[]
    pageInfo: PageInfo2
    __typename: string
}

export interface Edge2 {
    node: Node2
    __typename: string
}

export interface Node2 {
    id: string
    __typename: string
}

export interface PageInfo2 {
    endCursor: string
    hasNextPage: boolean
    __typename: string
}

export interface Extensions2 {
    queryCost: number
}
