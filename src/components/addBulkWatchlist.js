import React, { useState, useEffect } from "react";
import { Form, Alert, Button, Table } from "react-bootstrap";
import CategoryService from '../services/category.service';
import LanguageService from '../services/language.service';
import WatchlistService from '../services/watchlist.services';
import { LoaderContainer, loader } from "react-global-loader";
import { RotatingLines } from 'react-loader-spinner';
import { useNavigate, useParams } from "react-router-dom";
import { useUserAuth } from '../context/userAuthContext';
import * as XLSX from "xlsx";

const AddBulkWatchlist = () => {
    const [categories, setCategories] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [message, setMessage] = useState({ error: false, msg: "" });
    const [excelData, setExcelData] = useState([]);

    const navigate = useNavigate();

    const { user } = useUserAuth();

    let createdBy = user.email.split('@')[0];
    let createdOn = new Date();

    const showLoader = () => {
        loader.show();
      }
    
    const hideLoader = () => {
        loader.hide();
    }

    const getCategories = async () => {
        const dataList = await CategoryService.getAllCategory();
        //console.log(dataList.docs);
        setCategories(dataList.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        //hideLoader();
    }

    const getLanguages = async () => {
        const dataList = await LanguageService.getAllLanguage();
        //console.log(dataList.docs);
        setLanguages(dataList.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        //hideLoader();
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (getExtension(file.name).toLowerCase() !== 'xlsx'
            && getExtension(file.name).toLowerCase() !== 'xls') {
            setMessage({ error: true, msg: "Please Select a .xlsx or .xls file to upload!" });
            return;
        }
        else {
            setMessage("");
            const reader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const parsedData = XLSX.utils.sheet_to_json(sheet);
                setExcelData(parsedData);
            }
        }
    }

    const getExtension = (filename) => {
        return filename.split('.').pop();
    }

    const getSearchTitleArr = (value) => {
        let title = value.split('.').join(' ');
        let titleArr = title.toLowerCase().split(' ');
        return titleArr;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage("");
        console.log(excelData);

        try {
            if (excelData.length <= 0) {
                setMessage({ error: true, msg: "Please Select a file to upload!" });
            }
            else {
                showLoader();

                excelData.forEach((item, index) => {
                    
                    const category = categories.find(element => {
                        return element.name === item.Category;
                    });
                    //console.log("cat-",category);
                    const language = languages.find((element) => {
                        return element.title === item.Language;
                    });

                    let searchTitle = getSearchTitleArr(item.Title);

                    const watchlist = {
                        title: item.Title.split('.').join(' '),
                        infoUrl: item.InfoUrl,
                        languageId: language.id,
                        categoryId: category.id,
                        isWatchedCompleted: item.IsWatched,
                        createdBy: createdBy,
                        createdOn: createdOn,
                        searchTitle
                    }

                    WatchlistService.addWatchlist(watchlist);

                });
                setMessage({ error: false, msg: "Bulk Watchlist Added successfully!" });
                hideLoader();
            }
            
        } catch (err) {
            setMessage({ error: true, msg: err.message });
        }
      
    }

    useEffect(() => {
        showLoader();
        getLanguages();
        getCategories();
        hideLoader();
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
                <h2 className="mb-3">Add Bulk Watchlist</h2>
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
                        <Form.Label>Upload File:</Form.Label>
                        <Form.Control type="file" accept=".xlsx,.xls"
                            onChange={handleFileUpload} />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form> 
            </div>
            
            
        </>
    )
}

export default AddBulkWatchlist;