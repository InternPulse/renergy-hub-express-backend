import { Router } from "express";

export abstract class Route {
	readonly name: string | undefined;
	readonly router: Router;

	abstract initRoutes(): Router;

	constructor() {
		this.router = Router();
	  }
}