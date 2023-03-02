import './App.css';
import Navbar from 'react-bootstrap/Navbar';
import { Container } from 'react-bootstrap';
import {UserAuthContextProvider} from '../src/context/userAuthContext';
import ProtectedNavBar from './components/protectedNavBar';
import AppRoutes from './routes';

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
          <AppRoutes />
      </Container>
    </UserAuthContextProvider>
  );
}

export default App;
