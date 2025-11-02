import React from 'react';
import { Box, Typography, Card, IconButton, Stack } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { SiTiktok } from 'react-icons/si';

const Footer = () => {
  return (
    <Card sx={{
      mt: 3,
      mb: 2,
      mx: 'auto',
      maxWidth: '80%',
      backgroundColor: '#BE93E4',
      borderRadius: 2,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      border: 'none',
      overflow: 'hidden'
    }}>
      <Box
        component="footer"
        sx={{
          py: 2,
          px: 3,
          textAlign: 'center'
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold',
            mb: 1,
            color: '#fff'
          }}
        >
          Somos Continuidade.
        </Typography>
        <Typography 
          variant="subtitle1"
          sx={{
            mb: 1,
            color: '#fff'
          }}
        >
          Aos Domingos | 18h
        </Typography>
        <Typography 
          variant="subtitle1"
          sx={{
            color: '#fff',
            mb: 2
          }}
        >
          Rua Cerqueira Cézar 135 - GRU/SP
        </Typography>

        <Stack 
          direction="row" 
          spacing={2} 
          justifyContent="center"
          sx={{
            mt: 2
          }}
        >
          <IconButton
            href="https://www.instagram.com/igreja_agc/"
            target="_blank"
            sx={{
              color: '#fff',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s'
            }}
          >
            <InstagramIcon />
          </IconButton>
          <IconButton
            href="https://www.facebook.com/igrejaagc?mibextid=ZbWKwL"
            target="_blank"
            sx={{
              color: '#fff',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s'
            }}
          >
            <FacebookIcon />
          </IconButton>
          <IconButton
            href="https://www.tiktok.com/@igrejaagc"
            target="_blank"
            sx={{
              color: '#fff',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s'
            }}
          >
            <SiTiktok size={20} />
          </IconButton>
          <IconButton
            href="https://www.youtube.com/@IgrejaAGCAGrandeComissao"
            target="_blank"
            sx={{
              color: '#fff',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s'
            }}
          >
            <YouTubeIcon />
          </IconButton>
        </Stack>
      </Box>
    </Card>
  );
};

export default Footer;