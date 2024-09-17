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

interface PlaylistArtworkProps {
  playlist: {
    name: string
    artist: string
    cover: string
  }
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
  return (
    <div className={cn("space-y-3", className)}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className={`overflow-hidden ${aspectRatio === 'portrait' ? "rounded-md" : "rounded-full"}`} >
            <img
              src={playlist.cover}
              alt={`${playlist.name} by ${playlist.artist}`}
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
          <ContextMenuItem>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add to Library
          </ContextMenuItem>
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
              <ContextMenuItem>
                <Music className="mr-2 h-4 w-4" />
                My Playlist
              </ContextMenuItem>
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
        <p className="text-xs text-muted-foreground">{playlist.artist}</p>
      </div>
    </div>
  )
}
