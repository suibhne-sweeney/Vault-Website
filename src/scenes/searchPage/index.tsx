import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlaylistInterface, UserInterface } from "@/state/types"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [allPlaylists, setAllPlaylists] = useState<PlaylistInterface[]>([]) // Full data from API
  const [filteredPlaylists, setFilteredPlaylists] = useState<PlaylistInterface[]>([])
  const SERVER_URI = import.meta.env.VITE_SERVER_URI;
  const token = useSelector((state: UserInterface) => state.token);
  const navigate = useNavigate();

  const fetchPlaylists = async () => {
    const response = await fetch(`${SERVER_URI}/api/playlists/all`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await response.json();
    console.log(data);
    if(data) {
      setAllPlaylists(data)
      setFilteredPlaylists(data)
    }
  }

  useEffect(() => {
    fetchPlaylists()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  // Filter and sort playlists whenever searchTerm or sortBy changes
  useEffect(() => {
    let results = allPlaylists.filter(
      (playlist) =>
        playlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        playlist.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    results = results.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      } else if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else if (sortBy === "songs") {
        return b.songs.length - a.songs.length
      }
      return 0
    })

    setFilteredPlaylists(results)
  }, [searchTerm, sortBy, allPlaylists])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Playlists</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder="Search by name, description, or creator..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="w-full md:w-48">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="songs">Most Songs</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredPlaylists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaylists.map((playlist) => (
            <Card key={playlist._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{playlist.name}</CardTitle>
                <CardDescription>Visibility: {playlist.visibility}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{playlist.description}</p>
                <p className="text-sm mt-2 font-medium">{playlist.songs.length} songs</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-xs text-muted-foreground">{new Date(playlist.createdAt).toLocaleDateString()}</p>
                <Button onClick={() => navigate(`/playlist/${playlist._id}`)} variant="outline" size="sm">
                  View Playlist
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No playlists found</h3>
          <p className="text-muted-foreground">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  )
}
