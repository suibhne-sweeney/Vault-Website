import { Button } from "@/components/ui/button";
import { UserInterface, SongInterface } from "@/state/types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const SongPage = () => { 
  const { songId } = useParams();
  const token = useSelector((state: UserInterface) => state.token);
  const [song, setSong] = useState<SongInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const SERVER_URI = import.meta.env.VITE_SERVER_URI;


  const getSong = async () => {
    try {
      const response = await fetch(`${SERVER_URI}/api/songs/${songId}`, {
        method: "GET",
        headers: {Authorization: `Bearer ${token}`},
      });
      const data = await response.json();
      setSong(data);
    } catch (error) {
      console.log("Error fetching song:", error)
      
    }finally{
      setLoading(false);
    }
  }
  

  useEffect(() => {
    getSong();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songId])

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
  return (
    <div>
      
    </div>
  )
}

export default SongPage;