import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Heart, MoreHorizontal, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume2, VolumeOff } from 'lucide-react'
import { UserInterface } from "@/state/types"
import { useToast } from "@/hooks/use-toast";
import { usePlayer } from "@/context/player-provider"

const  PlayBar = () => {
  const loggedInUserId = useSelector((state: UserInterface) => state.user?._id)
  const token = useSelector((state: UserInterface) => state.token)
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(66);
  const [isLooping, setIsLooping] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast()
  const { 
    currentSong, 
    setCurrentSong, 
    setIsPlaying, 
    queue, 
    isPlaying  
  } = usePlayer();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const SERVER_URI = import.meta.env.VITE_SERVER_URI;

  useEffect(() => {
    if (currentSong && loggedInUserId) {
      setLikes(currentSong.likes);
      setIsLiked(Boolean(likes[loggedInUserId]));
    } else {
      setIsLiked(false);
    }
  }, [currentSong, likes, loggedInUserId]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handelSongLike = async () => {
    const response = await fetch(`${SERVER_URI}/api/songs/like/${currentSong?._id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({userId: loggedInUserId})
    });
    const data = await response.json();

    if(data){
      setLikes(data.likes)
      setIsLiked(Boolean(data.likes[loggedInUserId ?? ""]));
    }else{
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      })
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleSongEnd = async () => {
    const currentIndex = queue.findIndex((song) => song._id === currentSong?._id);
    const nextSong = queue[(currentIndex + 1) % queue.length];
    
    if (audioRef.current) {
      setCurrentSong(nextSong);
      audioRef.current.load();
      
      const playAudio = () => {
        audioRef.current?.play();
        setIsPlaying(true);
        audioRef.current?.removeEventListener("canplaythrough", playAudio);
      };

      audioRef.current.addEventListener("canplaythrough", playAudio);
    }
  };


  const handleForwardBackward = async (direction: string) => {
    const currentIndex = queue.findIndex((song) => song._id === currentSong?._id);
    if(direction === "forward" && currentIndex + 1 < queue.length) {
      const nextSong = queue[(currentIndex + 1) % queue.length]
      await setCurrentSong(nextSong);
    }
    if(direction === "backward" && currentIndex - 1 >= 0){
      const prevSong = queue[(currentIndex - 1) % queue.length]
      await setCurrentSong(prevSong)
    } 
    await audioRef.current?.play()
    await setIsPlaying(true)
  }

  const handleSliderChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const toggleLoop = () => {
    if (audioRef.current) {
      audioRef.current.loop = !isLooping;
      setIsLooping(!isLooping);
    }
  };

  const toggleMute = () => {
    if(audioRef.current){
      audioRef.current.muted = !isMute;
      setIsMute(!isMute);
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="bg-background border-t">
      <div className="container flex items-center h-20">
        {/* Album art and song info */}
        <div className="flex items-center space-x-4 w-1/4">
          <img
            src={`${SERVER_URI}/assets/${currentSong?.image}`}
            alt="Album cover"
            className="w-12 h-12 rounded-md"
          />
          <div>
            <h4 className="text-sm font-semibold">{currentSong?.name}</h4>
            <p className="text-xs text-muted-foreground">{currentSong?.artistName}</p>
          </div>
          <Button onClick={handelSongLike} variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            {isLiked ? <Heart className="h-4 w-4 fill-current" /> : <Heart className="h-4 w-4" />}
          </Button>
        </div>

        {/* playback controls */}
        <div className="flex flex-col items-center w-1/2">
          <div className="flex items-center space-x-4 mb-1">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button onClick={() => handleForwardBackward("backward")} variant="ghost" size="icon">
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button onClick={() => setIsPlaying(!isPlaying)} size="icon" className="bg-primary text-primary-foreground hover:bg-primary/20">
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button onClick={() => handleForwardBackward("forward")} variant="ghost" size="icon">
              <SkipForward className="h-5 w-5" />
            </Button>
            <Button onClick={toggleLoop} variant="ghost" size="icon" className={`text-muted-foreground hover:text-primary ${isLooping ? 'text-primary' : ''}`}>
              <Repeat className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2 w-full max-w-md">
            <span className="text-xs text-muted-foreground">{formatTime(currentTime)}</span>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              className="w-full"
              onValueChange={handleSliderChange}
            />
            <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
          </div>
        </div>

        {/* audio controls */}
        <div className="flex items-center justify-end space-x-4 w-1/4">
          <Button onClick={toggleMute} variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            {isMute ? <VolumeOff className="h-4 w-4"/> : <Volume2 className="h-4 w-4" /> }
          </Button>
          <Slider
            value={isMute ? [0] : [volume]}
            max={100}
            step={1}
            className="w-24"
            onValueChange={(value) => setVolume(value[0])}
          />
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <audio
        preload="auto"
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleSongEnd}
        src={`${SERVER_URI}/assets/${currentSong?.song}`}
      />
    </div> 
  )
}

export default PlayBar;

