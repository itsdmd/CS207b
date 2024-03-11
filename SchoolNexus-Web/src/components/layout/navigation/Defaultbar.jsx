import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import logo from "../../../assets/logo.png"

import { Container, Nav, Navbar, Image } from 'react-bootstrap'

export default function Defaultbar() {
  return (
    <div>
        <Navbar expand="lg" className=" fixed border-bottom shadow ">
          <Container>
            <Container >
              <Navbar.Brand href="#Home" className='d-flex align-center' >
                <Image src={logo} width={70} height={70} />
              </Navbar.Brand>
            </Container>
          
            <Nav variant='underline'>
                  <Nav.Link  href="#Home"  >
                    <i class="bi bi-house"> </i> 
                    Home
                  </Nav.Link> 
                    
                  <Nav.Link href="#Account" >
                    <i class="bi bi-person"> </i>
                    Account
                  </Nav.Link> 

                  <Nav.Link href="#" >
                    <i class="bi bi-box-arrow-right "> </i>
                      Logout
                  </Nav.Link> 
                </Nav>    
            </Container>
          
        </Navbar>
    </div>

  )
}
