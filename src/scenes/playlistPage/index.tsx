import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlayIcon, ShuffleIcon, MoreHorizontalIcon, PauseIcon, PlusCircle, Heart, Share2, Music } from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { PlaylistInterface, SongInterface, UserInterface } from "@/state/types";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { usePlayer } from "@/context/player-provider";
import { useDispatch, useSelector } from "react-redux";
import SoundWave from "@/components/ui/soundwave";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { setPlaylists } from "@/state";

const PlaylistPage = () => {
  const { id } = useParams();
  const userId = useSelector((state: UserInterface) => state.user?._id)
  const { setQueue, setCurrentSong, setIsPlaying, setSongOriginId, isPlaying, currentSong, songOriginId } = usePlayer();
  const [playlist, setPlaylist] = useState<PlaylistInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: UserInterface) => state.token);
  const playlists = useSelector((state: UserInterface) => state.playlists as PlaylistInterface[]) 
  const dispatch = useDispatch();
  const [songDurations, setSongDurations] = useState<string[]>([])
  const SERVER_URI = import.meta.env.VITE_SERVER_URI;

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

  const getPlaylist = async () => {
    try {
      const response = await fetch(`${SERVER_URI}/api/playlists/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setPlaylist(data);
      if (data?.songs) loadSongDurations(data.songs);
    } catch (error) {
      console.log("Error fetching playlist:", error);
    }
  };

  const getPlaylists = async () => {
    const response = await fetch(`${SERVER_URI}/api/playlists/all/user/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await response.json(); // Convert the response to JSON
    dispatch(setPlaylists({playlists: data}))
  };

  useEffect(() => {
    getPlaylist();
    getPlaylists();
    setLoading(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  const handleSongClick = (index: number) => {
    if (playlist?.songs) {
      if(playlist.songs[index]._id !== currentSong?._id) setIsPlaying(true);
      else setIsPlaying(!isPlaying);
      setQueue(playlist.songs);
      setCurrentSong(playlist.songs[index]);
      setSongOriginId(id ?? null)
    }
  };
  
  const setPageTitle = async () => {
    document.title = `Playlist - ${playlist?.name}`
  }

  if(!loading){
    setPageTitle();
    console.log(songDurations)
  }

  if (loading)
    return (
      <div className="flex flex-col min-h-screen justify-center items-center">
        <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-2">Loading...</p>
      </div>
    );

  return (
    <div className="mx-auto py-6 px-6">
      <AuroraBackground>
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8 relative z-50">
        <img
            alt="Glow"
            className="rounded-lg object-cover w-48 h-48 md:w-64 md:h-64 filter: blur-[10px] saturate-200"
            height="256"
            src={"https://www.afrocharts.com/images/song_cover-500x500.png"}
            width="256"
          />
          <img
            alt="Playlist cover"
            className="absolute rounded-lg object-cover w-48 h-48 md:w-64 md:h-64"
            height="256"
            src={"https://www.afrocharts.com/images/song_cover-500x500.png"}
            width="256"
          />
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-3xl font-bold mb-2">{playlist?.name}</h1>
            <p className="text-muted-foreground mb-4">{playlist?.description}</p>
            <div className="flex items-center gap-4">
              <Button
                size="lg"
                className="rounded-full"
                onClick={() => {
                  if (playlist?.songs) {
                    setQueue(playlist.songs);
                    setCurrentSong(playlist.songs[0]);
                    setIsPlaying(true);
                  }
                }}
              >
                <PlayIcon className="mr-2 h-5 w-5" />
                Play
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <ShuffleIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </AuroraBackground>
      <ScrollArea>
        <div className="space-y-4 mr-4">
          {playlist?.songs.map((song, index) => (
            <div key={song._id} className="flex items-center gap-4 group">
              <Button onClick={() => handleSongClick(index)} variant="secondary" size="icon" className="opacity-0 absolute z-10 group-hover:opacity-100 transition-opacity">
                { isPlaying && currentSong?._id === song._id && songOriginId === playlist._id ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
              </Button>
              <div className="w-8 text-center text-muted-foreground flex justify-center items-center">
                { isPlaying && currentSong?._id === song._id && songOriginId === playlist._id
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" >
                    <MoreHorizontalIcon className="h-5 w-5" />
                    <span className="sr-only">More Options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40">
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add to Playlist
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-48">
                      <DropdownMenuItem>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Playlist
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {playlists.map((song, index) => (
                        <DropdownMenuItem key={index}>
                          <Music className="mr-2 h-4 w-4" />
                          {song.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Play Next</DropdownMenuItem>
                  <DropdownMenuItem>Play Later</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Heart className="mr-2 h-4 w-4" />
                    Like
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PlaylistPage;