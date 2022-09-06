
import Khaty from '../pages/khaty/khaty'
import Rokar from '../pages/rokar/rokar';
import Maal from '../pages/maal/maal';
import TafseelKhata from '../pages/tafseelKhata/tafseelKhata';
import SignIn from '../pages/login';
import { Link, Route, Routes } from 'react-router-dom';
const Navigation = () => {
  return (
    <div ><Routes>
      <Route exact path="/khaty" element={<Khaty />} />
      <Route exact path="/tafseelkhata/:id" element={<TafseelKhata />} />
      <Route path="/maal" element={<Maal />} />
      <Route path="/rokar" element={<Rokar />} />

    </Routes>
    </div>
  )
}

export default Navigation

