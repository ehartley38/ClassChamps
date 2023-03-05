import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import useAuth, { AuthProvider } from './providers/useAuth'
import { BrowserRouter } from 'react-router-dom'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const theme = createTheme({
    palette: {
        primary: {
            main: "#013e87",
        },
        secondary: {
            main: "#2e74c9",
        },
    },
    typography: {
        h1: {
            fontSize: "3rem",
            fontWeight: 600,
        },
        h2: {
            fontSize: "1.75rem",
            fontWeight: 600,
        },
        h3: {
            fontSize: "1.5rem",
            fontWeight: 600,
        },
    },
})

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <CssBaseline />
                <ThemeProvider theme={theme}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <App />
                    </LocalizationProvider>
                </ThemeProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
)