import { cn } from "@/lib/utils";

const SoundWave = (props: {className: string}) => {
  const {className} = props;
  return (
    <div className={cn(
      "soundwave-container", 
      className
    )}>
      <div className="bar bg-black dark:bg-white"></div>
      <div className="bar bg-black dark:bg-white"></div>
      <div className="bar bg-black dark:bg-white"></div>
      <div className="bar bg-black dark:bg-white"></div>
    </div>
  )
}

export default SoundWave;