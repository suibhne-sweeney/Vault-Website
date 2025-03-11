import { Heart, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDispatch, useSelector } from "react-redux"
import { PlaylistInterface, UserInterface } from "@/state/types"
import { useEffect, useState } from "react"
import { Button } from "./button"
import { setLikedPlaylists } from "@/state"

interface PlaylistArtworkProps {
  playlist: PlaylistInterface,
  aspectRatio?: "portrait" | "round"
  width?: number
  height?: number
  className?: string
}

export function PlaylistArtwork({
  playlist,
  aspectRatio = "round",
  width,
  height,
  className,
} : PlaylistArtworkProps) {
  const userLoggedInId = useSelector((state: UserInterface) => state.user?._id);
  const token = useSelector((state: UserInterface) => state.token);
  const likedPlaylists = useSelector((state: UserInterface) => state.likedPlaylists) 
  const SERVER_URI = import.meta.env.VITE_SERVER_URI;
  const [isChanged, setIsChanged] = useState(0);
  const dispatch = useDispatch();

  const getLikedPlaylists = async () => {
    const response = await fetch(`${SERVER_URI}/api/playlists/liked/${userLoggedInId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await response.json();
    dispatch(setLikedPlaylists({likedPlaylists: data}))

  }

  const handelSongLike = async () => {
    const response = await fetch(`${SERVER_URI}/api/playlists/like/${playlist._id}`,{
      method: "PATCH",
      body: JSON.stringify({ userId: userLoggedInId }),
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })

    const data = await response.json();
    if(data) setIsChanged(isChanged + 1);

  }

  useEffect(() => {
    getLikedPlaylists();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChanged])
  
  return (
    <div className={cn("space-y-3", className)}>
      <div className={`overflow-hidden ${aspectRatio === 'portrait' ? "rounded-md" : "rounded-full"}`} >
        <img
          src={"https://www.afrocharts.com/images/song_cover-500x500.png"}
          alt={`${playlist.name} by ${playlist.name}`}
          width={width}
          height={height}
          className={cn(
            "h-auto w-auto object-cover transition-all hover:scale-105",
            aspectRatio === "portrait" ? "aspect-square" : "aspect-[4/4] "
          )}
        />
      </div>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none">{playlist.name}</h3>
        <div className="flex justify-between">
          <p className="text-xs text-muted-foreground my-1">{playlist.user.firstName}</p>
          <span className="flex">
            <Button onClick={() => handelSongLike()} variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              { likedPlaylists.some((likedPlaylist) => { 
                return likedPlaylist._id === playlist._id
              }) ? <Heart className="fill-current h-4 w-4" /> : <Heart className="h-4 w-4" /> }
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              {<Share2 className="h-4 w-4" />}
            </Button>
          </span>
        </div>
      </div>
    </div>
  )
}
