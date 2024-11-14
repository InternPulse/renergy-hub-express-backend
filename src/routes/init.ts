import { Application } from "express";
import { OrderRoute } from "./orderRoute";
import { Route } from "./route";

const apiVersion = '/api/v1';

const routes: Record<string, Route> = {
    orders: new OrderRoute()
};

export const initRoutes = (app: any) =>{
    Object.entries(routes).forEach(([url, route]) => {
      app.use(`${apiVersion}/${url}`, route.initRoutes());
    });


}