import React from 'react';
import {Routes,Route} from 'react-router-dom';
import WatchList from './components/watchlist';
import Login from './components/login';
import Register from './components/register';
import AddEditWatchList from './components/addeditWatchlist';
import Category from './components/category';
import Language from './components/language';
import ErrorTemplate from './components/errorTemplate';
import ProtectedRoute from './components/protectedRoute';
import SearchWatchlist from './components/searchWatchlist';

const AppRoutes = () => {
    return (
        <>
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
                <Route path='/searchwatchlist' element={<SearchWatchlist />} />
                <Route path='/login' element={<Login />} />
                {/* <Route path='/register' element={<Register />} /> */}
                <Route path='*' element={<ErrorTemplate />} />
            </Routes>
        </>
    )
}

export default AppRoutes;