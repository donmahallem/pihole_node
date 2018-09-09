/// <reference path="../extensions.d.ts" />
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
import * as jsonschema from "jsonschema";

describe('QueryParamTool', () => {

    describe("ParseFromToQUeryParameter", () => {

        var testStub: sinon.SinonStub;
        let nextSpy: sinon.SinonSpy;
        before(() => {
            testStub = sinon.stub(testObject, "rewriteDefaultValue");
            nextSpy = sinon.spy();
        });
        beforeEach(() => {
            testStub.returnsArg(0);
        })

        afterEach(() => {
            testStub.reset();
            nextSpy.resetHistory();
        });
        after(() => {
            testStub.restore();
        });
        it('should pass with query arguments', () => {
            let schema: jsonschema.Schema = {
                "type": "object",
                "properties": {
                    "offset": {
                        "type": "integer",
                        "minimum": 0
                    }
                }
            }
            let asdf: RequestHandler = testObject.queryParameterValidator(schema);
            let req: any = { query: { offset: 2 } };
            let res: any = {};
            expect(asdf).to.be.not.null;
            asdf(req, res, <any>nextSpy);
            expect(nextSpy.callCount).to.equal(1);
            expect(nextSpy.getCall(0).args.length).to.equal(0);

            expect(testStub.callCount).to.equal(2);
        });
        it('should pass without query arguments', () => {
            let schema: jsonschema.Schema = {
                "type": "object",
                "properties": {
                    "offset": {
                        "type": "integer",
                        "minimum": 0
                    }
                }
            }
            let asdf: RequestHandler = testObject.queryParameterValidator(schema);
            let req: any = {};
            let res: any = {};
            expect(asdf).to.be.not.null;
            asdf(req, res, nextSpy);
            expect(nextSpy.callCount).to.equal(1);
            expect(nextSpy.getCall(0).args.length).to.equal(0);

            expect(testStub.callCount).to.equal(2);
        });
        it('should not pass without required property', () => {
            let schema: jsonschema.Schema = {
                "type": "object",
                "properties": {
                    "offset": {
                        "type": "integer",
                        "minimum": 0
                    }
                },
                "required": [
                    "offset"
                ]
            }
            let asdf: RequestHandler = testObject.queryParameterValidator(schema);
            let req: any = { query: { randomArg: 229 } };
            let res: any = {};
            expect(asdf).to.be.not.null;
            asdf(req, res, nextSpy);
            expect(nextSpy.callCount).to.equal(1);
            expect(nextSpy.getCall(0).args.length).to.equal(1);
            expect(nextSpy.getCall(0).args[0]).to.be.instanceof(RouteError, "next should have been called with an RouteError");
            expect(nextSpy.getCall(0).args[0]).has.property("statusCode").equal(401, "should have a statusCode of 401");
            expect(testStub.callCount).to.equal(2);
        });
    });
    describe("rewriteDefaultValue", () => {

        it('should set default value if missing', () => {
            let schema: jsonschema.Schema = {
                "type": "integer",
                defaultValue: 29
            }
            const ctx: any = {};
            const result: any = testObject.rewriteDefaultValue(undefined, schema, {}, ctx);
            expect(result).to.equal(29);
        });
        it('should not set default value if missing', () => {
            let schema: jsonschema.Schema = {
                "type": "integer",
                defaultValue: 29
            }
            const ctx: any = {};
            const result: any = testObject.rewriteDefaultValue(54, schema, {}, ctx);
            expect(result).to.equal(54);
        });
    });
});