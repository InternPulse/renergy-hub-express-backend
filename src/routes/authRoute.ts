import { lookup } from 'dns';
import { Router } from 'express';
import { login } from '../controller/auth';

const authRoutes: Router = Router();

authRoutes.post('/login', login);
