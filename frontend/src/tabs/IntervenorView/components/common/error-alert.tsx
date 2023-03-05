import * as React from 'react';
import Alert from '@mui/material/Alert';


interface ErrorAlertProps {message: string};


export default function ErrorAlert({message}: ErrorAlertProps){
    return (
        <Alert severity="warning">{message}</Alert>
    )
}