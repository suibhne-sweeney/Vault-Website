import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PlaylistArtwork } from "@/components/ui/playlist-artwork";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { UserDetail, UserInterface } from "@/state/types";
import { Dot, Link, MoreHorizontalIcon, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import SongForm from "./FormSongUpload";
import { useToast } from "@/hooks/use-toast";
import { setFollowers, setFollowing } from "@/state";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { toast } = useToast()
  const navigate = useNavigate();
  const { userId } = useParams();
  const token = useSelector((state: UserInterface) => state.token);
  const accountUser = useSelector((state: UserInterface) => state.user)
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowingProfile] = useState<UserDetail[] | null>(null);
  const [followers, setFollowersProfile] = useState<UserDetail[] | null>(null);
  const isArtist = user?.userType !== "artist"; // this is some backwards logic just for testing dont actaully keep this
  const isUsersAccount = accountUser?._id === userId;
  const SERVER_URI = import.meta.env.VITE_SERVER_URI;


  const getUser = async () => {
    const response = await fetch(`${SERVER_URI}/api/users/${userId}`, {
      method: "GET",
      headers: {Authorization: `Bearer ${token}`}
    })
    const data = await response.json();
    setUser(data);
  }

  const getProfilesFollowing = async () => {
    const response = await fetch(`${SERVER_URI}/api/users/following/${userId}`, {
      method: "GET",
      headers: {Authorization: `Bearer ${token}`}
    })
    const data = await response.json();
    if(isUsersAccount) await dispatch(setFollowing({following: data}));
    setFollowingProfile(data);
  } 

  const getProfilesFollowers = async () => {
    const response = await fetch(`${SERVER_URI}/api/users/followers/${userId}`, {
      method: "GET",
      headers: {Authorization: `Bearer ${token}`}
    })
    const data = await response.json();
    if(isUsersAccount) await dispatch(setFollowers({followers: data}));
    setFollowersProfile(data);
  }

  const setPageTitle = async () => {
    document.title = `Profile - ${user?.firstName} ${user?.lastName}`
  }
  

  useEffect(() => {
    getUser();
    getProfilesFollowing();
    getProfilesFollowers();
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  if(loading){
    return (
      <div className="flex flex-col min-h-screen justify-center items-center">
        <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
        <p className="mt-2">Loading...</p>
      </div>
    )
  }

  if(!loading){
    setPageTitle()
  }

  return (
    <div className="mx-auto py-6 px-6 h-full">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <div className="relative">
          <img
            alt="Profile Picture"
            className="rounded-full object-cover w-48 h-48 md:w-64 md:h-64"
            height="256"
            src={`${SERVER_URI}/assets/${user?.picturePath}`}
            width="256"
            id="profile-image"
          />
        </div>
        <div className="flex flex-col items-center md:items-start">
          <h1 className="text-3xl font-bold mb-2">{user?.firstName} {user?.lastName}</h1>
          <p className="flex items-center text-muted-foreground mb-4"> 
            {user?.playlists.length} Public Playlists <Dot className="h-5 w-5" /> {user?.followers.length} Followers <Dot className="h-5 w-5" /> {user?.following.length} Following
          </p>
          <div className="flex items-center gap-4">
            {(isArtist && isUsersAccount )&& (
              <Dialog>
                <DialogTrigger><Button size="lg" className="rounded-full">Upload Song</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Song</DialogTitle>
                    <DialogDescription>
                      Let's get some music into the world!
                    </DialogDescription>
                    <SongForm id={`${userId}`} token={`${token}`}/>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            )}
            {isUsersAccount && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" >
                    <MoreHorizontalIcon className="h-5 w-5" />
                    <span className="sr-only">More Options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>More Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer">
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Edit Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => {
                      navigator.clipboard.writeText(window.location.href)
                      toast({
                        title: "Copied!",
                        description: "Profile copied to clipboard.",
                      })
                    }}>
                      <Link className="mr-2 h-4 w-4" />
                      <span>Copy Link to Profile</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
      <div className="custom-scrollbar overflow-y-scroll max-h-full flex-grow h-[calc(96%-250px)]">
        <div className="space-y-4 mr-4">
          <div className=" text-xl">Public Playlists</div>
          {user?.playlists.length === 0
            ? (
              <p>No Playlists.</p>
            )
            : (
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex space-x-4 pb-4">
                  {user?.playlists.slice(0, 5).map((playlist) => (
                    playlist.visibility === "public" && (
                      <div onClick={() => navigate(`/playlist/${playlist._id}`)}>
                        <PlaylistArtwork
                          key={playlist.name}
                          playlist={playlist}
                          className="w-[150px] md:w-[200px] cursor-pointer"
                          aspectRatio="portrait"
                          width={200}
                          height={200}
                        />
                      </div>
                  )))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            )
          
          }
          <Separator className="my-4" />
          <div className=" text-xl">Following</div>
          {user?.following.length === 0
            ? (
              <p>No Following</p>
            )
            : (
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex space-x-4 pb-4">
                  {following?.map((user) => (
                    <div className=" cursor-pointer" onClick={() => navigate(`/profile/${user._id}`)}>
                      <img className="w-[150px] md:w-[200px] rounded-full" src={`${SERVER_URI}/assets/${user?.picturePath}`} alt="Profile" />
                      <p className="font-medium leading-none text-sm">{user.firstName}</p>
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            )
          }
          <Separator className="my-4" />
          <div className=" text-xl">Followers</div>
          {user?.followers.length === 0
            ? (
              <p>No Followers</p>
            )
            : (
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex space-x-4 pb-4">
                  {followers?.map((user) => (
                    <div className=" cursor-pointer" onClick={() => navigate(`/profile/${user._id}`)}>
                      <img className="w-[150px] md:w-[200px] rounded-full" src={`http://localhost:3001/assets/${user?.picturePath}`} alt="Profile" />
                      <p className="font-medium leading-none text-sm">{user.firstName}</p>
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default ProfilePage;