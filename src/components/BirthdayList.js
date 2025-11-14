import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Stack, 
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Grid
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
        const result = await loadSheetData();
        // loadSheetData agora retorna { rows, ignored } ou apenas rows
        if (result && result.rows) {
          setBirthdayData(result.rows);
        } else {
          setBirthdayData(result || []);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Pega o ano atual
  const currentYear = new Date().getFullYear();

  // Array com todos os meses do ano
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(currentYear, i, 1);
    return format(date, 'MMMM', { locale: ptBR });
  });

  // Filtra aniversariantes do mês selecionado
  const currentMonthBirthdays = birthdayData.filter(person => {
    if (!person.date) return false;
    const parts = person.date.split('/');
    if (parts.length < 2) return false;
    const month = parseInt(parts[1], 10);
    if (isNaN(month)) return false;
    // O mês - 1 porque os meses em JS começam do 0
    return (month - 1) === selectedMonth;
  });

  const currentMonthName = format(new Date(currentYear, selectedMonth, 1), 'MMMM', { locale: ptBR });

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

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} justifyContent="center">
          {loading ? (
            <Grid item sx={{ width: '100%' }}>
              <Typography variant="h6" sx={{ my: 4, textAlign: 'center' }}>
                Carregando aniversariantes...
              </Typography>
            </Grid>
          ) : (
            <>
              {currentMonthBirthdays.map(person => (
                <Grid item key={person.id} sx={{ width: { xs: '100%', sm: '50%', md: '33.3333%' } }}>
                  <BirthdayCard
                    id={person.id}
                    name={person.name}
                    date={person.date}
                    photo={person.photo}
                  />
                </Grid>
              ))}
              {currentMonthBirthdays.length === 0 && (
                <Grid item sx={{ width: '100%' }}>
                  <Typography variant="h6" sx={{ my: 4, textAlign: 'center' }}>
                    Não há aniversariantes neste mês.
                  </Typography>
                </Grid>
              )}
            </>
          )}
        </Grid>
      </Box>

      <Footer />
    </Container>
  );
};

export default BirthdayList;