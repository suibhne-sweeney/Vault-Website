import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { PlusCircle, Music, Radio, Heart, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDispatch, useSelector } from "react-redux"
import { PlaylistInterface, UserInterface } from "@/state/types"
import { setPlaylists } from "@/state"
import { useEffect } from "react"

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
}: PlaylistArtworkProps) {
    const dispatch = useDispatch();
    const userId = useSelector((state: UserInterface) => state.user?._id);
    const token = useSelector((state: UserInterface) => state.token);
    const playlists = useSelector((state: UserInterface) => state.playlists as PlaylistInterface[]) 

    const getPlaylists = async () => {
    const response = await fetch(`http://localhost:3001/api/playlists/all/user/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });
  
    const data = await response.json(); // Convert the response to JSON
    dispatch(setPlaylists({playlists: data}))
  };
  useEffect(() => {
    getPlaylists();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) 
  return (
    <div className={cn("space-y-3", className)}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className={`overflow-hidden ${aspectRatio === 'portrait' ? "rounded-md" : "rounded-full"}`} >
            <img
              src={playlist.image}
              alt={`${playlist.name} by ${playlist.name}`}
              width={width}
              height={height}
              className={cn(
                "h-auto w-auto object-cover transition-all hover:scale-105",
                aspectRatio === "portrait" ? "aspect-square" : "aspect-[4/4] "
              )}
            />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-40">
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add to Playlist
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              <ContextMenuItem>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Playlist
              </ContextMenuItem>
              <ContextMenuSeparator />
                {playlists.map((song) => 
                  <ContextMenuItem><Music className="mr-2 h-4 w-4" />
                    {song.name}
                  </ContextMenuItem>
                )}
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuItem>Play Next</ContextMenuItem>
          <ContextMenuItem>Play Later</ContextMenuItem>
          <ContextMenuItem>
            <Radio className="mr-2 h-4 w-4" />
            Create Station
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <Heart className="mr-2 h-4 w-4" />
            Like
          </ContextMenuItem>
          <ContextMenuItem>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none">{playlist.name}</h3>
        <p className="text-xs text-muted-foreground">{playlist.user.firstName}</p>
      </div>
    </div>
  )
}
