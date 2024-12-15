import { setLogout } from "@/state";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserInterface } from "@/state/types";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, User, CreditCard, Settings, Keyboard, LogOut } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state: UserInterface) => state.user);

    const fullName = `${user?.firstName} ${user?.lastName}`

    return (
        <nav className="w-full flex justify-between items-center p-4 z-10">
            <div className="flex items-center gap-1">
              <Button className="mx-1" variant={"outline"} size={"icon"} onClick={() => navigate(-1)}><ChevronLeft/></Button>
              <Button className="mx-1" variant={"outline"} size={"icon"} onClick={() => navigate(1)}><ChevronRight/></Button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={"default"} ><a href="#">Explore Premium</a></Badge>
              <Badge variant={"default"}><a href="#"><Download className="h-4 inline-block"/>Install App</a></Badge>
              <ModeToggle/>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar><AvatarImage src={`http://localhost:3001/assets/${user?.picturePath}`} alt="@shadcn" /><AvatarFallback>CN</AvatarFallback></Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>{fullName}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(`/profile/${user?._id}`)}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Billing</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Keyboard className="mr-2 h-4 w-4" />
                      <span>Keyboard shortcuts</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => dispatch(setLogout())}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
        </nav>
    )
}

export default Navbar;