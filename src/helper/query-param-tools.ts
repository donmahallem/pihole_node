import { RouteError } from "../routes/route-error";
import * as express from "express";
import { isNumber } from "util";

export enum QueryParameterType {
    NUMBER = 1,
    STRING = 2,
    BOOLEAN = 3,
    INTEGER = 4
}

export interface QueryParameterFilter {
    min?: number;
    max?: number;
    type: QueryParameterType;
    default?: any;
    required: boolean;
    name: string;
}

export const handleIntegerQueryParameter = (parameters: any, filter: QueryParameterFilter) => {
    const req: RegExp = /^(\+|\-)?[0-9]+$/;
    const parameterValue: any = parameters[filter.name];
    if (req.test(parameterValue)) {
        const value: number = parseInt(parameterValue);
        if (filter.min && value < filter.min) {
            throw new RouteError(401, "\"" + filter.name + "\" query parameter must not be smaller than " + filter.min);
        }
        if (filter.max && value > filter.max) {
            throw new RouteError(401, "\"" + filter.name + "\" query parameter must not be larger than " + filter.max);
        }
        parameters[filter.name] = value;
    } else {
        throw new RouteError(401, "\"" + filter.name + "\" query parameter is not an Integer");
    }
};
export const handleNumberQueryParameter = (parameter: any, filter: QueryParameterFilter) => {
    let value: any = parseFloat(parameter);
    if (isNumber(value)) {
        if (filter.min && value < filter.min) {
            throw new RouteError(401, "\"" + filter.name + "\" query parameter must not be smaller than " + filter.min);
        }
        if (filter.max && value > filter.max) {
            throw new RouteError(401, "\"" + filter.name + "\" query parameter must not be larger than " + filter.max);
        }
        parameter = value;
    } else {
        throw new RouteError(401, "\"" + filter.name + "\" query parameter is not a Number");
    }
};
export const handleBooleanQueryParameter = (parameter: any, filter: QueryParameterFilter) => {
    const reg: RegExp = /^(1|0|true|false)$/;
    if (reg.test(parameter)) {
        if (parameter == "true" || parameter == "1" || parameter == true) {
            parameter = true;
        } else {
            parameter = false;
        }
    } else {
        throw new RouteError(401, "\"" + filter.name + "\" query parameter is not a Boolean");
    }
};
export const handleStringQueryParameter = (parameter: any, filter: QueryParameterFilter) => {

    let value: any = parseFloat(parameter);
    if (isNumber(value)) {
        if (filter.min && value < filter.min) {
            throw new RouteError(401, "\"" + filter.name + "\" query parameter must not be smaller than " + filter.min);
        }
        if (filter.max && value > filter.max) {
            throw new RouteError(401, "\"" + filter.name + "\" query parameter must not be larger than " + filter.max);
        }
        parameter[filter.name] = value;
    } else {
        throw new RouteError(401, "\"" + filter.name + "\" query parameter is not a Number");
    }
};

export const HandleQueryParameterFilter = (parameters: any, filter: QueryParameterFilter): void => {
    if (filter.name in parameters) {
        const parameterValue: any = parameters[filter.name];
        switch (filter.type) {
            case QueryParameterType.INTEGER:
                handleIntegerQueryParameter(parameters, filter);
                return;
            case QueryParameterType.NUMBER:
                handleNumberQueryParameter(parameterValue, filter);
                return;
            case QueryParameterType.STRING:
                handleStringQueryParameter(parameterValue, filter);
                return;
            case QueryParameterType.BOOLEAN:
                handleBooleanQueryParameter(parameterValue, filter);
                return;

        }
    } else if (filter.required) {
        throw new RouteError(401, "\"" + filter.name + "\" query parameter is required");
    } else if (filter.default) {
        parameters[filter.name] = filter.default;
    }

}
export const LimitFilter: QueryParameterFilter = {
    min: 1,
    max: 100,
    type: QueryParameterType.INTEGER,
    default: 25,
    required: false,
    name: "limit"
}
export const OffsetFilter: QueryParameterFilter = {
    min: 0,
    type: QueryParameterType.INTEGER,
    default: 0,
    required: false,
    name: "offset"
}


export const ParseQueryParameterMiddleware = (filters: QueryParameterFilter[]): express.RequestHandler => {
    return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
        for (let filter of filters) {
            try {
                HandleQueryParameterFilter(req.query, filter);
            } catch (err) {
                next(err);
            }
        }
        next();
    };
}

export const ParseLimitQueryParameter = (limitNum: number = 25, min: number = 0, max: number = 100): express.RequestHandler => {
    return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
        let limit: number = limitNum;
        if (req.query) {
            const parsed: any = parseInt(req.query.limit);
            if (Number.isInteger(parsed)) {
                if (parsed < min) {
                    next(new RouteError(401, "Limit can't be smaller than " + min));
                    return;
                } else if (parsed > max) {
                    next(new RouteError(401, "Limit can't be larger than " + max));
                    return;
                }
                limit = parsed;
            } else {
                next(new RouteError(401, "Limit parameter is not number"));
                return;
            }
            if (req.query.offset) {

            }
        }
        req.query.limit = limit;
        next();
    }
}

export const ParseFromToQueryParameter = (): express.RequestHandler => {
    return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
        if (req.query) {
            if (req.query.from) {
                const parsedFrom: any = parseInt(req.query.from);
                if (Number.isInteger(parsedFrom)) {
                    req.query.from = parsedFrom;
                } else {
                    next(new RouteError(401, "From query parameter must be a number"));
                    return;
                }
            }
            if (req.query.to) {
                const parsedTo: any = parseInt(req.query.to);
                if (Number.isInteger(parsedTo)) {
                    req.query.to = parsedTo;
                } else {
                    next(new RouteError(401, "To query parameter must be a number"));
                    return;
                }
            }
        }
        next();
    }
}