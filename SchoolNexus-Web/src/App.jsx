import { useState } from 'react'
import Homepage from './views/Homepage'

function App() {
  const [count, setCount] = useState(0)

  return (
   <div>
    <Homepage name="abc" />
   </div>
  )
}
export default App;
