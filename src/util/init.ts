import { Application } from "express";
import { Route } from "./route";
import { ReviewRoute } from "./../user-management/review/reviewRoute";
import { OrderRoute } from "../order-management/order.route";
import { PaymentRoute } from "../payment-service/payment.route";
import { WishListRoute } from "../wishlist-management/wishlist.route";
import { ShippingAddressRoute } from "../order-management/shippingAddress/shipping.address.route";

const apiVersion = "/api/v1";

const routes: Record<string, Route> = {
  orders: new OrderRoute(),
  reviews: new ReviewRoute(),
  payments: new PaymentRoute(),
  wishlists: new WishListRoute(),
  shippingAddress: new ShippingAddressRoute()
};

export const initOrderRoutes = (app: any) => {
  Object.entries(routes).forEach(([url, route]) => {
    app.use(`${apiVersion}/${url}`, route.initRoutes());
  });
};
