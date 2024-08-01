export interface UserDetail {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    gender: 'Male' | 'Female' | 'None';
    likedSongs: string[]; 
    playlists: string[]; 
    likedPlaylists: string[]; 
    followers: string[]; 
    following: string[]; 
    userType: 'user' | 'artist';
    stageName: string;
    picturePath: string;
}

export interface UserInterface {
    user: UserDetail | null;
    token: unknown;
    playlists: unknown[],
    followers: unknown[],
    following: unknown[]
}
  