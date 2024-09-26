import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlayIcon, ShuffleIcon, MoreHorizontalIcon } from "lucide-react"
import Layout from "../layout/layout"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { PlaylistInterface, UserInterface } from "@/state/types"
import { useEffect, useState } from "react"


const PlaylistPage = () => {
  const { id } = useParams();
  const userId = useSelector((state: UserInterface) => state.user?._id);
  const token = useSelector((state: UserInterface) => state.token);
  const [playlist, setPlaylist] = useState<PlaylistInterface | null>(null); // you use this when you want to use data from the api but cant use dispatch and then one of the states i have in local storage
  const [loading, setLoading] = useState(true);  // Loading state

  const getPlaylist = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/playlists/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setPlaylist(data);  // Update state with fetched data
    } catch (error) {
      console.log("Error fetching playlist:", error);
    } finally {
      setLoading(false);  // Stop loading when data is fetched
    }
  }

  useEffect(() => {
    getPlaylist();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token])
  
  if(loading) return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
      </div>
      <p className="mt-2">Loading...</p>
    </div>
  )

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
                <h1 className="text-3xl font-bold mb-2">{playlist?.name}</h1>
                <p className="text-muted-foreground mb-4">{playlist?.description}</p>
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
              <div className="space-y-4 mr-4">
                {playlist?.songs.map((song, index) => (
                  <div key={song._id} className="flex items-center gap-4 group">
                    <div className="w-8 text-center text-muted-foreground">{index + 1}</div>
                    <img
                        alt={`${song.image} cover`}
                        className="rounded object-cover w-12 h-12"
                        height="48"
                        src="/placeholder.svg?height=48&width=48"
                        width="48"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{song.name}</div> {/* this is for song name */}
                      <div className="text-sm text-muted-foreground truncate">{song.artist}</div> {/*  name */}
                    </div>
                    <div className="text-sm text-muted-foreground hidden md:block truncate">idk</div> {/* this is for what playlist or albumn the song came from */}
                    <div className="text-sm text-muted-foreground">0.00</div>
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