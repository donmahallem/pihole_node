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

describe('QueryParameterValidatorMiddleware', () => {

    describe("queryParameterValidator", () => {

        var testStub: sinon.SinonStub;
        let nextSpy: sinon.SinonSpy;
        let validateStub: sinon.SinonStub;
        before(() => {
            testStub = sinon.stub(testObject, "rewriteDefaultValue");
            nextSpy = sinon.spy();
            validateStub = sinon.stub(jsonschema, "validate");
        });
        beforeEach(() => {
            testStub.returnsArg(0);
        })

        afterEach(() => {
            testStub.reset();
            validateStub.reset();
            nextSpy.resetHistory();
        });
        after(() => {
            testStub.restore();
            validateStub.restore();
        });
        it('should pass with query property', () => {
            const testInstance: any = { testdata1: 129, testdata2: "asdf" };
            validateStub.returns({ valid: true, instance: testInstance });
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
            let queryData: any = { offset: 2 };
            let req: any = { query: queryData };
            let res: any = {};
            expect(asdf).to.be.not.null;
            asdf(req, res, <any>nextSpy);
            expect(nextSpy.callCount).to.equal(1);
            expect(nextSpy.getCall(0).args.length).to.equal(0);

            expect(validateStub.callCount).to.equal(1);
            expect(validateStub.getCall(0).args.length).to.equal(3);
            expect(validateStub.getCall(0).args[0]).to.deep.equal(queryData);
            expect(validateStub.getCall(0).args[1]).to.deep.equal(schema);
            const callArg3: jsonschema.Options = validateStub.getCall(0).args[2];
            expect(callArg3.allowUnknownAttributes).to.be.false;
            expect(callArg3.rewrite).to.equal(testObject.rewriteDefaultValue);
        });
        it('should pass with query property as string', () => {
            const testInstance: any = { testdata1: 129, testdata2: "asdf" };
            validateStub.returns({ valid: true, instance: testInstance });
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
            let queryData: any = { offset: "2" };
            let req: any = { query: queryData };
            let res: any = {};
            expect(asdf).to.be.not.null;
            asdf(req, res, <any>nextSpy);
            expect(nextSpy.callCount).to.equal(1);
            expect(nextSpy.getCall(0).args.length).to.equal(0);

            expect(validateStub.callCount).to.equal(1);
            expect(validateStub.getCall(0).args.length).to.equal(3);
            expect(validateStub.getCall(0).args[0]).to.deep.equal(queryData);
            expect(validateStub.getCall(0).args[1]).to.deep.equal(schema);
            const callArg3: jsonschema.Options = validateStub.getCall(0).args[2];
            expect(callArg3.allowUnknownAttributes).to.be.false;
            expect(callArg3.rewrite).to.equal(testObject.rewriteDefaultValue);
        });
        it('should pass without query property', () => {
            const testInstance: any = { testdata1: 129, testdata2: "asdf" };
            validateStub.returns({ valid: true, instance: testInstance });
            let schema: jsonschema.Schema = {
                "type": "object",
                "properties": {
                    "offset": {
                        "type": "integer",
                        "minimum": 0,
                        defaultValue: 29
                    }
                }
            }
            let asdf: RequestHandler = testObject.queryParameterValidator(schema);
            let queryData: any = {};
            let req: any = {};
            let res: any = {};
            expect(asdf).to.be.not.null;
            asdf(req, res, <any>nextSpy);
            expect(nextSpy.callCount).to.equal(1);
            expect(nextSpy.getCall(0).args.length).to.equal(0);

            expect(validateStub.callCount).to.equal(1);
            expect(validateStub.getCall(0).args.length).to.equal(3);
            expect(validateStub.getCall(0).args[0]).to.deep.equal(queryData, "should be an empty object");
            expect(validateStub.getCall(0).args[1]).to.deep.equal(schema);
            const callArg3: jsonschema.Options = validateStub.getCall(0).args[2];
            expect(callArg3.allowUnknownAttributes).to.be.false;
            expect(callArg3.rewrite).to.equal(testObject.rewriteDefaultValue);
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
        it('should parse string as integer', () => {
            let schema: jsonschema.Schema = {
                "type": "integer",
            }
            const ctx: any = {};
            const result: any = testObject.rewriteDefaultValue("29", schema, {}, ctx);
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
        it('should set default value for nested', () => {
            let schema: jsonschema.Schema = {
                "type": "object",
                "properties": {
                    "offset": {
                        "type": "integer",
                        "minimum": 0,
                        defaultValue: 29
                    }
                }
            }
            const options: jsonschema.Options = {
                rewrite: testObject.rewriteDefaultValue
            };
            const instance: any = {

            };
            const resultInstance: any = {
                offset: 29
            };

            const result: jsonschema.ValidatorResult = jsonschema.validate(instance, schema, options);
            expect(result.valid).to.be.true;
            expect(result.instance).to.deep.equal(resultInstance);
        });
    });
});