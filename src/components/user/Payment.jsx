import Axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../utils/axios";
import { useNavigate } from "react-router-dom";

function PaymentPage(props) {
  const [user,setUser] =useState(null)
  const [paymentInProgress, setPaymentInProgress] = useState(false);

useEffect(()=>{
  const userData = JSON.parse(localStorage.getItem("user"));
  if (userData && userData.userID) {
    setUser(userData.userID);
  }
})

const history = useNavigate()

const {car,bookedSlot} = props
  
// this function will handel payment when user submit his/her money
// and it will confim if payment is successfull or not
  const handlePaymentSuccess = async (response) => {
    try {
      setPaymentInProgress(true);
      let bodyData = new FormData();

      // we will send the response we've got from razorpay to the backend to validate the payment
      bodyData.append("response", JSON.stringify(response));
      bodyData.append('slot',bookedSlot[0].id)

      await Axios({
        url: `${BASE_URL}/payment/success/`,
        method: "POST",
        data: bodyData,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          const paymentId = response.razorpay_payment_id;
          console.log("Payment ID:", paymentId);

          console.log("Everything is OK!");
          history('/success')


       
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(console.error());
    }
    finally {
      setPaymentInProgress(false); // Reset the payment process
    }
  };

  // this will load a script tag which will open up Razorpay payment card to make //transactions
  const loadScript = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  };

  const showRazorpay = async () => {
    const res = await loadScript();

    let bodyData = new FormData();
    // we will pass the amount and product name to the backend using form data
    bodyData.append("amount", car.price_per_day.toString());
    bodyData.append("name", car.renter.username);
    bodyData.append("user",user)
    bodyData.append('car',car.id)
    bodyData.append('slot',bookedSlot[0].id)

    const data = await Axios({
      url: `${BASE_URL}/payment/pay/`,
      method: "POST",
      data: bodyData,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: bodyData, 
    }).then((res) => {
      return res;
    });

  

    var options = {
      key_id: 'rzp_test_t7mDyb37sLmED8',
      key_secret: '4YMuQlfTvyvuyHgdtpyoxkDW',
   

      amount: data.data.payment.amount,
      currency: "INR",
      name: "Drive Now",
      description: "Test transaction",
      image: "", // add image url
      order_id: data.data.payment.id,
      handler: function (response) {
        // we will handle success by calling handlePaymentSuccess method and
        // will pass the response that we've got from razorpay
        handlePaymentSuccess(response);
      },
      prefill: {
        name: "username",
        email: "User's email",
        contact: "User's phone",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    var rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <div className=" h-1/6 " >
    <button
    onClick={showRazorpay}
    className={`${
      paymentInProgress
        ? 'bg-yellow-300 text-black py-2 px-4 rounded-md border-black mt-4 cursor-not-allowed'
        : 'bg-yellow-500 text-black py-2 px-4 rounded-md border-black mt-4'
    }`}
    disabled={paymentInProgress}
  >
    {paymentInProgress ? 'Processing...' : 'Confirm Booking'}
  </button>
  
    </div>
  );
}

export default PaymentPage;
