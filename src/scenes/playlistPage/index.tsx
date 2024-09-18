import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlayIcon, ShuffleIcon, MoreHorizontalIcon } from "lucide-react"
import Layout from "../layout/layout"

const playlistSongs = [
  { id: 1, title: "Midnight Serenade", artist: "Luna Skye", album: "Nocturnal Whispers", duration: "3:45" },
  { id: 2, title: "Neon Dreams", artist: "Cyber Punk", album: "Digital Horizons", duration: "4:20" },
  { id: 3, title: "Echoes of You", artist: "The Resonants", album: "Harmonic Memories", duration: "3:56" },
  { id: 4, title: "Stellar Journey", artist: "Cosmic Voyagers", album: "Interstellar Odyssey", duration: "5:12" },
  { id: 5, title: "Rainy Day Blues", artist: "Melancholy Melodies", album: "Urban Reflections", duration: "4:08" },
  { id: 6, title: "Electric Pulse", artist: "Voltage", album: "Circuit Breaker", duration: "3:30" },
  { id: 7, title: "Whispers in the Wind", artist: "Nature's Voice", album: "Organic Rhythms", duration: "4:45" },
  { id: 8, title: "Retro Groove", artist: "Vintage Vibes", album: "Throwback Thursdays", duration: "3:22" },
  { id: 9, title: "Sunset Serenade", artist: "Horizon's Edge", album: "Twilight Tales", duration: "4:17" },
  { id: 10, title: "Urban Jungle", artist: "City Sounds", album: "Concrete Jungle", duration: "3:59" },
]

const PlaylistPage = () => {
  return (
    <Layout>
      <div className="flex flex-col h-[100%] bg-background overflow-y-hidden ">
        <div className="flex-1 overflow-auto">
          <div className="mx-auto py-6 px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                <img
                alt="Playlist cover"
                className="rounded-lg object-cover w-48 h-48 md:w-64 md:h-64"
                height="256"
                src="https://www.billboard.com/wp-content/uploads/2023/07/asap-rocky-long-live-asap-2013-billboard-1240.jpg?w=768"
                width="256"
              />
              <div className="flex flex-col items-center md:items-start">
                <h1 className="text-3xl font-bold mb-2">My Awesome Playlist</h1>
                <p className="text-muted-foreground mb-4">Created by Music Lover</p>
                <div className="flex items-center gap-4">
                  <Button size="lg" className="rounded-full">
                    <PlayIcon className="mr-2 h-5 w-5" />
                    Play
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <ShuffleIcon className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
            <ScrollArea className="h-[calc(100vh-24rem)]">
              <div className="space-y-4">
                {playlistSongs.map((song, index) => (
                  <div key={song.id} className="flex items-center gap-4 group">
                    <div className="w-8 text-center text-muted-foreground">{index + 1}</div>
                    <img
                        alt={`${song.album} cover`}
                        className="rounded object-cover w-12 h-12"
                        height="48"
                        src="/placeholder.svg?height=48&width=48"
                        width="48"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{song.title}</div>
                      <div className="text-sm text-muted-foreground truncate">{song.artist}</div>
                    </div>
                    <div className="text-sm text-muted-foreground hidden md:block truncate">{song.album}</div>
                    <div className="text-sm text-muted-foreground">{song.duration}</div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <MoreHorizontalIcon className="h-5 w-5" />
                        <span className="sr-only">More options</span>
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default PlaylistPage;