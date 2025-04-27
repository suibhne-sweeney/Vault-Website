import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlayIcon, PauseIcon} from "lucide-react";
import { useEffect, useState } from "react";
import { SongInterface, UserInterface } from "@/state/types";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { usePlayer } from "@/context/player-provider";
import SoundWave from "@/components/ui/soundwave";
import { useSelector } from "react-redux";

const LikedSongsPage = () => {
  const likedSongs = useSelector((state: UserInterface) => state.likedSongs);
  const { setQueue, setCurrentSong, setIsPlaying, isPlaying, currentSong, songOriginId, setSongOriginId } = usePlayer();
  const SERVER_URI = import.meta.env.VITE_SERVER_URI;
  const [songDurations, setSongDurations] = useState<string[]>([]);
  const token = useSelector((state: UserInterface) => state.token);
  

  const setPageTitle = async () => {
    document.title = `Vault`
  }


  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const loadSongDurations = (songs: SongInterface[]) => {
    const promises = songs.map((song) => {
      return new Promise((resolve) => {
        const audio = new Audio(`${SERVER_URI}/assets/${song.song}`);
        audio.addEventListener("loadedmetadata", () => resolve(formatTime(audio.duration)));
        audio.addEventListener("error", () => resolve("0:00"));
      });
    });
  
    Promise.all(promises).then((durations) => setSongDurations(durations as string[]));
  };

  useEffect(() => {
    if (likedSongs.length > 0) {
      loadSongDurations(likedSongs);
    }
    setPageTitle();
  }, [token, likedSongs]);	

  const handleSongClick = (index: number) => {
    if (likedSongs.length > 0) {
      if(likedSongs[index]._id !== currentSong?._id) setIsPlaying(true);
      else setIsPlaying(!isPlaying);
      setQueue(likedSongs);
      setCurrentSong(likedSongs[index]);
      setSongOriginId(null); // No playlist id here, just liked songs
    }
  };

  if (!likedSongs.length) {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center">
        <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-2">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto py-6 px-6">
      <AuroraBackground>
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8 relative z-50">
          <img
            alt="Liked Songs Cover"
            className="rounded-lg object-cover w-48 h-48 md:w-64 md:h-64"
            height="256"
            src="https://www.afrocharts.com/images/song_cover-500x500.png" // or a nice static image
            width="256"
          />
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-3xl font-bold mb-2">Liked Songs</h1>
            <p className="text-muted-foreground mb-4">Your collection of liked songs</p>
            <Button
              size="lg"
              className="rounded-full"
              onClick={() => {
                setQueue(likedSongs);
                setCurrentSong(likedSongs[0]);
                setIsPlaying(true);
              }}
            >
              <PlayIcon className="mr-2 h-5 w-5" />
              Play
            </Button>
          </div>
        </div>
      </AuroraBackground>
      <ScrollArea>
        <div className="space-y-4 mr-4">
          {likedSongs.map((song, index) => (
            <div key={song._id} className="flex items-center gap-4 group">
              <Button onClick={() => handleSongClick(index)} variant="secondary" size="icon" className="opacity-0 absolute z-10 group-hover:opacity-100 transition-opacity">
                { isPlaying && currentSong?._id === song._id && !songOriginId 
                  ? <PauseIcon className="h-5 w-5" /> 
                  : <PlayIcon className="h-5 w-5" /> }
              </Button>
              <div className="w-8 text-center text-muted-foreground flex justify-center items-center">
                { isPlaying && currentSong?._id === song._id && !songOriginId
                  ? <SoundWave className="relative z-0 group-hover:opacity-0" />
                  : index + 1 }
              </div>
              <img
                alt={`${song.name} cover`}
                className="rounded object-cover w-12 h-12"
                src={`${SERVER_URI}/assets/${song.image}`}
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{song.name}</div>
                <div className="text-sm text-muted-foreground truncate">{song.artistName}</div>
              </div>
              <div className="text-sm text-muted-foreground">{songDurations[index]}</div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LikedSongsPage;
