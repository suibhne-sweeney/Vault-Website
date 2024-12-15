import { createSlice } from "@reduxjs/toolkit";
import { UserInterface } from "./types";

const initialState: UserInterface = {
    user: null,
    token: null,
    playlists: [],
    followers: [],
    following: []

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
        }
    }
})

export const { setFollowers, setFollowing, setLogin, setLogout, setPlaylists } = authSlice.actions;
export default authSlice.reducer