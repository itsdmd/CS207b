import Defaultbar from "../components/layout/navigation/Defaultbar";
import PageFooter from "../components/layout/footer/Footer";
import 'bootstrap/dist/css/bootstrap.min.css'

import { Container } from 'react-bootstrap'

export default function Homepage() {
  return (
    <div>
      <div>
        <Defaultbar/>
      </div>

      <PageFooter/>
    </div>
  )
}