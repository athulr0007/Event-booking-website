import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    alert("Payment successful!");
    navigate("/bookings");
  }, [navigate]);

  return null;
}
