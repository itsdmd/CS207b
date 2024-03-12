import 'bootstrap/dist/css/bootstrap.min.css'
import { Col, FormControl, Row } from 'react-bootstrap'
import PageCard from './HomepageCard';
import img from "../../../assets/cardphoto.png";
import Timetable from './Timetable';
import { Link } from 'react-router-dom';

const Cards = () => {
    return (
        <div>
            <Row> 
            <Col xs={6} md={4} lg={3}>
                <Link to="/viewschedules">
                    <PageCard img={img} title = "View Schedules"/>
                </Link>
            </Col>
            <Col xs={6} md={4} lg={3} >
                <Link to="/viewgrades">
                    <PageCard img={img} title = "View Grades"/>
                </Link>
            </Col>

            <Col xs={6} md={4} lg={3} disabled>
                <Link to="/viewschedules">
                    <PageCard img={img} title = "View Teaching Schedules"/>
                </Link>
            </Col>

            <Col xs={6} md={4} lg={3} >
                <Link to="/assigngrade">
                    <PageCard img={img} title = "Assign/Change Grades"/>
                </Link>
            </Col>

            <Col xs={6} md={4} lg={3} >
                <Link to="/assigngrade">
                    <PageCard img={img} title = "Assign/Change Grades"/>
                </Link>
            </Col>

            <Col xs={6} md={4} lg={3} >
                 <Link to="/createnewuser">
                    <PageCard img={img} title = "Create new user"/>
                </Link>
            </Col>

          </Row>
        </div>
    );
};

export default Cards;