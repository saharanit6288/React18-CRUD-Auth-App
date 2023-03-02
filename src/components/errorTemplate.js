import React from 'react';
import Alert from 'react-bootstrap/Alert';

const ErrorTemplate = () => {
    return (
        <>
            <div className="p-4 box">
                <h2 className="mb-3">
                    <Alert key='danger' variant='danger'>
                        Error !!! Route Not Found
                    </Alert>
                </h2>
            </div>
            
        </>
    )
}

export default ErrorTemplate;