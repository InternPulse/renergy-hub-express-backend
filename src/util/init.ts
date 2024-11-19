import { Application } from "express";
import { Route } from "./route";
import { OrderRoute } from "../order-management/order.route";

const apiVersion = '/api/v1';

const routes: Record<string, Route> = {
    orders: new OrderRoute()
};

export const initOrderRoutes = (app: any) =>{
    Object.entries(routes).forEach(([url, route]) => {
      app.use(`${apiVersion}/${url}`, route.initRoutes());
    });

}
