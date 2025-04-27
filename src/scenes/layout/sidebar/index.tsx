import { Button } from "@/components/ui/button"
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
  const playlists = useSelector((state: UserInterface) => state.playlists);
  const likedPlaylists = useSelector((state: UserInterface) => state.likedPlaylists);
  const navigate = useNavigate();
  const SERVER_URI = import.meta.env.VITE_SERVER_URI;

  const getPlaylists = async () => {
    const response = await fetch(`${SERVER_URI}/api/playlists/all/user/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });
  
    const data = await response.json();
    dispatch(setPlaylists({ playlists: data }));
  };

  useEffect(() => {
    getPlaylists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn("flex flex-col h-full pb-12", className)}>
      <div className="flex-shrink-0 space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Discover
          </h2>
          <div className="space-y-1">
            <Button onClick={() => navigate("/home")} variant="ghost" className="w-full justify-start">
              <HomeIcon className="mr-2 h-4 w-4" />
              Home
            </Button>
            <Button onClick={() => navigate("/search")} variant="ghost" className="w-full justify-start">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="py-2">
          <h2 className="relative px-7 text-lg font-semibold tracking-tight">
            Playlists
          </h2>
          <div className="space-y-1 p-2 ">
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/liked-songs")}>
              <Music className="mr-2 h-4 w-4" />
              Liked Songs
            </Button>
            {playlists.map((playlist, i) => (
              <Button
                key={`${playlist._id}-${i}`}
                variant="ghost"
                className="w-full justify-start font-normal"
                onClick={() => navigate(`/playlist/${playlist._id}`)}
              >
                {playlist.image
                  ? <img src={`${SERVER_URI}/assets/${playlist.image}`} alt="Playlist" className="mr-2 h-6 w-6 rounded-sm" />
                  : <PlaySquare className="mr-2 h-4 w-4" />}
                {playlist.name}
              </Button>
            ))}
            <hr />
            {likedPlaylists.map((playlist, i) => (
              <Button
                key={`${playlist._id}-${i}`}
                variant="ghost"
                className="w-full justify-start font-normal"
                onClick={() => navigate(`/playlist/${playlist._id}`)}
              >
                {playlist.image
                  ? <img src={`${SERVER_URI}/assets/${playlist.image}`} alt="Playlist" className="mr-2 h-6 w-6 rounded-sm" />
                  : <PlaySquare className="mr-2 h-4 w-4" />}
                {playlist.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
