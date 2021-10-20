import React, { useEffect } from "react";
import './App.css';
import Header from './Header';

import Home from './Home';
import {BrowserRouter as Router,Switch, Route} from "react-router-dom";
import Checkout from "./Checkout";
import Login from "./Login";
import Payment from "./Payment";
import {auth} from "./firebase";
import { useStateValue } from "./StateProvider";
import {loadStripe} from  "@stripe/stripe-js";
import { Elements} from '@stripe/react-stripe-js';
import Orders from "./Orders";


const promise = loadStripe('pk_test_51JZKTnSJIeWVovsOUjoEMtIwFH2kt7gcqsvTe3KIGoN0MQlfDkdSi30nX4nhoekMNriw1YG9GsSK4fLBD2J7UshC00rvJs0IAC');

  function App() {
    const [{},dispatch] = useStateValue();
   useEffect(() => {
     //will run once when the app component loads...
     auth.onAuthStateChanged(authUser => {
       console.log('The user is >>>',authUser);
       
       if (authUser){
         //the user just logged in / the user was logged in
         dispatch({
          type:'SET_USER',
          user: authUser
        })
        }
       else{
         //the user is logged out
       dispatch({
         type: 'SET_USER',
         user: null
       })
        }
     })
    }, [])
  return (
    //BEM
    <Router>
       <div className="app">

    <Switch>
    <Route path="/orders">
    <Header/>
    <Orders/>
 
    </Route>
    <Route path="/login">
    <Login/>
    </Route>
    <Route path="/checkout">
    <Header/>
    <Checkout/>
    </Route>
    <Route path="/payment">
    <Header/>
    <Elements stripe ={promise}>
    <Payment/>
    </Elements>
    
   
    </Route>
    <Route path="/">
    <Header/>
    <Home/>
    </Route>
    </Switch>
    {/*Footer */}
    </div>
    </Router>
   
  );
}

export default App;