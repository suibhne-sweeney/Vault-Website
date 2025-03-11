import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { setPlaylists } from "@/state";
import { UserInterface } from "@/state/types";
import { HomeIcon, Search, Music, PlaySquare } from "lucide-react"
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const Sidebar = ({ className }: SidebarProps) => {
  const dispatch = useDispatch();
  const userId = useSelector((state: UserInterface) => state.user?._id);
  const token = useSelector((state: UserInterface) => state.token);
  const playlists = useSelector((state: UserInterface) => state.playlists) 
  const navigate = useNavigate();
  const SERVER_URI = import.meta.env.VITE_SERVER_URI;
  const likedPlaylists = useSelector((state: UserInterface) => state.likedPlaylists)

  const getPlaylists = async () => {
    const response = await fetch(`${SERVER_URI}/api/playlists/all/user/${userId}`, {
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
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Discover
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <HomeIcon className="mr-2 h-4 w-4" />
              Home
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
        <div className="py-2">
          <h2 className="relative px-7 text-lg font-semibold tracking-tight">
            Playlists
          </h2>
          <ScrollArea className=" px-1">
            <div className="space-y-1 p-2">
            <Button variant="ghost" className="w-full justify-start">
              <Music className="mr-2 h-4 w-4" />
              Liked Songs
            </Button>
              {playlists.map((playlist, i) => (
                <Button
                  key={`${playlist}-${i}`}
                  variant="ghost"
                  className="w-full justify-start font-normal"
                  onClick={() => navigate(`/playlist/${playlist._id}`)}
                >
                  {playlist.image ? <PlaySquare className="mr-2 h-4 w-4" /> : <img src={playlist.image} alt="Playlist" className="mr-2 h-6 w-6"/>}
                  {playlist.name}
                </Button>
              ))}
              <hr />
              {likedPlaylists.map((playlist, i) => (
                <Button
                  key={`${playlist}-${i}`}
                  variant="ghost"
                  className="w-full justify-start font-normal"
                  onClick={() => navigate(`/playlist/${playlist._id}`)}
                >
                  <PlaySquare className="mr-2 h-4 w-4" />
                  {playlist.name}
                </Button>
              ))}

            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export default Sidebar