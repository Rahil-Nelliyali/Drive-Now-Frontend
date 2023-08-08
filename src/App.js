import './App.css';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import Login from './components/accounts/Login'
import Home from "./pages/Home";
import Register from "./components/accounts/Register";
import AdminHome from './pages/admin/AdminHome'
import Renter from "./components/admin/Renter";
import User from "./components/admin/User";
import Renterregister from './components/renter/Renterregister'
import LoginRenter from './components/renter/LoginRenter'
import Dashboards from "./components/renter/Dashboards";
import Car from './components/user/Car'
import SingleCar from "./components/user/CarDetail";
import Cars from './components/admin/Cars'
import Carrenter from './components/renter/Carrenter'
import CreateCar from './components/renter/CreateCar'
import CarDetail from "./components/renter/DetailedCar";
import CategoryRenter from './components/renter/CategoryRenter'
import CreateCategory from './components/renter/CreateCategory'
import Profile from './components/user/Profile';

import PaymentPage from './components/user/Payment'
import PaymentSuccessPage from './components/user/PaymentSuccess'
import RenterBookings from './components/renter/Bookings';
import CreateSlot from './components/renter/CreateSlot';

import Bookings from './components/user/MyBookings';
import AllBookings from './components/admin/Bookings';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>

        
          <Route path='/' exact Component={Home} />
          <Route path='/login' Component={Login} />
          <Route path='/register' Component={Register} />
          <Route path='/home-list-car' exact Component={Car} />
          <Route path='/cardetail/:id' exact Component={SingleCar} />
          <Route path='/payment' exact Component={PaymentPage} />
          <Route path='/success' exact Component={PaymentSuccessPage} />
          <Route path='/mybookings' exact Component={Bookings} />
          <Route path='/profile' exact Component={Profile} />




          <Route path='/adminhome' exact Component={AdminHome} />
          <Route path='/renter' Component={Renter} />
          <Route path='/user' Component={User} />
          <Route path='/cars' Component={Cars} />
          <Route path='/allbookings' Component={AllBookings} />


          <Route path='/rentersignup' Component={Renterregister}/>
          <Route path='/rentersignin' Component={LoginRenter}/>
          <Route path='/dashboards' Component={Dashboards} />
          <Route path='/carrenter' Component={Carrenter} />
          <Route path='/createcar' Component={CreateCar}/>   
          <Route path='/singlecardetail/:id' exact Component={CarDetail}/>
          <Route path='/categoryrenter' Component={CategoryRenter}/>
          <Route path='/createcategory' Component={CreateCategory}/>
          <Route path='/renterbookings' Component={RenterBookings}/>
          <Route path='/createslot/:id' Component={CreateSlot}/>

        </Routes>
      </Router>
    </div>
  );
}

export default App;

