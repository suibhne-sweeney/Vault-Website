export interface UserDetail {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    gender: 'Male' | 'Female' | 'None';
    likedSongs: string[]; 
    playlists: PlaylistInterface[]; 
    likedPlaylists: PlaylistInterface[]; 
    followers: string[]; 
    following: string[]; 
    userType: 'user' | 'artist';
    stageName: string;
    picturePath: string;
}

export interface UserInterface {
    user: UserDetail | null;
    token: string | null;
    playlists: PlaylistInterface[],
    followers: [],
    following: [],
    likedPlaylists: PlaylistInterface[],
    likedSongs: SongInterface[],
    queue: SongInterface[],
    currentSong: SongInterface | null
    songOriginId: string | null,
}

export interface PlaylistInterface {
    _id: string,
    name: string,
    description: string,
    user: {
        _id: string,
        firstName: string,
        lastName: string
    },
    image: string,
    songs: SongInterface[],
    visibility: string,
    likes: Record<string, boolean>,
    createdAt: Date,
    updatedAt: Date,
} 

export interface SongInterface {
    _id: string;
    name: string;
    artistId: string;
    artistName: string;
    song: string;
    image: string;
    plays: number;
    date: Date;
    genres: string[];
    likes: Record<string, boolean>;
}
