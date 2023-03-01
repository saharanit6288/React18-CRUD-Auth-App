import React, { useState, useEffect } from "react";
import { Form, Alert, Button, Table } from "react-bootstrap";
import { useUserAuth } from '../context/userAuthContext';
import WatchlistService from '../services/watchlist.services';
import { LoaderContainer, loader } from "react-global-loader";
import FidgetLoader from "../images/loader.gif";

const WatchList = () => {
    const {user} = useUserAuth();
    const [watchlist, setWatchlist] = useState([]);

    const showLoader = () => {
        loader.show();
      }
    
    const hideLoader = () => {
        loader.hide();
    }

    useEffect(() => {
        showLoader();
        getWatchlist();
      }, []);

    const getWatchlist = async () => {
        const dataList = await WatchlistService.getAllWatchlist();
        console.log(dataList.docs);
        setWatchlist(dataList.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        hideLoader();
    }

    return (
        <>
            <LoaderContainer>
                <img src={FidgetLoader} alt="loading" />
            </LoaderContainer>
            <div className="p-4 box">
                <h2 className="mb-3"></h2>
            </div>
            
            <Table striped bordered hover size="sm">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Info Url</th>
                    <th>Is Watch Completed</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {watchlist.map((doc, index) => {
                    return (
                    <tr key={doc.id}>
                        <td>{index + 1}</td>
                        <td>{doc.title}</td>
                        <td><a href={doc.infoUrl} target="_blank">{doc.infoUrl}</a></td>
                        <td>{doc.isWatchCompleted ? 'Yes' : 'No'}</td>
                        <td>
                            <Button
                                variant="dark edit"
                                className="edit"
                                // onClick={(e) => getLanguageById(doc.id)}
                            >
                                Details
                            </Button>
                            {user && (
                                <>
                                    <Button
                                        variant="secondary"
                                        className="edit"
                                        // onClick={(e) => getLanguageById(doc.id)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="danger"
                                        className="delete"
                                        // onClick={(e) => deleteHandler(doc.id)}
                                    >
                                        Delete
                                    </Button>
                                </>
                            )}
                        </td>
                    </tr>
                    );
                })}
                </tbody>
            </Table>
            
        </>
    )
}

export default WatchList;