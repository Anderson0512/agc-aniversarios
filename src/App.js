import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BirthdayList from './components/BirthdayList';
import BirthdayDetails from './components/BirthdayDetails';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#BE93E4',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'white',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{ 
          minHeight: '100vh',
          paddingTop: '2rem',
          paddingBottom: '2rem'
        }}>
          <Routes>
            <Route path="/" element={<BirthdayList />} />
            <Route path="/person/:id" element={<BirthdayDetails />} />
          </Routes>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
