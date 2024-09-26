import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { setPlaylists } from "@/state";
import { UserInterface } from "@/state/types";
import { Play, LayoutGrid, Radio, ListMusic, Mic2, Music, Users, Disc, PlaySquare } from "lucide-react"
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

interface Playlist {
  _id: string;           
  name: string;          
  description: string;    
  user: string;           
  image: string;         
  songs: string[];        
  visibility: "public" | "private"; 
  likes: Record<string, boolean>;  
  createdAt: string;      
  updatedAt: string;      
  __v: number;            
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const Sidebar = ({ className }: SidebarProps) => {
  const dispatch = useDispatch();
  const userId = useSelector((state: UserInterface) => state.user?._id);
  const token = useSelector((state: UserInterface) => state.token);
  const playlists = useSelector((state: UserInterface) => state.playlists as Playlist[]) 
  const navigate = useNavigate();

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
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Discover
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <Play className="mr-2 h-4 w-4" />
              Listen Now
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Browse
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Radio className="mr-2 h-4 w-4" />
              Radio
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Library
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <ListMusic className="mr-2 h-4 w-4" />
              Playlists
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Music className="mr-2 h-4 w-4" />
              Songs
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Made for You
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Mic2 className="mr-2 h-4 w-4" />
              Artists
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Disc className="mr-2 h-4 w-4" />
              Albums
            </Button>
          </div>
        </div>
        <div className="py-2">
          <h2 className="relative px-7 text-lg font-semibold tracking-tight">
            Playlists
          </h2>
          <ScrollArea className="h-[300px] px-1">
            <div className="space-y-1 p-2">
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
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export default Sidebar