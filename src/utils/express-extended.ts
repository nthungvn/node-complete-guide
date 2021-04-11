import { Request } from 'express';
import { IUser } from '../models/user';

export type CustomRequest = Request & { isAuth?: boolean; user?: IUser };
