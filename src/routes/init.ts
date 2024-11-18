import { Application } from "express";
import { OrderRoute } from "./orderRoute";
import { Route } from "./route";
import { ReviewRoute } from "./reviewRoute";

const apiVersion = '/api/v1';

const routes: Record<string, Route> = {
    orders: new OrderRoute(),
    reviews: new ReviewRoute()

};

export const initRoutes = (app: any) =>{
    Object.entries(routes).forEach(([url, route]) => {
      app.use(`${apiVersion}/${url}`, route.initRoutes());
    });


}