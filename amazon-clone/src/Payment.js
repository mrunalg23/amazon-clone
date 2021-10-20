import {CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState,useEffect } from 'react'
import CurrencyFormat from 'react-currency-format';
import { Link,useHistory } from 'react-router-dom';
import CheckoutProduct from './CheckoutProduct';
import { getBasketTotal } from './reducer';
import './Payment.css';
import axios from './axios'
import { useStateValue } from './StateProvider';
import {db} from "./firebase";

function Payment() {
    const history =useHistory();
    const [{basket,user}, dispatch] = useStateValue();
    const [error ,setError] = useState(null);
    const [disabled,setDisabled] = useState(true);
    const [succeeded,setSucceeded] = useState(false);
    const [processing,setProcessing] = useState("");
    const [clientSecret, setClientSecret] =useState(true);
    
    useEffect (()=>{
       //generate the special secret to charge a customer
       const getClientSecret = async() =>{
               const response = await axios({
                   method:'post',
                   url:`/payments/create?total=${getBasketTotal(basket)*100}`
               //request
       });
 setClientSecret(response.data.clientSecret)
    }
        getClientSecret();
    },[basket] )
   console.log('The secret is >>>',clientSecret);
    const stripe = useStripe();
    const Elements = useElements();

    const handleSubmit = async (event) => {    
        event.preventDefault();
        setProcessing(true);
        
        const payload = await stripe.confirmCardPayment( clientSecret,{
           payment_method:{
               card:Elements.getElement(CardElement)
           }
        }).then(({paymentIntent})=>{
              db.collection('users')
              .doc(user?.uid)
              .collection('orders')
              .doc(paymentIntent.id)
              .set({
                basket:basket,
                amount:paymentIntent.amount,
                created: paymentIntent.created
              })


           setSucceeded(true);
           setError(null)
           setProcessing(false)
          dispatch({
            type: 'EMPTY_BASKET'
          })
        })
    }
    
    const handleChange = event =>{
             setDisabled(event.empty);  
             setError(event.error ? event.error.message : "");       

    }
    
    return (

        <div className="payment">
            <div className="payment__container">
                <h1>
                    Checkout (<Link to="/checkout">{basket?.length} items</Link>)
                </h1>
                {/*address*/}
                <div className="payment__section">
                  <div className="payment__title">
                      <h3>Delivery Address:</h3>
                  </div>
                  <div className="payment__address">
                      <p>{user?.email}</p>
                      <p>123 React lane</p>
                      <p>Los Angeles, CA</p>
                  </div> 
                      
                </div>
                 {/*review items*/}
                 <div className="payment__section">
                 <div className="payment__title">
                      <h3>Review Items and Delivery:</h3>
                  </div>
                     <div className="payment__items">
                         {basket.map(item=>
                            <CheckoutProduct
                            id={item.id}
                            title={item.title}
                            image={item.image}
                            price={item.price}
                            rating={item.rating}
                            />)}
                     </div>
                    
                </div>
                 {/*payment method*/}
                 <div className="payment__section">
                     <div className="payment__title">
                      <h3>Payment Method:</h3>
                    </div>  
                  <div className="payment__details">
                     {/*Stripe magic will go here */}

                     <form onSubmit={handleSubmit}>
                         <CardElement  onChange={handleChange}/>
                         <div className='payment__priceContainer'>
                          <CurrencyFormat
                          renderText={(value) => (
                            <>
                              <h3>Order Total: {value}</h3>
                            </>
                          )}
                          decimalScale={2}
                          value={getBasketTotal(basket)} // Part of the homework
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"₹"}/>
                        <button disabled={processing || disabled || succeeded}>
                          <span>{processing ? <p>Processing</p> && history.replace('/orders') : 'Buy now'}</span>
                                                                          
                        </button>
                        </div>    
                          {error && <div>{error}</div>}  
                     </form>
                  </div>
                </div>
            </div>
        </div>
    )
}

export default Payment
