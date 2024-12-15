import { PlaybackState } from "./playState";

const AudioPlayer = (file: string, state: PlaybackState) => {
   const audio = new Audio(`http://localhost:3001/assets/${file}`);
   if(state == PlaybackState.play) audio.play();
   else if(state == PlaybackState.pause) audio.pause();
   audio.currentTime
}

export default AudioPlayer;