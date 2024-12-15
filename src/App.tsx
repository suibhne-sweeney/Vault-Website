import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom"
import HomePage from "./scenes/homePage"
import LoginPage from "./scenes/loginPage"
import ProfilePage from "./scenes/profilePage"
import { ThemeProvider } from "./components/theme-provider"
import { useSelector } from "react-redux"
import { UserInterface } from "./state/types"
import PlaylistPage from "./scenes/playlistPage"
import SongPage from "./scenes/songPage"
import Layout from "./scenes/layout/layout"

function App() {
  const isAuth = Boolean(useSelector((state: UserInterface) => state.token))

  return (
    <ThemeProvider>
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
              <Route path="/song/:songId" element={<SongPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  )
}

export default App

