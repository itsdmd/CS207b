import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import bannerImg from "../../../assets/banner.jpg"

const PageBanner = ({ title, subtitle }) => {

    const bannerStyle = {
        backgroundImage: `url("https://media.licdn.com/dms/image/D5616AQGWWgKBSC_nMA/profile-displaybackgroundimage-shrink_350_1400/0/1686059904637?e=1715817600&v=beta&t=yvp9rz1_dQGJkEuWo2T4wlYinuMJtkE0IC9x_H1xk5w")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '400px', // Adjust as needed
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      };

  return (
    <Container fluid style={bannerStyle}>
        <div className=" d-flex justify-content-center align-items-center">
            <Container className=" text-black text-center p-5"  bg="#ffffffe0">
                <h3 className=" mt-4">{title}</h3>
                <h5>{subtitle}</h5>
            </Container>
        </div>
    </Container>
  );
};

export default PageBanner;