import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { setFollowing } from "@/state";
import { UserDetail, UserInterface } from "@/state/types";``
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface ProiflePictureProps{
  profile: UserDetail
  aspectRatio?: "portrait" | "round"
  width?: number
  height?: number
  className?: string
}

interface FollowdContents{
  followedFollowers: UserDetail[]
  userFollowing: UserDetail[]
}

const ProfilePicture = ({
  profile,
  aspectRatio,
  width,
  height,
  className
} : ProiflePictureProps) => {
  const navigate = useNavigate();
  const SERVER_URI = import.meta.env.VITE_SERVER_URI;
  const token = useSelector((state: UserInterface) => state.token);
  const accountUserId = useSelector((state: UserInterface) => state.user?._id)
  const following = useSelector((state: UserInterface) => state.following as UserDetail[]);
  const dispatch = useDispatch();

  const handelFollow = async (props: {id: string, followdId: string}) => {
    const {id, followdId} = props;
    const response = await fetch(`${SERVER_URI}/api/users/${id}/${followdId}`,{
      method: "PATCH",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })

    const data: FollowdContents = await response.json();
    if(data) dispatch(setFollowing({following: data.userFollowing}))
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className={`overflow-hidden ${aspectRatio === 'portrait' ? "rounded-md" : "rounded-full"}`} >
        <img
          onClick={() => navigate(`/profile/${profile._id}`)}
          src={`${SERVER_URI}/assets/${profile?.picturePath}`} 
          alt="Profile"
          width={width}
          height={height}
          className={cn(
            "h-auto w-auto object-cover transition-all hover:scale-105 cursor-pointer",
            aspectRatio === "portrait" ? "aspect-square" : "aspect-[4/4] "
          )}
        />
      </div>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none">{profile.firstName}</h3>
        <div className="flex items-center">
          <p className="text-xs text-muted-foreground my-1">{}</p>
        </div>
        <Button onClick={() => handelFollow({followdId: profile._id, id: String(accountUserId)})} variant="default" size="sm" className="rounded-full">
          {following.some((followed) => { 
            return followed._id === profile._id 
          }) ? <p>Unfollow</p> : <p>Follow</p>}
        </Button>
      </div>
    </div>
  )
}

export default ProfilePicture;
