import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { 
    Heart, 
    MoreHorizontal, 
    Play, 
    Repeat, 
    Shuffle, 
    SkipBack, 
    SkipForward, 
    Volume2 
} from "lucide-react"

export default function PlayBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
      <div className="container flex items-center h-20">
        {/* Album art and song info */}
        <div className="flex items-center space-x-4 w-1/4">
          <img
            src="https://www.billboard.com/wp-content/uploads/2023/07/asap-rocky-long-live-asap-2013-billboard-1240.jpg?w=768"
            alt="Album cover"
            className="w-12 h-12 rounded-md"
          />
          <div>
            <h4 className="text-sm font-semibold">Song Title</h4>
            <p className="text-xs text-muted-foreground">Artist Name</p>
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* playback controls */}
        <div className="flex flex-col items-center w-1/2">
          <div className="flex items-center space-x-4 mb-1">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button size="icon" className="bg-primary text-primary-foreground hover:bg-primary/20">
              <Play className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <SkipForward className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <Repeat className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2 w-full max-w-md">
            <span className="text-xs text-muted-foreground">1:23</span>
            <Slider
              defaultValue={[33]}
              max={100}
              step={1}
              className="w-full"
            />
            <span className="text-xs text-muted-foreground">3:45</span>
          </div>
        </div>

        {/* audio controls */}
        <div className="flex items-center justify-end space-x-4 w-1/4">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <Volume2 className="h-4 w-4" />
          </Button>
          <Slider
            defaultValue={[66]}
            max={100}
            step={1}
            className="w-24"
          />
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div> 

  )
}