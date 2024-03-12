import Defaultbar from '../components/layout/navigation/Defaultbar'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import Card from 'react-bootstrap/Card';

export default function SettingScreen(){
    return(
        <div>
            <Defaultbar/>
            <div className="mt-3 mb-3" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <h1>Setting <i class="bi bi-tools"></i></h1>
            </div>
            <div className="d-flex align-item-center justify-content-center mt-5 mb-5">
                <Card className="w-50 " style={{
                    height: '80px',
                    justifyContent: 'center',
                    textAlign: 'center',
                    background: 'linear-gradient(45deg, rgba(29, 236, 197, 0.5), rgba(91, 14, 214, 0.5) 100%)',
                }}>
                    <p style={{
                        fontSize: '20px',
                    }}><i class="bi bi-person-lock"></i> Change password</p>
                </Card>
            </div>

            <div className="d-flex align-item-center justify-content-center mt-5 mb-5">
                <Card className="w-50 " style={{
                    height: '80px',
                    justifyContent: 'center',
                    textAlign: 'center',
                    background: 'linear-gradient(45deg, rgba(29, 236, 197, 0.5), rgba(91, 14, 214, 0.5) 100%)',
                }}>
                    <p style={{
                        fontSize: '20px',
                    }}><i class="bi bi-person-fill-gear"></i> Request to change personal information</p>
                </Card>
            </div>

            <div className="d-flex align-item-center justify-content-center mt-5 mb-5">
                <Card className="w-50 " style={{
                    height: '80px',
                    justifyContent: 'center',
                    textAlign: 'center',
                    background: 'linear-gradient(45deg, rgba(29, 236, 197, 0.5), rgba(91, 14, 214, 0.5) 100%)',
                }}>
                    <p style={{
                        fontSize: '20px',
                    }}><i class="bi bi-globe"></i> Language</p>
                </Card>
            </div>
            
        </div>
    );
}