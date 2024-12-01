import { randomInt } from "crypto";
import { paystackClient } from "./paystack";
import { uniqueId } from "lodash";
import { v4 as uuidv4 } from 'uuid';

export const generatePaymentUrl = async(email: string, reference: string | undefined, totalAmount: number) => {
    const url = '';

    let amount = totalAmount * 100;

    try 
    {
        const response = await paystackClient.post('/transaction/initialize', { email, reference, amount });
        return <string>response.data.data.authorization_url;
    } 
    catch (error) 
    {
        throw(error);
    }
};

