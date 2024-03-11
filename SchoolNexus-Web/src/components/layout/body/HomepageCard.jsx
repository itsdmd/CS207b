import 'bootstrap/dist/css/bootstrap.min.css'
import { Card, Button} from 'react-bootstrap'
import  '../body/HoverStyle.css'

const PageCard = ({ img, title }) => {
    

    return (
        <div>
            <Card  className='pagecard text-center mb-4 p-3' style={{ width: '16rem'} }>
                <Card.Img variant="top" className='w-75 h-75 align-self-center mt-2' src={ img }  />
                <Card.Body className='mb-4'>
                    <Button 
                    variant="link"
                    style={{ fontSize: '18px', color: "black" }} 
                    className='buttonn text-decoration-none'>
                        {title}
                    </Button>
                </Card.Body>
            </Card>
        </div>
    );
};

export default PageCard;