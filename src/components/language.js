import React, { useState, useEffect } from "react";
import { Form, Alert, Button, Table } from "react-bootstrap";
import LanguageService from '../services/language.service';
import { LoaderContainer, loader } from "react-global-loader";
import FidgetLoader from "../images/loader.gif";

const Language = () => {
    const [languageId, setLanguageId] = useState("");
    const [languages, setLanguages] = useState([]);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState({ error: false, msg: "" });

    const showLoader = () => {
        loader.show();
      }
    
    const hideLoader = () => {
        loader.hide();
    }

    const getLanguages = async () => {
        const dataList = await LanguageService.getAllLanguage();
        console.log(dataList.docs);
        setLanguages(dataList.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        hideLoader();
    }

    const deleteHandler = async (id) => {
        await LanguageService.deleteLanguage(id);
        setMessage("");
        getLanguages();
    }

    const getLanguageById = async (id) => {
        setMessage("");
        setLanguageId(id);
        try {
            const dataDoc = await LanguageService.getSingleLanguage(id);
            console.log(dataDoc.data());
            setTitle(dataDoc.data().title);
        }
        catch(err){
            setMessage({ error: true, msg: err.message });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        if (title === "") {
            setMessage({ error: true, msg: "All fields are mandatory!" });
            return;
        }

        const language = {
            title
        };

        try {
            if (languageId !== undefined && languageId !== "") {
                await LanguageService.updateLanguage(languageId, language);
                setLanguageId("");
                setMessage({ error: false, msg: "Updated successfully!" });
            } else {
                await LanguageService.addLanguage(language);
                setMessage({ error: false, msg: "New Language added successfully!" });
            }
        } catch (err) {
            setMessage({ error: true, msg: err.message });
        }
      
        setTitle("");
        getLanguages();
    }

    useEffect(() => {
        showLoader();
        getLanguages();
      }, []);

    return (
        <>
            <LoaderContainer>
                <img src={FidgetLoader} alt="loading" />
            </LoaderContainer>
            <div className="p-4 box">
                <h2 className="mb-3">Add Language</h2>
                {message?.msg && (
                    <Alert
                        variant={message?.error ? "danger" : "success"}
                        dismissible
                        onClose={() => setMessage("")}
                    >
                        {message?.msg}
                    </Alert>
                    )
                }
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3 col-4" controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter Language"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)} />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form> 
            </div>
            
            <Table striped bordered hover size="sm">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {languages.map((doc, index) => {
                    return (
                    <tr key={doc.id}>
                        <td>{index + 1}</td>
                        <td>{doc.title}</td>
                        <td>
                        <Button
                            variant="secondary"
                            className="edit"
                            onClick={(e) => getLanguageById(doc.id)}
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
                        </td>
                    </tr>
                    );
                })}
                </tbody>
            </Table>
        </>
    )
}

export default Language;