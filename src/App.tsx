import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom"
import HomePage from "./scenes/homePage"
import LoginPage from "./scenes/loginPage"
import ProfilePage from "./scenes/profilePage"
import { ThemeProvider } from "./context/theme-provider"
import { useSelector } from "react-redux"
import { UserInterface } from "./state/types"
import PlaylistPage from "./scenes/playlistPage"
import Layout from "./scenes/layout/layout"
import { PlayerProvider } from "./context/player-provider"
import LikedSongsPage from "./scenes/likedSongs"
import SearchPage from "./scenes/searchPage"

function App() {
  const isAuth = Boolean(useSelector((state: UserInterface) => state.token))

  return (
    <ThemeProvider>
      <PlayerProvider>
        <div className='app'>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route element={ isAuth ? (
                    <Layout>
                      <Outlet />
                    </Layout>
                  ) : (
                    <Navigate to="/" />
                  )
                }>
                <Route path="/home" element={<HomePage />} />
                <Route path="/profile/:userId" element={<ProfilePage />} />
                <Route path="/playlist/:id" element={<PlaylistPage />} />
                <Route path="/liked-songs" element={<LikedSongsPage />} />
                <Route path="/search" element={<SearchPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </div>
      </PlayerProvider>
    </ThemeProvider>
  )
}

export default App

