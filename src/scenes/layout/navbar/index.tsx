import { setLogout } from "@/state";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserInterface } from "@/state/types";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, User, LogOut } from 'lucide-react';
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
import { useTheme } from "@/context/theme-provider";
import { KeyboardShortcutsModal } from "@/scenes/widgets/keyboard-shortcuts";

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state: UserInterface) => state.user);
    const SERVER_URI = import.meta.env.VITE_SERVER_URI;
    const fullName = `${user?.firstName} ${user?.lastName}`
    const { theme, setTheme } = useTheme();

    return (
        <nav className="w-full flex justify-between items-center p-4 z-10">
            <p className="absolute" accessKey="m" onClick={() => theme === "dark" ? setTheme("light") : setTheme("dark")}/>
            <div className="flex items-center gap-1">
              <Button className="mx-1" variant={"outline"} size={"icon"} onClick={() => navigate(-1)}><ChevronLeft/></Button>
              <Button className="mx-1" variant={"outline"} size={"icon"} onClick={() => navigate(1)}><ChevronRight/></Button>
            </div>
            <div className="flex items-center gap-2">
            <Badge variant={"default"}>
              <a 
                href={`${SERVER_URI}/assets/release.zip`} 
                download 
                className="flex items-center"
              >
                <Download className="h-[16px] w-[16px] inline-block mr-2" />
                Install App
              </a>
            </Badge>
              <ModeToggle/>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar><AvatarImage src={`${SERVER_URI}/assets/${user?.picturePath}`} alt="@shadcn" /><AvatarFallback>CN</AvatarFallback></Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>{fullName}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(`/profile/${user?._id}`)}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <KeyboardShortcutsModal />
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