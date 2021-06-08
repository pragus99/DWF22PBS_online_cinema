import { useEffect, useContext } from "react";
import { API } from "../service/api";
import { UserContext } from "../service/userContext";

const Snap = ({ data }) => {
  const [state] = useContext(UserContext);

  const handleBuy = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({
      personId: state.user.id,
      filmId: data.id,
    });
    const transaction = await API.post("/transaction", body, config);

    const order = {
      order_id: transaction.data.data.id,
      total_amount: data.price,
      customer: {
        name: state.user.name,
        email: state.user.email,
        id: state.user.id,
        phone: state.user.phone,
      },
    };
    const responseToken = await API.post(
      "/order",
      JSON.stringify(order),
      config
    );

    const token = responseToken.data.data.token;

    window.snap.pay(token, {
      onSuccess: async function (result) {
        console.log("success");
        console.log(result);
        const { order_id, gross_amount, payment_type } = result;
        const body = {
          order_id,
          gross_amount,
          payment_type,
        };
        await API.post("/mail-notif", JSON.stringify(body), config);
      },
      onPending: async function (result) {
        console.log("pending");
        const { order_id, gross_amount, payment_type } = result;
        const body = {
          order_id,
          gross_amount,
          payment_type,
        };
        await API.post("/mail-notif", JSON.stringify(body), config);
      },
      onError: function (result) {
        console.log("error");
      },
      onClose: function () {
        console.log("customer closed the popup without finishing the payment");
      },
    });
  };

  useEffect(() => {
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const midtransClientKey = "SB-Mid-client-D1UCzFbCkflWcvS5";

    const scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    scriptTag.setAttribute("data-client-key", midtransClientKey);

    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  return (
    <div>
      <button className="btn-mymodal btn-buy" onClick={handleBuy}>
        Midtrans Payment
      </button>
    </div>
  );
};

export default Snap;
