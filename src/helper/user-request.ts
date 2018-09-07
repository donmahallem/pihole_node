import * as express from "express";
import { User } from "./../models";

export interface UserRequest extends express.Request {
    user?: User;
}