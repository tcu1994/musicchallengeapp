import { useEffect, useState } from "react";
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import { Link, useLinkClickHandler } from 'react-router-dom'
// This values are the props in the UI

const currency = "USD";
const style = {"layout":"vertical", "color" : "black"};

// Custom component to wrap the PayPalButtons and handle currency changes
const ButtonWrapper = ({ currency, showSpinner, amount }) => {
    // usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
    // This is the main reason to wrap the PayPalButtons in a new component
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

    useEffect(() => {
        dispatch({
            type: "resetOptions",
            value: {
                ...options,
                currency: currency,
            },
        });
    }, [currency, showSpinner]);


    return (<>
            { (showSpinner && isPending) && <div className="spinner" /> }
            <PayPalButtons
                style={style}
                disabled={false}
                forceReRender={[amount, currency, style]}
                fundingSource={undefined}
                createOrder={(data, actions) => {
                    return actions.order
                        .create({
                            purchase_units: [
                                {
                                    amount: {
                                        currency_code: currency,
                                        value: amount,
                                    },
                                },
                            ],
                        })
                        .then((orderId) => {
                            // Your code here after create the order
                            return orderId;
                        });
                }}
                onApprove={function (data, actions) {
                    return actions.order.capture().then(function () {
                        // Your code here after capture the order
                    });
                }}
            />
        </>
    );
}

export default function App() {
  const [amount, setAmount] = useState(2.00);
 
	return (
   

		<div style={{ maxWidth: "350px", minHeight: "200px", margin: 'auto', paddingTop : '80px'}}>
      {/* <Link style={{borderRadius : '0px', marginTop : '30px', backgroundColor : 'black', color: 'white', float: 'right'}} className="ui button" to="/">
                Back
            </Link> */}
      <h1>Music challenge app</h1>
      
      <div style={{marginBottom : '20px'}}>Thank you for chosing to donate</div>
      <div>
        <label>Donation amount:</label>
        <input type="number" style={{color : 'white', background : 'black', border : '1px solid grey'}}value={amount} onChange={(e) => {
          setAmount(e.target.value);
        }}></input>USD
      </div>
            <PayPalScriptProvider
                options={{
                    "client-id": "AVSxH6Zo3DwHJB9dG9fqniq01GTy6ibQM05QBToOwFbyQKWSsNhqL7UskFpjGm1pdLD-lGyrDtaUh-dc",
                    components: "buttons",
                    currency: "USD"
                }}
            >
				<ButtonWrapper 
                    currency={currency}
                    amount={amount}
                    showSpinner={false}
                />
			</PayPalScriptProvider>
		</div>
	);
}
