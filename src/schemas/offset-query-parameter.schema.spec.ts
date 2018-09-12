import {
    Request,
    Response,
    RequestHandler
} from "express";
import { expect } from 'chai';
import * as sinon from 'sinon';
import 'mocha';
import * as express from "express";
import * as testObject from "./offset-query-parameter.schema";
import * as httpMocks from "node-mocks-http";
import * as jsonschema from "jsonschema";
import { of as rxjsOf } from "rxjs";

const createError = (err: jsonschema.ValidationError): string => {
    if (err)
        return err.property + " || " + err.message + " || " + err.name;
    return "no error";
}

describe('schemas/offset-query-parameter.schema', () => {
    describe('OffsetQueryParameterSchema', function () {
        describe('offset property', function () {
            it('should pass offset as a number', () => {
                let testData: any = { offset: 29 };
                let result: jsonschema.ValidatorResult = jsonschema.validate(testData, testObject.TopQueryParameterSchema);
                expect(result.valid).to.equal(true, createError(result.errors[0]));
                expect(result.instance).to.deep.equal(testData);
            });
            it('should not pass offset as a negative number', () => {
                let testData: any = { offset: -1 };
                let result: jsonschema.ValidatorResult = jsonschema.validate(testData, testObject.TopQueryParameterSchema);
                expect(result.valid).to.equal(false, createError(result.errors[0]));
                expect(result.instance).to.deep.equal(testData);
            });
            it('should pass offset as a number string', () => {
                let testData: any = { offset: "29" };
                let result: jsonschema.ValidatorResult = jsonschema.validate(testData, testObject.TopQueryParameterSchema);
                expect(result.valid).to.equal(true, createError(result.errors[0]));
                expect(result.instance).to.deep.equal(testData);
            });

        });
        describe('limit property', function () {
            it('should pass limit as a number', () => {
                let testData: any = { limit: 29 };
                let result: jsonschema.ValidatorResult = jsonschema.validate(testData, testObject.TopQueryParameterSchema);
                expect(result.valid).to.equal(true, createError(result.errors[0]));
                expect(result.instance).to.deep.equal(testData);
            });
            it('should not pass limit as a negative number', () => {
                let testData: any = { limit: -1 };
                let result: jsonschema.ValidatorResult = jsonschema.validate(testData, testObject.TopQueryParameterSchema);
                expect(result.valid).to.equal(false, createError(result.errors[0]));
                expect(result.instance).to.deep.equal(testData);
            });
            it('should not pass limit as a number bigger than 50', () => {
                let testData: any = { limit: 51 };
                let result: jsonschema.ValidatorResult = jsonschema.validate(testData, testObject.TopQueryParameterSchema);
                expect(result.valid).to.equal(false, createError(result.errors[0]));
                expect(result.instance).to.deep.equal(testData);
            });
            it('should pass limit as a number string', () => {
                let testData: any = { limit: "29" };
                let result: jsonschema.ValidatorResult = jsonschema.validate(testData, testObject.TopQueryParameterSchema);
                expect(result.valid).to.equal(true, createError(result.errors[0]));
                expect(result.instance).to.deep.equal(testData);
            });

        });
        describe('from property', function () {
            it('should pass offset as a number', () => {
                let testData: any = { from: 29 };
                let result: jsonschema.ValidatorResult = jsonschema.validate(testData, testObject.TopQueryParameterSchema);
                expect(result.valid).to.equal(true, createError(result.errors[0]));
                expect(result.instance).to.deep.equal(testData);
            });
            it('should not pass from as a negative number', () => {
                let testData: any = { from: -1 };
                let result: jsonschema.ValidatorResult = jsonschema.validate(testData, testObject.TopQueryParameterSchema);
                expect(result.valid).to.equal(false, createError(result.errors[0]));
                expect(result.instance).to.deep.equal(testData);
            });
            it('should pass from as a number string', () => {
                let testData: any = { from: "29" };
                let result: jsonschema.ValidatorResult = jsonschema.validate(testData, testObject.TopQueryParameterSchema);
                expect(result.valid).to.equal(true, createError(result.errors[0]));
                expect(result.instance).to.deep.equal(testData);
            });
        });
    });
});