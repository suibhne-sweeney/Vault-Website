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
    likedPlaylists: string[]; 
    followers: string[]; 
    following: string[]; 
    userType: 'user' | 'artist';
    stageName: string;
    picturePath: string;
}

export interface UserInterface {
    user: UserDetail | null;
    token: string | null;
    playlists: unknown[],
    followers: unknown[],
    following: unknown[]
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
    visibility: "public" | "private",
    likes: boolean[],
    collectionType: "playlist" | "album"
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
