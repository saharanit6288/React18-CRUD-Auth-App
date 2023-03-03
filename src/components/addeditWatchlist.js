import React, { useState, useEffect } from 'react';
import { useNavigate, useParams  } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useUserAuth } from '../context/userAuthContext';
import { LoaderContainer, loader } from "react-global-loader";
import FidgetLoader from "../images/loader.gif";
import CategoryService from '../services/category.service';
import LanguageService from '../services/language.service';
import WatchlistService from '../services/watchlist.services';

const AddEditWatchList = () => {
    const { id } = useParams();
    const [languages, setLanguages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [title, setTitle] = useState("");
    const [infoUrl, setInfoUrl] = useState("");
    const [isWatchedCompleted, setIsWatchedCompleted] = useState(false);
    const [languageId, setLanguageId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [headingText, setHeadingText] = useState("Add Watchlist");
    const [message, setMessage] = useState({ error: false, msg: "" });
    
    const showLoader = () => {
        loader.show();
    }

    const hideLoader = () => {
        loader.hide();
    }

    const navigate = useNavigate();

    const {user} = useUserAuth();

    let createdBy = user.email.split('@')[0];
    let createdOn = new Date();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (title === "") {
            setMessage({ error: true, msg: "Title is required." });
            return;
        }
        else if (infoUrl === "") {
            setMessage({ error: true, msg: "Info Url is required." });
            return;
        }
        else if (languageId === "") {
            setMessage({ error: true, msg: "Language is required." });
            return;
        }
        else if (categoryId === "") {
            setMessage({ error: true, msg: "Category is required." });
            return;
        }

        let searchTitle = getSearchTitleArr(title);

        showLoader();
        const watchlist = {
            title: title.split('.').join(' '),
            infoUrl,
            languageId,
            categoryId,
            isWatchedCompleted,
            createdBy:createdBy,
            createdOn:createdOn,
            searchTitle
        }

        try {
            if (id !== undefined && id !== "") {
                await WatchlistService.updateWatchlist(id, watchlist);
                
                setMessage({ error: false, msg: "Updated successfully!" });
            } else {
                await WatchlistService.addWatchlist(watchlist);
                setMessage({ error: false, msg: "Added successfully!" });
            }
            hideLoader();
            navigate('/');
        } catch (err) {
            console.log(err);
            setMessage({ error: true, msg: err.message });
        }
      
        setTitle("");
        setInfoUrl("");
        setLanguageId("");
        setCategoryId("");
        setIsWatchedCompleted(false);
    }

    const getSearchTitleArr = (value) => {
        let title = value.split('.').join(' ');
        let titleArr = title.toLowerCase().split(' ');
        return titleArr;
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

    const getWatchlistById = async (id) => {
        setMessage("");
        showLoader();
        try {
            const dataDoc = await WatchlistService.getSingleWatchlist(id);
            //console.log(dataDoc.data());
            setHeadingText("Edit Watchlist");
            setTitle(dataDoc.data().title);
            setInfoUrl(dataDoc.data().infoUrl);
            setLanguageId(dataDoc.data().languageId);
            setCategoryId(dataDoc.data().categoryId);
            setIsWatchedCompleted(dataDoc.data().isWatchedCompleted);
            hideLoader();
        }
        catch(err){
            setMessage({ error: true, msg: err.message });
            hideLoader();
        }
    }

    

    useEffect(() => {
        showLoader();
        getLanguages();
        getCategories();
        hideLoader();
      }, [])

    useEffect(() => {
        if(id !== undefined && id !== ""){
            getWatchlistById(id);
        }
      }, [id]);

    return (
        <>
            <LoaderContainer>
                <img src={FidgetLoader} alt="loading" />
            </LoaderContainer>
            <div className="p-4 box">
                <h2 className="mb-3">{headingText}</h2>
                {message?.msg && (
                    <Alert
                        className='col-4'
                        variant={message?.error ? "danger" : "success"}
                        dismissible
                        onClose={() => setMessage("")}
                    >
                        {message?.msg}
                    </Alert>
                    )
                }
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3 col-4" controlId="formTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" placeholder="Enter Title" value={title}
                        onChange={(e) => setTitle(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3 col-4" controlId="formInfoUrl">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="text" placeholder="Info Url" value={infoUrl}
                        onChange={(e) => setInfoUrl(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3 col-4" controlId="formLanguage">
                        <Form.Label>Language</Form.Label>
                        <Form.Select aria-label="Default select example"
                            value={languageId}
                            onChange={(e) => setLanguageId(e.target.value)}
                        >
                            <option value="">--Select--</option>
                            {languages.map((lan,index) => {
                                return (
                                    <option key={index} value={lan.id}>{lan.title}</option>
                                )
                            })}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3 col-4" controlId="formCategory">
                        <Form.Label>Category</Form.Label>
                        <Form.Select aria-label="Default select example"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            <option value="">--Select--</option>
                            {categories.map((cat,index) => {
                                return (
                                    <option key={index} value={cat.id}>{cat.name}</option>
                                )
                            })}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3 col-4" controlId="formIsWatchedCompleted">
                    <Form.Check 
                        type='checkbox'
                        label='Is Watched Completed'
                        id='chkbox'
                        key='deflt-chkbox'
                        checked={isWatchedCompleted}
                        onChange={(e) => setIsWatchedCompleted(!isWatchedCompleted)}
                    />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form> 
            </div>
            
        </>
    )
}

export default AddEditWatchList;