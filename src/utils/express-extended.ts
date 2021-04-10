import { Request } from 'express';
import { IUser } from '../models/user.js';

export type CustomRequest = Request & { isAuth?: boolean; user?: IUser };
