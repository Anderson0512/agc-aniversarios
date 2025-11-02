import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Chip, 
  Stack, 
  Button, 
  Box 
} from '@mui/material';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { birthdayData } from '../data/birthdays';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import WorkIcon from '@mui/icons-material/Work';
import InstagramIcon from '@mui/icons-material/Instagram';

const BirthdayDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const person = birthdayData.find(p => p.id === parseInt(id));
  
  if (!person) {
    return (
      <Container>
        <Typography variant="h5">Pessoa não encontrada</Typography>
        <Button 
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Voltar
        </Button>
      </Container>
    );
  }

  const birthDate = new Date(person.date);
  const formattedDate = format(birthDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button 
        variant="contained"
        color="primary"
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/')}
        sx={{ mb: 3 }}
      >
        Voltar
      </Button>
      
      <Card sx={{ 
        display: { md: 'flex' }, 
        mb: 4,
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: '#dcdcdc',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}>
        <CardMedia
          component="img"
          sx={{ width: { xs: '100%', md: 300 }, height: { xs: 300, md: 'auto' } }}
          image={person.photo}
          alt={person.name}
        />
        <CardContent sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom>
            {person.name}
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {formattedDate}
          </Typography>
          
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <EmailIcon color="action" />
            <Typography>{person.email}</Typography>
          </Stack>
          
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <WorkIcon color="action" />
            <Typography>{person.department}</Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
            <InstagramIcon color="action" />
            <Typography>
              <a 
                href="https://www.instagram.com/igreja_agc/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                {person.instagram}
              </a>
            </Typography>
          </Stack>

          <Typography variant="h6" gutterBottom>
            Sobre
          </Typography>
          <Typography paragraph color="text.secondary">
            {person.description}
          </Typography>

          <Typography variant="h6" gutterBottom>
            Hobbies
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {person.hobbies.map((hobby, index) => (
              <Chip key={index} label={hobby} variant="outlined" />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default BirthdayDetails;