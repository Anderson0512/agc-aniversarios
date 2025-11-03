import React from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Stack, 
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton
} from '@mui/material';
import { format, getMonth } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import BirthdayCard from './BirthdayCard';
import logoAGC from '../assets/img/logo_agc.jpg';
import MenuIcon from '@mui/icons-material/Menu';
import Footer from './Footer';
import { loadSheetData } from '../services/sheets';

const BirthdayList = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedMonth, setSelectedMonth] = React.useState(getMonth(new Date()));
  const [birthdayData, setBirthdayData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Carrega os dados da planilha quando o componente é montado
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadSheetData();
        setBirthdayData(data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Array com todos os meses do ano
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2025, i, 1);
    return format(date, 'MMMM', { locale: ptBR });
  });

  // Filtra aniversariantes do mês selecionado
  const currentMonthBirthdays = birthdayData.filter(person => {
    const birthMonth = getMonth(new Date(person.date));
    return birthMonth === selectedMonth;
  });

  const currentMonthName = format(new Date(2025, selectedMonth, 1), 'MMMM', { locale: ptBR });

  const handleMonthSelect = (monthIndex) => {
    setSelectedMonth(monthIndex);
    setDrawerOpen(false);
  };

  return (
    <Container>
      <Box sx={{
        position: 'fixed',
        left: '1cm',
        top: '4.5rem',
        zIndex: 1000,
        '@media (max-width: 560px)': {
          position: 'static',
          display: 'flex',
          justifyContent: 'flex-start',
          marginLeft: '1rem',
          marginBottom: '1rem'
        }
      }}>
        <IconButton 
          sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: '#fff',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.3)'
            }
          }}
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      <Typography variant="h3" component="h1" sx={{ 
        my: 4,
        textAlign: 'center',
        color: '#fff',
        textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
      }}>
        Aniversariantes de {currentMonthName}
      </Typography>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250, pt: 2, bgcolor: '#BE93E4', height: '100%' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              textAlign: 'center', 
              color: '#fff',
              mb: 2,
              px: 2
            }}
          >
            Selecione o Mês
          </Typography>
          <List>
            {months.map((month, index) => (
              index !== selectedMonth && (
                <ListItem 
                  key={month} 
                  button 
                  onClick={() => handleMonthSelect(index)}
                  sx={{
                    color: '#fff',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <ListItemText 
                    primary={month.charAt(0).toUpperCase() + month.slice(1)} 
                    sx={{ 
                      '.MuiListItemText-primary': { 
                        color: '#fff'
                      }
                    }}
                  />
                </ListItem>
              )
            ))}
          </List>
        </Box>
      </Drawer>
      <Box 
        sx={{ 
          mb: 2,
          width: '80%',
          mx: 'auto'
        }}
      >
        <Stack 
          direction="row" 
          spacing={2} 
          alignItems="center" 
          justifyContent="center" 
          sx={{ 
            p: 2,
            backgroundColor: '#dcdcdc',
            borderRadius: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            width: '100%',
            height: '100px'
          }}
        >
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 'medium'
            }}
          >
            Igreja AGC
          </Typography>
          <Box
            component="img"
            src={logoAGC}
            alt="Logo Igreja AGC"
            sx={{ 
              width: 100, 
              height: 100, 
              borderRadius: '50%',
              objectFit: 'cover',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          />
        </Stack>
      </Box>

      <Grid container spacing={2} justifyContent="center">
        {loading ? (
          <Typography variant="h6" sx={{ my: 4, textAlign: 'center' }}>
            Carregando aniversariantes...
          </Typography>
        ) : (
          <>
            {currentMonthBirthdays.map(person => (
              <Grid item key={person.id} xs={12} sm={6} md={4}>
                <BirthdayCard
                  id={person.id}
                  name={person.name}
                  date={person.date}
                  photo={person.photo}
                />
              </Grid>
            ))}
            {currentMonthBirthdays.length === 0 && (
              <Typography variant="h6" sx={{ my: 4, textAlign: 'center' }}>
                Não há aniversariantes neste mês.
              </Typography>
            )}
          </>
        )}
      </Grid>

      <Footer />
    </Container>
  );
};

export default BirthdayList;