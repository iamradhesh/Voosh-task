
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles
import { Box } from '@mui/material';
import img1 from '../../assets/1.png';
import img2 from  '../../assets/2.png';
import img3 from  '../../assets/3.jpg'
import img4 from '../../assets/4.jpg'
// Sample images
const images = [
  img1,
  img2,
  img3,
  img4
];

const Home = () => {
  return (
    <Box sx={{ width: '100%', maxWidth: '800px', margin: 'auto' }}>
      <Carousel
        showArrows={true}
        showStatus={false}
        showIndicators={true}
        showThumbs={false}
        infiniteLoop
        autoPlay
        interval={1000} // Change slide every 3 seconds
        swipeable
        dynamicHeight
      >
        {images.map((src, index) => (
          <div key={index}>
            <img src={src} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </Carousel>
    </Box>
  );
};

export default Home;
