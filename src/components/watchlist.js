import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, ButtonGroup, Table } from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import { useUserAuth } from '../context/userAuthContext';
import CategoryService from '../services/category.service';
import LanguageService from '../services/language.service';
import WatchlistService from '../services/watchlist.services';
import { LoaderContainer, loader } from "react-global-loader";
import { RotatingLines } from 'react-loader-spinner';
import Modal from 'react-bootstrap/Modal';

const WatchList = () => {
    const {user} = useUserAuth();
    const [watchlist, setWatchlist] = useState([]);
    const [totalwatchlist, setTotalWatchlist] = useState([]);
    const [title, setTitle] = useState("");
    const [infoUrl, setInfoUrl] = useState("");
    const [isWatchedCompleted, setIsWatchedCompleted] = useState("");
    const [language, setLanguage] = useState("");
    const [category, setCategory] = useState("");
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    let pageSize = 24;

    //let userName = user.email.split('@')[0];

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

    const getTotalPageHandler = async () => {
        const dataCount = await WatchlistService.getWatchlistTotalCount();
        let pageTotal = Math.ceil(dataCount/pageSize);
        setTotalPage(pageTotal);
        setTotalItems(dataCount);
    }

    const getWatchlist = async () => {
        const dataList = await WatchlistService.getWatchlistFirst();
        //console.log(dataList.docs);
        setWatchlist(dataList.docs.map((doc) => ({ 
            ...doc.data(), 
            id: doc.id 
        })));
        getTotalPageHandler();
        hideLoader();
    }

    const showNext = async ({item}) => {
        if(watchlist.length === 0) {
            alert("No Record(s) Found !")
        } else {
            showLoader();
            const dataList = await WatchlistService.getWatchlistNext(item.createdOn);
            setWatchlist(dataList.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            setPage(page + 1);
            hideLoader();
        }
    }

    const showPrevious = async ({item}) => {
        showLoader();
        const dataList = await WatchlistService.getWatchlistPrev(item.createdOn);
        setWatchlist(dataList.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setPage(page - 1);
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
                {/*<img src={FidgetLoader} alt="loading" />*/}
                <RotatingLines
                    strokeColor="green"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="96"
                    visible={true}
                />
            </LoaderContainer>
            <div className="p-4 box">
                <h5 className="mb-3">
                    Total Record(s): {totalItems}
                </h5>
            </div>
            <div className="btn-grp">
                <ButtonGroup>
                    <Button disabled={page === 1} variant="link"
                        onClick={() => showPrevious({ item: watchlist[0] })}>
                        {'< Previous'}
                    </Button>
                    <span className="btn-space-btwn"></span>
                    <Button disabled={(watchlist.length < pageSize || totalPage == page)} variant="link"
                        onClick={() => showNext({ item: watchlist[watchlist.length - 1] })}>
                        {'Next >'}
                    </Button>
                </ButtonGroup>

            </div>
            <div className="row">
            {watchlist.map((doc, index) => {
                return (
                    <Card className="text-center col-3 div-card-margin">
                        <Card.Header>
                            <Card.Title>{doc.title}</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <span><b>Is Watched Completed:</b> {doc.isWatchedCompleted ? 'Yes' : 'No'}</span><br />
                                <span>For More Info: <a href={doc.infoUrl} target="_blank">Click Here</a></span>
                            </Card.Text>
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
                        </Card.Body>
                        <Card.Footer className="text-muted">
                            
                        </Card.Footer>
                    </Card>
                )
            })}
            </div>
            {/* <Table striped bordered hover size="sm">
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
            </Table> */}
            
            <div className="btn-grp">
                <ButtonGroup>
                    <Button disabled={page === 1} variant="link"
                            onClick={() => showPrevious({ item: watchlist[0] }) }>
                            {'< Previous'}
                    </Button> 
                    <span className="btn-space-btwn"></span>
                    <Button disabled={(watchlist.length < pageSize || totalPage == page)} variant="link"
                        onClick={() => showNext({ item: watchlist[watchlist.length - 1] })}>
                        {'Next >'}
                    </Button>
                </ButtonGroup>
                
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