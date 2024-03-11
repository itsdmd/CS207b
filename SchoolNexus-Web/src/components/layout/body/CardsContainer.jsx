import 'bootstrap/dist/css/bootstrap.min.css'
import { Col, Row } from 'react-bootstrap'
import PageCard from './HomepageCard';

import img from "../../../assets/cardphoto.png";

const Cards = () => {
    return (
        <div>
            <Row>
                <Col xs={6} md={4} lg={3} >
                <PageCard img={img} title = "View Grades" />
                </Col>

                <Col xs={6} md={4} lg={3} >
                <PageCard img={img} title = "View Grades"/>
                </Col>

                <Col xs={6} md={4} lg={3} >
                <PageCard img={img} title = "View Grades"/>
                </Col>

                <Col xs={6} md={4} lg={3} >
                <PageCard img={img} title = "View Grades"/>
                </Col>

                <Col xs={6} md={4} lg={3} >
                <PageCard img={img} title = "View Grades"/>
                </Col>

                <Col xs={6} md={4} lg={3} >
                <PageCard img={img} title = "View Grades"/>
                </Col>



          </Row>
        </div>
    );
};

export default Cards;