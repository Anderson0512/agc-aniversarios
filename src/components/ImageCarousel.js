import Slider from 'react-slick';
import { Box } from '@mui/material';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Importando as imagens da pasta cacadores e o logo
import cd1 from '../assets/img/cacadores/cd1.jpeg';
import cd2 from '../assets/img/cacadores/cd2.jpeg';
import cd3 from '../assets/img/cacadores/cd3.jpeg';
import cd4 from '../assets/img/cacadores/cd4.jpeg';
import logoAGC from '../assets/img/logo_agc.jpg';

const ImageCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    cssEase: 'linear',
    arrows: false
  };

  const images = [cd1, cd2, cd3, cd4];

  return (
    <Box sx={{ 
      width: '100%',
      padding: '10px 0',
      '& .slick-slide': {
        padding: '0 8px'
      },
      '& .slick-slide img': {
        width: '100%',
        height: '140px',
        objectFit: 'cover',
        borderRadius: 2,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      },
      '& .slick-dots': {
        bottom: -30
      },
      '& .slick-dots li button:before': {
        fontSize: '10px',
        color: '#BE93E4'
      },
      '& .slick-dots li.slick-active button:before': {
        color: '#9C27B0'
      }
    }}>
      <Slider {...settings}>
        {images.map((img, index) => (
          <div key={index}>
            <img src={img} alt={`Imagem ${index + 1}`} />
          </div>
        ))}
      </Slider>
    </Box>
  );
};

export default ImageCarousel;