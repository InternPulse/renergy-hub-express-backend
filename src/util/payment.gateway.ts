import { randomUUID } from "crypto";
import { paystackClient } from "./paystack";
import { uniqueId } from "lodash";

export const generatePaymentUrl = async(email: string, reference: string | undefined, amount: number) => {
    const url = '';

    try 
    {
        const response = await paystackClient.post('/transaction/initialize', { email, reference, amount});
        return <string>response.data.data.authorization_url;
    } 
    catch (error) 
    {
        throw(error);
    }
};

export const GenerateOrderNumber = (): string => {
    return uniqueId();
}