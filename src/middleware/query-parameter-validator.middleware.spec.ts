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

        it('should pass without query arguments', () => {
            let schema: Schema = {
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
            let next: any = sinon.spy();
            expect(asdf).to.be.not.null;
            asdf(req, res, next);
            const nextSpy: sinon.SinonSpy = next;
            expect(next.callCount).to.equal(1);
            expect(next.getCall(0).args.length).to.equal(0);
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
            let req: any = { query: { offset: "2a" } };
            let res: any = {};
            let next: any = sinon.spy();
            expect(asdf).to.be.not.null;
            asdf(req, res, next);
            const nextSpy: sinon.SinonSpy = next;
            expect(next.callCount).to.equal(1);
            expect(next.getCall(0).args.length).to.equal(1);
            expect(next.getCall(0).args[0]).to.be.an.instanceof(RouteError);
        });
        it('should pass without query object', () => {
            let schema: Schema = {
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
            let next: any = sinon.spy();
            expect(asdf).to.be.not.null;
            asdf(req, res, next);
            const nextSpy: sinon.SinonSpy = next;
            expect(next.callCount).to.equal(1);
            expect(next.getCall(0).args.length).to.equal(0);
        });
        it('should fail due to missing required object', () => {
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
            let req: any = {};
            let res: any = {};
            let next: any = sinon.spy();
            expect(asdf).to.be.not.null;
            asdf(req, res, next);
            const nextSpy: sinon.SinonSpy = next;
            expect(next.callCount).to.equal(1);
            expect(next.getCall(0).args.length).to.equal(1);
            expect(next.getCall(0).args[0]).to.be.an.instanceof(RouteError);
        });
    });
});