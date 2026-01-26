export interface DzSearchResult {
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
    instantSearch: InstantSearch
}

export interface InstantSearch {
    bestResult: BestResult
    results: Results
    __typename: string
}

export interface BestResult {
    __typename: string
    artist: Artist
    relatedContent: RelatedContent
}

export interface Artist {
    id: string
    isFavorite: any
    name: string
    fansCount: number
    picture: Picture
    __typename: string
    hasSmartRadio: boolean
    hasTopTracks: boolean
}

export interface Picture {
    id: string
    large: string[]
    explicitStatus: boolean
    __typename: string
}

export interface RelatedContent {
    __typename: string
    album: Album
}

export interface Album {
    id: string
    displayTitle: string
    isFavorite: any
    releaseDateAlbum: string
    isExplicitAlbum: boolean
    cover: Cover
    contributors: Contributors
    tracksCount: number
    __typename: string
    tracks: Tracks
}

export interface Cover {
    id: string
    large: string[]
    explicitStatus: boolean
    __typename: string
}

export interface Contributors {
    edges: Edge[]
    __typename: string
}

export interface Edge {
    roles: string[]
    node: Node
    __typename: string
}

export interface Node {
    id: string
    name: string
    __typename: string
}

export interface Tracks {
    edges: Edge2[]
    __typename: string
}

export interface Edge2 {
    node: Node2
    __typename: string
}

export interface Node2 {
    id: string
    title: string
    duration: number
    popularity: number
    isExplicit: boolean
    lyrics: Lyrics
    media: Media
    album: Album2
    contributors: Contributors2
    credits: Credits
    __typename: string
}

export interface Lyrics {
    id: string
    __typename: string
}

export interface Media {
    id: string
    rights: Rights
    __typename: string
}

export interface Rights {
    ads: Ads
    sub: Sub
    __typename: string
}

export interface Ads {
    available: boolean
    availableAfter: string
    __typename: string
}

export interface Sub {
    available: boolean
    availableAfter: string
    __typename: string
}

export interface Album2 {
    id: string
    displayTitle: string
    cover: Cover2
    __typename: string
}

export interface Cover2 {
    id: string
    xxx_small: string[]
    explicitStatus: boolean
    __typename: string
    large: string[]
}

export interface Contributors2 {
    edges: Edge3[]
    __typename: string
}

export interface Edge3 {
    node: Node3
    __typename: string
}

export interface Node3 {
    id: string
    name: string
    __typename: string
}

export interface Credits {
    edges: Edge4[]
    __typename: string
}

export interface Edge4 {
    roles: string[]
    node: Node4
    __typename: string
}

export interface Node4 {
    id: string
    name: string
    __typename: string
}

export interface Results {
    artists: Artists
    albums: Albums
    channels: Channels
    flowConfigs: FlowConfigs
    livestreams: Livestreams
    playlists: Playlists
    podcasts: Podcasts
    tracks: Tracks2
    users: Users
    podcastEpisodes: PodcastEpisodes
    __typename: string
}

export interface Artists {
    edges: Edge5[]
    pageInfo: PageInfo
    priority: number
    __typename: string
}

export interface Edge5 {
    node: Node5
    __typename: string
}

export interface Node5 {
    id: string
    isFavorite: any
    name: string
    fansCount: number
    picture: Picture2
    __typename: string
}

export interface Picture2 {
    id: string
    large: string[]
    explicitStatus: boolean
    __typename: string
}

export interface PageInfo {
    endCursor: string
    __typename: string
}

export interface Albums {
    edges: Edge6[]
    pageInfo: PageInfo2
    priority: number
    __typename: string
}

export interface Edge6 {
    node: Node6
    __typename: string
}

export interface Node6 {
    id: string
    displayTitle: string
    isFavorite: any
    releaseDateAlbum: string
    isExplicitAlbum: boolean
    cover: Cover3
    contributors: Contributors3
    tracksCount: number
    __typename: string
}

export interface Cover3 {
    id: string
    large: string[]
    explicitStatus: boolean
    __typename: string
}

export interface Contributors3 {
    edges: Edge7[]
    __typename: string
}

export interface Edge7 {
    roles: string[]
    node: Node7
    __typename: string
}

export interface Node7 {
    id: string
    name: string
    __typename: string
}

export interface PageInfo2 {
    endCursor: string
    __typename: string
}

export interface Channels {
    edges: any[]
    pageInfo: PageInfo3
    priority: number
    __typename: string
}

export interface PageInfo3 {
    endCursor: any
    __typename: string
}

