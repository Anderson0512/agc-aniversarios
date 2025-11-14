import React from 'react';
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
import { loadSheetData } from '../services/sheets';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import WorkIcon from '@mui/icons-material/Work';

const BirthdayDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    const fetchPerson = async () => {
      try {
        const decodedId = decodeURIComponent(id);
        const result = await loadSheetData();
        const data = result && result.rows ? result.rows : result || [];
        const foundPerson = data.find(p => {
          return p.id === decodedId;
        });
        setPerson(foundPerson);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerson();
  }, [id]);
  
  if (loading) {
    return (
      <Container>
        <Typography variant="h5">Carregando...</Typography>
      </Container>
    );
  }
  
  if (!person) {
    return (
      <Container>
        <Typography variant="h5">Pessoa não encontrada</Typography>
        <Button 
          variant="contained"
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/')}
          sx={{ mt: 2, backgroundColor: '#ff6f91', color: '#fff', '&:hover': { backgroundColor: '#ff4f78' } }}
        >
          Voltar
        </Button>
      </Container>
    );
  }

  // Converte a data do formato DD/MM/YYYY para YYYY-MM-DD
  let formattedDate = 'Data não disponível';
  if (person.date) {
    const parts = person.date.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      const birthDate = new Date(year, month - 1, day); // month - 1 porque os meses em JS começam do 0
      formattedDate = format(birthDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button 
        variant="contained"
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/')}
        sx={{ mb: 3, backgroundColor: '#ff6f91', color: '#fff', '&:hover': { backgroundColor: '#ff4f78' } }}
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
            <Typography>{person.area}</Typography>
          </Stack>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Sobre
          </Typography>
          <Typography paragraph color="text.secondary">
            {person.about}
          </Typography>

          <Typography variant="h6" gutterBottom>
            Hobbies
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {person.hobby && person.hobby.split(';').map((hobby, index) => (
              <Chip key={index} label={hobby.trim()} variant="outlined" />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default BirthdayDetails;