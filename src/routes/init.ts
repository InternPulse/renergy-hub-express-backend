import { Application } from "express";
import { OrderRoute } from "./order.route";
import { Route } from "./route";
import { AuthRoute } from "./auth.route";

const apiVersion = '/api/v1';

const routes: Record<string, Route> = {
    orders: new OrderRoute(),
    auth: new AuthRoute()
};

export const initRoutes = (app: any) =>{
    Object.entries(routes).forEach(([url, route]) => {
      app.use(`${apiVersion}/${url}`, route.initRoutes());
    });


}