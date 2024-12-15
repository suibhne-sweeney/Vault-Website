import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlaylistArtwork } from "@/components/ui/playlist-artwork"
import { Separator } from "@/components/ui/separator"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const playlists = [
  {
    name: "React Rendezvous",
    artist: "Ethan Byte",
    cover: `https://www.billboard.com/wp-content/uploads/2023/07/asap-rocky-long-live-asap-2013-billboard-1240.jpg?w=768`
  },
  {
    name: "Async Awakenings",
    artist: "Nina Netcode",
    cover: `https://www.billboard.com/wp-content/uploads/media/ariana-grande-sweetner-album-art-2018-billboard-1240.jpg?w=768`
  },
  {
    name: "The Art of Reusability",
    artist: "Lena Logic",
    cover: "https://www.billboard.com/wp-content/uploads/2022/03/20.-Joy-Division-‘Unknown-Pleasures-1979-album-art-billboard-1240.jpg?w=768"
  },
  {
    name: "Stateful Symphonies",
    artist: "Beth Binary",
    cover: "https://www.billboard.com/wp-content/uploads/2022/03/19.-Judas-Priest-‘British-Steel-1980-album-art-billboard-1240.jpg?w=775"
  },
]

const HomePage = () => {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <Tabs defaultValue="music" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="music" className="relative">
              Music
            </TabsTrigger>
            <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
            <TabsTrigger value="live" disabled>
              Live
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent
          value="music"
          className="border-none p-0 outline-none"
        >
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Listen Now
            </h2>
            <p className="text-sm text-muted-foreground">
              Top picks for you. Updated daily.
            </p>
          </div>
          <Separator className="my-4" />
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-4 pb-4">
              {playlists.map((playlist) => (
                <PlaylistArtwork
                  key={playlist.name}
                  playlist={playlist}
                  className="w-[150px] md:w-[200px]"
                  aspectRatio="portrait"
                  width={250}
                  height={330}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <div className="mt-6 space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Made for You
            </h2>
            <p className="text-sm text-muted-foreground">
              Your personal playlists. Updated daily.
            </p>
          </div>
          <Separator className="my-4" />
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-4 pb-4">
              {playlists.slice(0, 4).map((playlist) => (
                <PlaylistArtwork
                  key={playlist.name}
                  playlist={playlist}
                  className="w-[120px] md:w-[150px]"
                  aspectRatio="round"
                  width={150}
                  height={150}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </TabsContent>
        <TabsContent
          value="podcasts"
          className="h-full flex-col border-none p-0 data-[state=active]:flex"
        >
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              New Episodes
            </h2>
            <p className="text-sm text-muted-foreground">
              Your favorite podcasts. Updated daily.
            </p>
          </div>
          <Separator className="my-4" />
          {/* Add podcast content here */}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default HomePage

