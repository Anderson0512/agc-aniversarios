import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActionArea, Box } from '@mui/material';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useNavigate } from 'react-router-dom';
import defaultAvatar from '../assets/img/logo_agc.jpg';

const BirthdayCard = ({ id, name, date, photo }) => {
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = React.useState(photo || defaultAvatar);
  // Converte a data do formato DD/MM/YYYY para YYYY-MM-DD
  const [day, month, year] = date.split('/');
  const birthDate = new Date(year, month - 1, day); // month - 1 porque os meses em JS começam do 0
  const formattedDate = format(birthDate, "d 'de' MMMM", { locale: ptBR });

  React.useEffect(() => {
    if (photo) {
      // Pré-carrega a imagem para verificar se ela carrega corretamente
      const img = new Image();
      img.onload = () => {
        setImgSrc(photo);
      };
      img.onerror = () => {
        console.error('Erro ao pré-carregar imagem:', photo);
        setImgSrc(defaultAvatar);
      };
      img.src = photo;
    } else {
      setImgSrc(defaultAvatar);
    }
  }, [photo]);

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
      <CardActionArea onClick={() => {
        const encodedId = encodeURIComponent(id);
        navigate(`/person/${encodedId}`);
      }}>
        <Box sx={{ 
          position: 'relative',
          height: 140,
          backgroundColor: '#f5f5f5'
        }}>
          <CardMedia
            component="img"
            height="140"
            image={imgSrc}
            alt={name}
            onError={(e) => {
              console.error('Erro ao carregar imagem:', photo);
              e.target.onerror = null; // previne loop infinito
              setImgSrc(defaultAvatar);
            }}
            sx={{
              objectFit: 'cover',
              objectPosition: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}
          />
        </Box>
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