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
    if (!photo) {
      setImgSrc(defaultAvatar);
      return;
    }

    // Gera URLs candidatas (tenta alternativas para links do Google Drive)
    const getDriveId = (p) => {
      const m = p.match(/[-\w]{25,}/);
      return m && m[0] ? m[0] : null;
    };

    const candidates = [];
    // se for link do Drive (compartilhamento ou thumbnail), tenta variações
    if (photo.includes('drive.google.com')) {
      const id = getDriveId(photo);
      if (id) {
        candidates.push(`https://drive.google.com/uc?export=view&id=${id}`);
        candidates.push(`https://drive.google.com/thumbnail?id=${id}&sz=w400`);
      }
    }
    // também tenta a URL original em último caso
    candidates.push(photo);

    let cancelled = false;
    const preload = (url) => new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });

    (async () => {
      for (const url of candidates) {
        try {
          // tenta carregar cada candidato até encontrar um que funcione
          // console.log('Tentando carregar imagem candidata:', url);
          const ok = await preload(url);
          if (cancelled) return;
          if (ok) {
            setImgSrc(url);
            return;
          } else {
            console.warn('Falha ao carregar candidato:');
          }
        } catch (e) {
          console.warn('Erro ao tentar pré-carregar candidato:', url, e);
          // ignore e tente próximo
        }
      }
      // nenhum candidato funcionou
      console.error('Erro ao pré-carregar imagem (todos candidatos falharam):', photo);
      if (!cancelled) setImgSrc(defaultAvatar);
    })();

    return () => { cancelled = true; };
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