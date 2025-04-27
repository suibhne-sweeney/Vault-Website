import { createSlice } from "@reduxjs/toolkit";
import { UserInterface } from "./types";

const initialState: UserInterface = {
    user: null,
    token: null,
    playlists: [],
    followers: [],
    following: [],
    queue: [],
    likedPlaylists: [],
    likedSongs: [],
    currentSong: null,
    songOriginId: null
} 

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLogin: (state, action) => {
            state.user = action.payload.user; 
            state.token = action.payload.token;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
            state.playlists = [];
            state.followers = [];
            state.following = [];
            state.queue = [];
            state.likedPlaylists = [];
            state.likedSongs = [];
            state.currentSong = null;
            state.songOriginId = null;
        },
        setFollowers: (state, action) => {
            if(state.user){
                state.followers = action.payload.followers
            }else{
                console.error("user followers non-existent");
            }
        },
        setFollowing: (state, action) => {
            if(state.user){
                state.following = action.payload.following
            }else{
                console.error("user following non-existent");
            }
        },
        setPlaylists: (state, action) => {
            state.playlists = action.payload.playlists;
        },
        setQueueState: (state, action) => {
            state.queue = action.payload.queue;
            state.currentSong = action.payload.currentSong;
            state.songOriginId = action.payload.songOriginId;
        },
        setCurrentSongState: (state, action) => {
            state.currentSong = action.payload.currentSong;
        },
        setSongOriginIdState: (state, action) => {
            state.songOriginId = action.payload.songOriginId;
        },
        setLikedSongs: (state, action) => {
            state.likedSongs = action.payload.likedSongs;
        },
        setLikedPlaylists: (state, action) => {
            state.likedPlaylists = action.payload.likedPlaylists;
        }
    }
})

export const { setFollowers, setFollowing, setLogin, setLogout, setPlaylists, setQueueState, setCurrentSongState, setSongOriginIdState, setLikedSongs, setLikedPlaylists } = authSlice.actions;
export default authSlice.reducer