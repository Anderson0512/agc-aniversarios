import { Card, CardContent, CardMedia, Typography, CardActionArea } from '@mui/material';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useNavigate } from 'react-router-dom';

const BirthdayCard = ({ id, name, date, photo }) => {
  const navigate = useNavigate();
  const birthDate = new Date(date);
  const formattedDate = format(birthDate, "d 'de' MMMM", { locale: ptBR });

  return (
    <Card sx={{ 
        maxWidth: 345, 
        margin: 2,
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
        }
      }}>
      <CardActionArea onClick={() => navigate(`/person/${id}`)}>
        <CardMedia
          component="img"
          height="140"
          image={photo}
          alt={name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formattedDate}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default BirthdayCard;