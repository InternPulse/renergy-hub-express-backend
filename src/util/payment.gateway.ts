import { randomUUID } from "crypto";
import { paystackClient } from "./paystack";
import { uniqueId } from "lodash";
import { v4 as uuidv4 } from 'uuid';

export const generatePaymentUrl = async(email: string, reference: string | undefined, amount: number) => {
    const url = '';

    const totalAmount = amount *= 100;

    try 
    {
        const response = await paystackClient.post('/transaction/initialize', { email, reference, totalAmount });
        return <string>response.data.data.authorization_url;
    } 
    catch (error) 
    {
        throw(error);
    }
};

export const GenerateOrderNumber = (): string => {
    return uuidv4();
}