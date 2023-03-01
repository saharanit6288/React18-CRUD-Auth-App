import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { Link } from "react-router-dom";
import { useUserAuth } from '../context/userAuthContext';

const ProtectedNavBar = () => {
    const {user,logout} = useUserAuth();

    const handleSignout = async () => {
        try {
            await logout();
        }
        catch(err) {
            console.log(err.message);
        }
    }

    return (
        <>
            <Nav className="me-auto">
              <Link to="/" className="nav-link">Home</Link>
              {user && (
                <>
                  <Link to="/addwatchlist" className="nav-link">Add Watchlist</Link>
                  <Link to="/categories" className="nav-link">Categories</Link>
                  <Link to="/languages" className="nav-link">Languages</Link>
                </>
              )}
            </Nav>
            <Nav>
              {user ? (
                <>
                  <Link to="javascript:void(0)" className="nav-link">Welcome, {user.email}</Link>
                  <Link to="javascript:void(0)" className="nav-link"
                      onClick={handleSignout}>Logout</Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-link">Login</Link>
                  <Link to="/register" className="nav-link">Register</Link>
                </>
              )}
            </Nav>
        </>
    )
}

export default ProtectedNavBar;