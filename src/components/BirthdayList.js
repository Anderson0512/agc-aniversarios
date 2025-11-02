import { Container, Grid, Typography, Box, Stack } from '@mui/material';
import { format, getMonth } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import BirthdayCard from './BirthdayCard';
import { birthdayData } from '../data/birthdays';
import logoAGC from '../assets/img/logo_agc.jpg';

const BirthdayList = () => {
  const currentMonth = getMonth(new Date());
  
  // Filtra aniversariantes do mês atual
  const currentMonthBirthdays = birthdayData.filter(person => {
    const birthMonth = getMonth(new Date(person.date));
    return birthMonth === currentMonth;
  });

  const currentMonthName = format(new Date(), 'MMMM', { locale: ptBR });

  return (
    <Container>
      <Typography variant="h3" component="h1" sx={{ 
        my: 4, 
        textAlign: 'center',
        color: '#fff',
        textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
      }}>
        Aniversariantes de {currentMonthName}
      </Typography>
      <Box 
        sx={{ 
          mb: 4,
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
      </Grid>
    </Container>
  );
};

export default BirthdayList;