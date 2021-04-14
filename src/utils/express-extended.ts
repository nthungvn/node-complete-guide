import { Request } from 'express';
import { UserDocument } from '../models/user';

export type CustomRequest = Request & { isAuth?: boolean; user?: UserDocument };
