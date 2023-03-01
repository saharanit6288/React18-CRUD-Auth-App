import './App.css';
import {Routes,Route} from 'react-router-dom';
import { Link } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import WatchList from './components/watchlist';
import Login from './components/login';
import Register from './components/register';
import AddEditWatchList from './components/addeditWatchlist';
import Category from './components/category';
import Language from './components/language';
import { Container, Row, Col } from 'react-bootstrap';
import {UserAuthContextProvider} from '../src/context/userAuthContext';
import ProtectedRoute from './components/protectedRoute';
import ProtectedNavBar from './components/protectedNavBar';

function App() {

  return (
    <UserAuthContextProvider>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>My Watchlist</Navbar.Brand>
          <ProtectedNavBar />
          {/* <Nav className="me-auto">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/addwatchlist" className="nav-link">Add Watchlist</Link>
            <Link to="/categories" className="nav-link">Categories</Link>
            <Link to="/languages" className="nav-link">Languages</Link>
          </Nav>
          <Nav>
            <UserInfoNavBar />
          </Nav> */}
        </Container>
      </Navbar>
      <Container>
          <Routes>
            <Route path='/' element={<WatchList />} />
            <Route path='/addwatchlist' 
              element={
                <ProtectedRoute>
                  <AddEditWatchList />
                </ProtectedRoute>
                } />
            <Route path='/editwatchlist/:id' 
              element={
                <ProtectedRoute>
                  <AddEditWatchList />
                </ProtectedRoute>
                } />
            <Route path='/categories' 
              element={
                <ProtectedRoute>
                  <Category />
                </ProtectedRoute>
                } />
            <Route path='/languages' 
              element={
                <ProtectedRoute>
                  <Language />
                </ProtectedRoute>
                } />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Routes>
      </Container>
    </UserAuthContextProvider>
  );
}

export default App;
