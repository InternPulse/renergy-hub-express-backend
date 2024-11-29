import axios from "axios";
import { PAYSTACK_SECRET } from "./secrets";

const paystackClient = axios.create({
    baseURL: 'https://api.paystack.co',
    timeout: 5000, // Optional timeout
    headers: { 'Authorization': `Bearer ${PAYSTACK_SECRET}`  },
  });

export { paystackClient }