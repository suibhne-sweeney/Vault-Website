import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SongInterface, UserInterface } from "@/state/types";
import { setQueueState } from "@/state";

interface PlayerContextInterface {
  queue: SongInterface[];
  currentSong: SongInterface | null;
  songOriginId: string | null;
  isPlaying: boolean;
  setQueue: React.Dispatch<React.SetStateAction<SongInterface[]>>;
  setCurrentSong: React.Dispatch<React.SetStateAction<SongInterface | null>>;
  setSongOriginId: React.Dispatch<React.SetStateAction<string | null>>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

const PlayerProviderContext = createContext<PlayerContextInterface | null>(null);

export const PlayerProvider = (props: {children: ReactNode}) => {
  const { children } = props
  const dispatch = useDispatch();
  const stateQueue = useSelector((state: UserInterface) => state.queue);
  const stateCurrentSong = useSelector((state: UserInterface) => state.currentSong);
  const stateSongOriginId = useSelector((state: UserInterface) => state.songOriginId);

  const [queue, setQueue] = useState<SongInterface[]>(stateQueue || []);
  const [currentSong, setCurrentSong] = useState<SongInterface | null>(stateCurrentSong || null);
  const [songOriginId, setSongOriginId] = useState<string | null>(stateSongOriginId || null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    dispatch(setQueueState({
      queue: queue, 
      currentSong: currentSong, 
      songOriginId: songOriginId
    }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, currentSong, songOriginId])

  return (
    <PlayerProviderContext.Provider
      value={{
        queue,
        currentSong,
        songOriginId,
        isPlaying,
        setQueue,
        setCurrentSong,
        setSongOriginId,
        setIsPlaying,
      }}
    >
      {children}
    </PlayerProviderContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePlayer = () => {
  const context = useContext(PlayerProviderContext);
  if (!context) 
    throw new Error("usePlayer must be used within a PlayerProvider");
  return context;
};