export interface FlowConfigs {
    edges: any[]
    pageInfo: PageInfo4
    priority: number
    __typename: string
}

export interface PageInfo4 {
    endCursor: any
    __typename: string
}

export interface Livestreams {
    edges: any[]
    pageInfo: PageInfo5
    priority: number
    __typename: string
}

export interface PageInfo5 {
    endCursor: any
    __typename: string
}

export interface Playlists {
    edges: Edge8[]
    pageInfo: PageInfo6
    priority: number
    __typename: string
}

export interface Edge8 {
    node: Node8
    __typename: string
}

export interface Node8 {
    id: string
    title: string
    isFavorite: any
    estimatedTracksCount: number
    fansCount: number
    isPrivate: boolean
    isCollaborative: boolean
    picture: Picture3
    owner?: Owner
    __typename: string
}

export interface Picture3 {
    id: string
    large: string[]
    explicitStatus: boolean
    __typename: string
}

export interface Owner {
    id: string
    name: string
    __typename: string
}

export interface PageInfo6 {
    endCursor: string
    __typename: string
}

export interface Podcasts {
    edges: Edge9[]
    pageInfo: PageInfo7
    priority: number
    __typename: string
}

export interface Edge9 {
    node: any
    __typename: string
}

export interface PageInfo7 {
    endCursor: string
    __typename: string
}

export interface Tracks2 {
    edges: Edge10[]
    pageInfo: PageInfo8
    priority: number
    __typename: string
}

export interface Edge10 {
    node: Node9
    __typename: string
}

export interface Node9 {
    id: string
    title: string
    duration: number
    popularity: number
    isExplicit: boolean
    lyrics: Lyrics2
    media: Media2
    album: Album3
    contributors: Contributors4
    credits: Credits2
    __typename: string
}

export interface Lyrics2 {
    id: string
    __typename: string
}

export interface Media2 {
    id: string
    rights: Rights2
    __typename: string
}

export interface Rights2 {
    ads: Ads2
    sub: Sub2
    __typename: string
}

export interface Ads2 {
    available: boolean
    availableAfter: string
    __typename: string
}

export interface Sub2 {
    available: boolean
    availableAfter: string
    __typename: string
}

export interface Album3 {
    id: string
    displayTitle: string
    cover: Cover4
    __typename: string
}

export interface Cover4 {
    id: string
    xxx_small: string[]
    explicitStatus: boolean
    __typename: string
    large: string[]
}

export interface Contributors4 {
    edges: Edge11[]
    __typename: string
}

export interface Edge11 {
    node: Node10
    __typename: string
}

export interface Node10 {
    id: string
    name: string
    __typename: string
}

export interface Credits2 {
    edges: Edge12[]
    __typename: string
}

export interface Edge12 {
    roles: string[]
    node: Node11
    __typename: string
}

export interface Node11 {
    id: string
    name: string
    __typename: string
}

export interface PageInfo8 {
    endCursor: string
    __typename: string
}

export interface Users {
    edges: Edge13[]
    pageInfo: PageInfo9
    priority: number
    __typename: string
}

export interface Edge13 {
    node: Node12
    __typename: string
}

export interface Node12 {
    id: string
    name: string
    picture?: Picture4
    __typename: string
}

export interface Picture4 {
    id: string
    large: string[]
    explicitStatus: boolean
    __typename: string
}

export interface PageInfo9 {
    endCursor: string
    __typename: string
}

export interface PodcastEpisodes {
    edges: Edge14[]
    pageInfo: PageInfo10
    priority: number
    __typename: string
}

export interface Edge14 {
    node: Node13
    __typename: string
}

export interface Node13 {
    id: string
    title: string
    description: string
    duration: number
    releaseDate: string
    media: Media3
    podcast: Podcast
    __typename: string
}

export interface Media3 {
    url: string
    __typename: string
}

export interface Podcast {
    id: string
    displayTitle: string
    isExplicit: boolean
    cover: Cover5
    rights: Rights3
    __typename: string
}

export interface Cover5 {
    id: string
    small: string[]
    explicitStatus: boolean
    __typename: string
    large: string[]
}

export interface Rights3 {
    ads: Ads3
    sub: Sub3
    __typename: string
}

export interface Ads3 {
    available: boolean
    __typename: string
}

export interface Sub3 {
    available: boolean
    __typename: string
}

export interface PageInfo10 {
    endCursor: string
    __typename: string
}

export interface Extensions2 {
    queryCost: number
}
