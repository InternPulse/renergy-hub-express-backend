import { Response } from "express";

export const success = (res: Response, status: number, entity: any = [], msg = "") => res
    .status(status || 200)
    .json({
        success: true,
        statusCode: status,
        message: msg || "Successful",
        payload: entity || undefined,
    });

export const fail = (res: Response, status: number, msg = "") => res
    .status(status || 500)
    .json({
        success: false,
        statusCode: status,
        message: msg || "Failed"
    });

export const response = (res: Response, status: number, entity: any, msg = "") => res
.status(status || 200)
.json({
    success: true,
    message: entity.msg || msg || "Successful",
    metadata: { 
        total: entity.total || 0,
        limit: entity.limit || 0,
        count: entity.count || 0,
        skip: entity.skip || 0,
        page: (Math.floor((entity.skip + entity.limit) / entity.limit)) || 1,
        sort: entity.sort || "createdAt",
    },
    payload: entity.payload || [],
});

export enum ResponseCode
{
    SIGNUP = "SIGNUP",
    FORGOT_PASSWORD = "FORGOT_PASSWORD",
    TWO_FACTOR = "TWO_FACTOR"
}
