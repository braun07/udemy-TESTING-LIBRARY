import { useEffect, useState } from "react";
import { useOrderDetails } from "../../context/OrderDetails";
import Button from "react-bootstrap/Button";
import axios from "axios";
import AlertBanner from "../common/AlertBanner";

export default function OrderConfirmation({ setOrderPhase }) {
    const { resetOrder } = useOrderDetails();
    const [orderNumber, setOrderNumber] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        axios
            .post(`http://localhost:3030/order`)
            .then((response) => {
                setOrderNumber(response.data.orderNumber);
            })
            .catch((error) => {
                setError(true);
            })
    }, []);

    function handleClick() {
        resetOrder();

        setOrderPhase("inProgress");
    }

    const createOrderBtn = (<Button onClick={handleClick}>Create new order</Button>);
    if (error) {
        return (
            <>
                <AlertBanner message={null} variant={null} />
                {createOrderBtn}
            </>
        )
    }

    if (orderNumber) {
        return (
            <>
                <div style={{ textAlign: "center" }}>
                    <h1>Thank You!</h1>
                    <p>Order Number: {orderNumber}</p>
                    <p style={{ fontSize: "25%" }}>
                        as per our terms and conditions, nothing will happen now
                    </p>
                    {createOrderBtn}
                </div>
            </>
        )
    } else {
        return <div>Loading</div>;
    }
}