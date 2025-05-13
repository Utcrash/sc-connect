import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#0F5EAA', // Standard Chartered Blue
            light: '#3B7CBD',
            dark: '#0A4075',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#E32726', // Standard Chartered Red
            light: '#E85151',
            dark: '#B31F1E',
            contrastText: '#ffffff',
        },
        background: {
            default: '#F5F6F8',
            paper: '#ffffff',
        },
    },
    typography: {
        h6: {
            fontWeight: 600,
        },
        subtitle2: {
            fontWeight: 500,
        },
    },
    components: {
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
            },
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: '#ffffff',
                    },
                },
            },
        },
        MuiPaper: {
            defaultProps: {
                elevation: 1,
            },
            styleOverrides: {
                root: {
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#0F5EAA',
                },
            },
        },
    },
});

export default theme; 