import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlaylistArtwork } from "@/components/ui/playlist-artwork"
import { Separator } from "@/components/ui/separator"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useSelector } from "react-redux"
import { PlaylistInterface, UserDetail, UserInterface } from "@/state/types"
import { useEffect, useState } from "react"
import ProfilePicture from "../widgets/profile-picture"

const HomePage = () => {
  const userId = useSelector((state: UserInterface) => state.user?._id);
  const token = useSelector((state: UserInterface) => state.token);
  const [playlists, setPlaylists] = useState<PlaylistInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const SERVER_URI = import.meta.env.VITE_SERVER_URI;
  const [users, setUsers] = useState<UserDetail[]>([])
  const setPageTitle = async () => {
    document.title = `Vault`
  }

  const getUsers = async () => {
    const response = await fetch(`${SERVER_URI}/api/users/all`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` } 
    })

    const data = await response.json();
    if(data) setUsers(data);

  }

  const getPlaylists = async () => {
    const response = await fetch(`${SERVER_URI}/api/playlists/all/user/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });
  
    const data = await response.json(); // convert the response to JSON
    setPlaylists(data);
  };

  useEffect(() => {
    getPlaylists();
    getUsers();
    setIsLoading(false);
    setPageTitle()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isLoading){
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
                  key={playlist._id}
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
            Top Artists
            </h2>
            <p className="text-sm text-muted-foreground">
              We pick only the best.
            </p>
          </div>
          <Separator className="my-4" />
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-4 pb-4">
              {users.map((user) => (
                user.userType === "artist" && (
                  <ProfilePicture 
                    key={user._id}
                    profile={user} 
                    width={200}
                    height={200}
                    className="w-[150px] md:w-[200px]"
                    aspectRatio="round"
                  />
              )))}
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
              Hey looks pretty empty.
            </h2>
            <p className="text-sm text-muted-foreground">
              Podcasts will be coming soon.
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

