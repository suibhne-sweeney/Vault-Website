import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import HomePage from "./scenes/homePage";
import LoginPage from "./scenes/loginPage";
import ProfilePage from "./scenes/profilePage";
import { ThemeProvider } from "./components/theme-provider";
import { useSelector } from "react-redux";
import { UserInterface } from "./state/types";



function App() {
  const isAuth = Boolean(useSelector((state: UserInterface) => state.token))
  return ( 
    <ThemeProvider>
      <div className='app'>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to="/" />} />
            <Route path="/profile/:userId" element={isAuth ? <ProfilePage /> : <Navigate to="/" />}  />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  )
}

export default App
