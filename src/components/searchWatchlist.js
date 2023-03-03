import React, { useState, useEffect } from 'react';
import { useNavigate, useParams  } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button, Table } from "react-bootstrap";
import { useUserAuth } from '../context/userAuthContext';
import { LoaderContainer, loader } from "react-global-loader";
import FidgetLoader from "../images/loader.gif";
import CategoryService from '../services/category.service';
import LanguageService from '../services/language.service';
import WatchlistService from '../services/watchlist.services';

const SearchWatchlist = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [title, setTitle] = useState("");
    const [languageId, setLanguageId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [message, setMessage] = useState({ error: false, msg: "" });

    const showLoader = () => {
        loader.show();
    }

    const hideLoader = () => {
        loader.hide();
    }

    const {user} = useUserAuth();
    //let createdBy = user.email.split('@')[0];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        
        if (title === "" && languageId === "" && categoryId === "") {
            setMessage({ error: true, msg: "Please Give Input any of the field to Search." });
            return;
        }

        showLoader();

        const watchlist = {
            title,
            languageId,
            categoryId
        }

        try {
            const dataList = await WatchlistService.getSearchWatchlist(watchlist);
            //console.log(dataList.docs);
            setWatchlist(dataList.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            hideLoader();
        } catch (err) {
            console.log(err);
            setMessage({ error: true, msg: err.message });
            hideLoader();
        }
      
        
    }

    const clear = () => {
        setTitle("");
        setLanguageId("");
        setCategoryId("");
        setWatchlist([]);
        setMessage("");
    }

    const getLanguages = async () => {
        const dataList = await LanguageService.getAllLanguage();
        //console.log('lang',dataList.docs);
        setLanguages(dataList.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        
    }

    const getCategories = async () => {
        const dataList = await CategoryService.getAllCategory();
        //console.log('catg',dataList.docs);
        setCategories(dataList.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        
    }

    useEffect(() => {
        showLoader();
        getLanguages();
        getCategories();
        hideLoader();
      }, [])

    return (
        <>
            <LoaderContainer>
                <img src={FidgetLoader} alt="loading" />
            </LoaderContainer>
            <div className="p-4 box">
                <h2 className="mb-3">Search My Watchlist item(s)</h2>
                {message?.msg && (
                    <Alert
                        className='col-12'
                        variant={message?.error ? "danger" : "success"}
                        dismissible
                        onClose={() => setMessage("")}
                    >
                        {message?.msg}
                    </Alert>
                    )
                }
                <Form onSubmit={handleSubmit} className="row col-12">
                    <Form.Group className="mb-3 col-3" controlId="formTitle">
                        <Form.Control type="text" placeholder="Enter Title" value={title}
                        onChange={(e) => setTitle(e.target.value)} />
                    </Form.Group>
                    
                    <Form.Group className="mb-3 col-3" controlId="formLanguage">
                        <Form.Select aria-label="Default select example"
                            value={languageId}
                            onChange={(e) => setLanguageId(e.target.value)}
                        >
                            <option value="">--Select Language--</option>
                            {languages.map((lan,index) => {
                                return (
                                    <option key={index} value={lan.id}>{lan.title}</option>
                                )
                            })}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3 col-3" controlId="formCategory">
                        <Form.Select aria-label="Default select example"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            <option value="">--Select Category--</option>
                            {categories.map((cat,index) => {
                                return (
                                    <option key={index} value={cat.id}>{cat.name}</option>
                                )
                            })}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3 col-3" controlId="formButtons">
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                        <span className="btn-space-btwn"></span>
                        <Button variant="dark" type="button"
                            onClick={clear}>
                            Clear
                        </Button>
                    </Form.Group>
                </Form> 
                <span className='span-small-text'>
                    <i><b>*Note: Please search title by proper words only. Abbreviation of words not working for now. </b></i>
                </span>
                <hr />
                <Table striped bordered hover size="sm">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Info Url</th>
                        <th>Is Watch Completed</th>
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
                        </tr>
                        );
                    })}
                    </tbody>
                </Table>
            </div>
        </>
    )
}

export default SearchWatchlist;