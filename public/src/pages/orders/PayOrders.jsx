import { useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";
import { useGetOrderDetailsQuery } from "../../redux/api/apiSlice";
import { usePayOrderMutation } from "../../redux/api/apiSlice";
import { useConfirmPaymentMutation } from "../../redux/api/apiSlice";
import { useDispatch } from "react-redux";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import {
  MIDTRANS_CLIENT_KEY,
  MIDTRANS_CLIENT_URL,
} from "../../redux/constants";

const PayOrders = () => {
  const { id: orderId } = useParams();
  const { data: details } = useGetOrderDetailsQuery(orderId);
  const [confirmPayment] = useConfirmPaymentMutation();
  const [payOrder] = usePayOrderMutation();
  const [snapToken, setSnapToken] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = MIDTRANS_CLIENT_URL; // Gunakan URL sandbox untuk pengujian
    script.setAttribute("data-client-key", MIDTRANS_CLIENT_KEY);
    script.async = true;
    document.body.appendChild(script);

    const fetchData = async () => {
      try {
        const res = await payOrder(orderId);
        setSnapToken(res.data.token);
        // console.log(res.data.token);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, [details, orderId, payOrder]);

  const updateConfirmPayment = useCallback(async () => {
    try {
      const res = await confirmPayment(orderId);
      console.log(res.error);
    } catch (error) {
      console.log(error.message);
    }
  }, [confirmPayment, orderId]);

  useEffect(() => {
    if (snapToken) {
      window.snap.pay(snapToken, {
        onSuccess: (result) => {
          console.log("Payment successful:", result);
          dispatch(clearCartItems());
          updateConfirmPayment();
        },
        onPending: (result) => {
          // Ketika pembayaran masih dalam proses (optional)
          console.log("Payment pending:", result);
        },
        onError: (error) => {
          // Ketika pembayaran gagal
          console.error("Payment error:", error);
        },
        onClose: () => {
          // Ketika widget ditutup tanpa selesaikan pembayaran
          console.log("Widget closed without payment");
        },
      });
    } else {
      console.error("Snap token is not available.");
    }
  }, [snapToken, dispatch, updateConfirmPayment]);

  return <div>{snapToken && <div id="midtrans-snap"></div>}</div>;
};

export default PayOrders;
