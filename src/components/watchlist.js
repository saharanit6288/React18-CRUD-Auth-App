import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table } from "react-bootstrap";
import { useUserAuth } from '../context/userAuthContext';
import CategoryService from '../services/category.service';
import LanguageService from '../services/language.service';
import WatchlistService from '../services/watchlist.services';
import { LoaderContainer, loader } from "react-global-loader";
import FidgetLoader from "../images/loader.gif";
import Modal from 'react-bootstrap/Modal';

const WatchList = () => {
    const {user} = useUserAuth();
    const [watchlist, setWatchlist] = useState([]);
    
    const [title, setTitle] = useState("");
    const [infoUrl, setInfoUrl] = useState("");
    const [isWatchedCompleted, setIsWatchedCompleted] = useState("");
    const [language, setLanguage] = useState("");
    const [category, setCategory] = useState("");

    const showLoader = () => {
        loader.show();
    }
    
    const hideLoader = () => {
        loader.hide();
    }

    const navigate = useNavigate();

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

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

    const goToEdit = (id) => {
        navigate(`/editwatchlist/${id}`);
    }

    const deleteHandler = async (id) => {
        if (window.confirm("Are you sure to delete this?")) {
            await WatchlistService.deleteWatchlist(id);
            showLoader();
            getWatchlist();
          } else {
            return;
          }
    }

    const openWatchlistModal = async (data) => {
        setShow(true);
        showLoader();
        const langDoc = await LanguageService.getSingleLanguage(data.languageId);
        const catgDoc = await CategoryService.getSingleCategory(data.categoryId);
        setTitle(data.title);
        setInfoUrl(data.infoUrl);
        setLanguage(langDoc.data().title);
        setCategory(catgDoc.data().name);
        setIsWatchedCompleted(data.isWatchedCompleted ? 'Yes' : 'No');
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
                        <td>{doc.isWatchedCompleted ? 'Yes' : 'No'}</td>
                        <td>
                            <Button
                                variant="dark edit"
                                className="edit"
                                onClick={(e) => openWatchlistModal(doc)}
                            >
                                Details
                            </Button>
                            {user && (
                                <>
                                    <Button
                                        variant="secondary"
                                        className="edit"
                                        onClick={(e) => goToEdit(doc.id)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="danger"
                                        className="delete"
                                        onClick={(e) => deleteHandler(doc.id)}
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

            <div>
                <p>
                    <span><b>Total Record(s): {watchlist.length}</b></span>
                </p>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <span><b>Language:</b> {language}</span><br />
                    <span><b>Category:</b> {category}</span><br />
                    <span><b>Is Watched Completed:</b> {isWatchedCompleted}</span><br /><br />
                    For More Info: <a href={infoUrl} target="_blank">Click Here</a>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default WatchList;