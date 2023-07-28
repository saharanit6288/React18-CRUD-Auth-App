import React, { useState, useEffect } from "react";
import { Form, Alert, Button, Table } from "react-bootstrap";
import CategoryService from '../services/category.service';
import { LoaderContainer, loader } from "react-global-loader";
import { RotatingLines } from 'react-loader-spinner';

const Category = () => {
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [message, setMessage] = useState({ error: false, msg: "" });
    
    const showLoader = () => {
        loader.show();
      }
    
    const hideLoader = () => {
        loader.hide();
    }

    const getCategories = async () => {
        const dataList = await CategoryService.getAllCategory();
        console.log(dataList.docs);
        setCategories(dataList.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        hideLoader();
    }

    const deleteHandler = async (id) => {
        await CategoryService.deleteCategory(id);
        setMessage("");
        getCategories();
    }

    const getCategoryById = async (id) => {
        setMessage("");
        setCategoryId(id);
        try {
            const dataDoc = await CategoryService.getSingleCategory(id);
            console.log(dataDoc.data());
            setName(dataDoc.data().name);
        }
        catch(err){
            setMessage({ error: true, msg: err.message });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        if (name === "") {
            setMessage({ error: true, msg: "All fields are mandatory!" });
            return;
        }

        const category = {
            name
        };

        try {
            if (categoryId !== undefined && categoryId !== "") {
                await CategoryService.updateCategory(categoryId, category);
                setCategoryId("");
                setMessage({ error: false, msg: "Updated successfully!" });
            } else {
                await CategoryService.addCategory(category);
                setMessage({ error: false, msg: "New Category added successfully!" });
            }
        } catch (err) {
            setMessage({ error: true, msg: err.message });
        }
      
        setName("");
        getCategories();
    }

    useEffect(() => {
        showLoader();
        getCategories();
      }, []);

    return (
        <>
            <LoaderContainer>
                <RotatingLines
                    strokeColor="green"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="96"
                    visible={true}
                />
            </LoaderContainer>
            <div className="p-4 box">
                <h2 className="mb-3">Add Category</h2>
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
                        <Form.Control type="text" placeholder="Enter Category Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)} />
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
                    <th>Name</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {categories.map((doc, index) => {
                    return (
                    <tr key={doc.id}>
                        <td>{index + 1}</td>
                        <td>{doc.name}</td>
                        <td>
                        <Button
                            variant="secondary"
                            className="edit"
                            onClick={(e) => getCategoryById(doc.id)}
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

export default Category;