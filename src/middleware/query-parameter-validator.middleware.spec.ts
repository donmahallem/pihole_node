import {
    Request,
    Response,
    RequestHandler
} from "express";
import { expect } from 'chai';
import * as sinon from 'sinon';
import 'mocha';
import * as testObject from './query-parameter-validator.middleware';
import {
    RouteError
} from "../routes/route-error";
import { Schema, SchemaError } from "jsonschema";

describe('QueryParamTool', () => {

    describe("ParseFromToQUeryParameter", () => {

        var mockRequest;
        var mockResponse;
        var mockNext: sinon.spy;
        beforeEach((done) => {
            mockRequest = sinon.mock({});
            mockResponse = sinon.mock({});
            mockNext = sinon.spy();
            done();
            //mockRequest.expects("method").once().throws();
        });

        afterEach(() => {
            //mockRequest.verify();
            //mockResponse.verify();
        });
        it('should pass without query arguments', () => {
            let schema: Schema = {
                "type": "object",
                "properties": {
                    "offset": {
                        "type": "integer",
                        "minimum": 0
                    }
                },
                required: ["offset"]
            }
            let asdf: RequestHandler = testObject.queryParameterValidator(schema);
            let req: any = { query: { offset: 2 } };
            let res: any = {};
            let next: any = sinon.spy();
            expect(asdf).to.be.not.null;
            asdf(req, res, next);
            const nextSpy: sinon.Spy = next;
            expect(next.callCount).to.equal(1);
            expect(next.getCall(0).args.length).to.equal(1);
            expect(next.getCall(0).args[0]).to.be.an.instanceof(RouteError);
        });
    });
});