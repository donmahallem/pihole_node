import {
    Request,
    Response,
    RequestHandler
} from "express";
import { expect } from 'chai';
import * as sinon from 'sinon';
import 'mocha';
import * as testObject from './query-param-tools';
import {
    RouteError
} from "../routes/route-error";

describe('QueryParamTool', () => {

    describe("ParseFromToQUeryParameter", () => {

        var mockRequest;
        var mockResponse;
        var mockNext: sinon.SinonSpy;
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
            expect(1).to.equal(1);
            let asdf: RequestHandler = testObject.ParseFromToQueryParameter();
            expect(asdf).to.be.not.null;
            mockRequest = {};
            mockResponse = {};
            asdf(mockRequest, mockResponse, mockNext);
            sinon.assert.calledOnce(mockNext);
            expect(mockNext.getCall(0).args.length).to.be.equal(0);
            expect(mockRequest).to.deep.equal({});
        });
        it('should pass with query arguments', () => {
            expect(1).to.equal(1);
            let asdf: RequestHandler = testObject.ParseFromToQueryParameter();
            expect(asdf).to.be.not.null;
            mockRequest = { query: {} };
            mockResponse = {};
            asdf(mockRequest, mockResponse, mockNext);
            sinon.assert.calledOnce(mockNext);
            expect(mockNext.getCall(0).args.length).to.be.equal(0);
            expect(mockRequest).to.deep.equal({ query: {} });
        });
        it('should pass with query arguments for from', () => {
            expect(1).to.equal(1);
            let asdf: RequestHandler = testObject.ParseFromToQueryParameter();
            expect(asdf).to.be.not.null;
            mockRequest = { query: { from: "19" } };
            mockResponse = {};
            asdf(mockRequest, mockResponse, mockNext);
            sinon.assert.calledOnce(mockNext);
            expect(mockNext.getCall(0).args.length).to.be.equal(0);
            expect(mockRequest).to.deep.equal({ query: { from: 19 } });
        });
        it('should pass with query arguments for from and round floating point', () => {
            expect(1).to.equal(1);
            let asdf: RequestHandler = testObject.ParseFromToQueryParameter();
            expect(asdf).to.be.not.null;
            mockRequest = { query: { from: "19.124" } };
            mockResponse = {};
            asdf(mockRequest, mockResponse, mockNext);
            sinon.assert.calledOnce(mockNext);
            expect(mockNext.getCall(0).args.length).to.be.equal(0);
            expect(mockRequest).to.deep.equal({ query: { from: 19 } });
        });
        it('should throw error for invalid from parameter', () => {
            expect(1).to.equal(1);
            let asdf: RequestHandler = testObject.ParseFromToQueryParameter();
            expect(asdf).to.be.not.null;
            mockRequest = { query: { from: "asdf213f" } };
            mockResponse = {};
            asdf(mockRequest, mockResponse, mockNext);
            sinon.assert.calledOnce(mockNext);
            const call: sinon.SinonSpyCall = mockNext.getCall(0);
            expect(call.args.length).to.be.equal(1);
            expect(call.args[0] instanceof RouteError).to.be.true;
            expect(call.args[0].statusCode).to.equal(401);
        });
    });

    describe("HandleQueryParameterFilter", () => {

        var mockHandleIntegerQueryParameter;
        var mockHandleBooleanQueryParameter;
        var mockHandleNumberQueryParameter;
        var mockHandleStringQueryParameter;
        var mockResponse;
        var mockNext: sinon.SinonSpy;
        beforeEach((done) => {
            mockResponse = sinon.mock({});
            mockNext = sinon.spy();
            mockHandleIntegerQueryParameter = sinon.stub(testObject, "handleIntegerQueryParameter");
            mockHandleBooleanQueryParameter = sinon.stub(testObject, "handleBooleanQueryParameter");
            mockHandleNumberQueryParameter = sinon.stub(testObject, "handleNumberQueryParameter");
            mockHandleStringQueryParameter = sinon.stub(testObject, "handleStringQueryParameter");
            done();
            //mockRequest.expects("method").once().throws();
        });

        afterEach(() => {
            mockHandleIntegerQueryParameter.restore();
            mockHandleBooleanQueryParameter.restore();
            mockHandleNumberQueryParameter.restore();
            mockHandleStringQueryParameter.restore();
            //mockRequest.verify();
            //mockResponse.verify();
        });

        it('should pass if no parameter matches and optional', () => {
            const filter: testObject.QueryParameterFilter = {
                required: false,
                name: "randomName",
                type: testObject.QueryParameterType.INTEGER
            };
            testObject.HandleQueryParameterFilter({}, filter);
            expect(mockHandleIntegerQueryParameter.callCount).to.equal(0);
            expect(mockHandleBooleanQueryParameter.callCount).to.equal(0);
            expect(mockHandleNumberQueryParameter.callCount).to.equal(0);
            expect(mockHandleStringQueryParameter.callCount).to.equal(0);
        });
        it('should fail if no parameter matches and optional', () => {
            const filter: testObject.QueryParameterFilter = {
                required: true,
                name: "randomName",
                type: testObject.QueryParameterType.INTEGER
            };
            expect(function () {
                testObject.HandleQueryParameterFilter({}, filter);
            }).to.throw(RouteError, '"randomName" query parameter is required')
                .with.property('statusCode', 401);
            expect(mockHandleIntegerQueryParameter.callCount).to.equal(0);
            expect(mockHandleBooleanQueryParameter.callCount).to.equal(0);
            expect(mockHandleNumberQueryParameter.callCount).to.equal(0);
            expect(mockHandleStringQueryParameter.callCount).to.equal(0);
        });
        it('should delegate to integer handler', () => {
            const filter: testObject.QueryParameterFilter = {
                required: true,
                name: "randomName",
                type: testObject.QueryParameterType.INTEGER
            };
            testObject.HandleQueryParameterFilter({ "randomName": 29 }, filter);
            expect(mockHandleIntegerQueryParameter.callCount).to.equal(1);
            expect(mockHandleBooleanQueryParameter.callCount).to.equal(0);
            expect(mockHandleNumberQueryParameter.callCount).to.equal(0);
            expect(mockHandleStringQueryParameter.callCount).to.equal(0);
        });
        it('should delegate to number handler', () => {
            const filter: testObject.QueryParameterFilter = {
                required: true,
                name: "randomName",
                type: testObject.QueryParameterType.NUMBER
            };
            testObject.HandleQueryParameterFilter({ "randomName": 29 }, filter);
            expect(mockHandleIntegerQueryParameter.callCount).to.equal(0);
            expect(mockHandleBooleanQueryParameter.callCount).to.equal(0);
            expect(mockHandleNumberQueryParameter.callCount).to.equal(1);
            expect(mockHandleStringQueryParameter.callCount).to.equal(0);
        });
        it('should delegate to boolean handler', () => {
            const filter: testObject.QueryParameterFilter = {
                required: true,
                name: "randomName",
                type: testObject.QueryParameterType.BOOLEAN
            };
            testObject.HandleQueryParameterFilter({ "randomName": 29 }, filter);
            expect(mockHandleIntegerQueryParameter.callCount).to.equal(0);
            expect(mockHandleBooleanQueryParameter.callCount).to.equal(1);
            expect(mockHandleNumberQueryParameter.callCount).to.equal(0);
            expect(mockHandleStringQueryParameter.callCount).to.equal(0);
        });
        it('should delegate to string handler', () => {
            const filter: testObject.QueryParameterFilter = {
                required: true,
                name: "randomName",
                type: testObject.QueryParameterType.STRING
            };
            testObject.HandleQueryParameterFilter({ "randomName": 29 }, filter);
            expect(mockHandleIntegerQueryParameter.callCount).to.equal(0);
            expect(mockHandleBooleanQueryParameter.callCount).to.equal(0);
            expect(mockHandleNumberQueryParameter.callCount).to.equal(0);
            expect(mockHandleStringQueryParameter.callCount).to.equal(1);
        });
        it('should set default', () => {
            const filter: testObject.QueryParameterFilter = {
                required: false,
                name: "randomName",
                type: testObject.QueryParameterType.BOOLEAN,
                default: 29
            };
            let testData: any = { "randomName2": "29" };
            testObject.HandleQueryParameterFilter(testData, filter);
            expect(mockHandleIntegerQueryParameter.callCount).to.equal(0);
            expect(mockHandleBooleanQueryParameter.callCount).to.equal(0);
            expect(mockHandleNumberQueryParameter.callCount).to.equal(0);
            expect(mockHandleStringQueryParameter.callCount).to.equal(0);
            expect(testData).to.deep.equal({ "randomName2": "29", "randomName": 29 });
        });
    });
    describe("handleIntegerQueryParameter", () => {

        it('should pass if no parameter matches and optional', () => {
            const filter: testObject.QueryParameterFilter = {
                required: false,
                name: "randomName",
                type: testObject.QueryParameterType.INTEGER
            };
            let testValue: any = { "randomName": "129" };
            testObject.handleIntegerQueryParameter(testValue, filter);
            expect(testValue).to.deep.equal({ "randomName": 129 });
        });
        it('should fail if no parameter matches and optional', () => {
            const filter: testObject.QueryParameterFilter = {
                required: true,
                name: "randomName",
                type: testObject.QueryParameterType.INTEGER
            };
            expect(function () {
                let testValue: any = { "randomName": "129j" };
                testObject.handleIntegerQueryParameter(testValue, filter);
            }).to.throw(RouteError, '"randomName" query parameter is not an Integer')
                .with.property('statusCode', 401);
        });
        it('should fail for value being below minimum', () => {
            const filter: testObject.QueryParameterFilter = {
                required: true,
                name: "randomName",
                type: testObject.QueryParameterType.INTEGER,
                min: 10
            };
            expect(function () {
                let testValue: any = { "randomName": "1" };
                testObject.handleIntegerQueryParameter(testValue, filter);
            }).to.throw(RouteError, '"randomName" query parameter must not be smaller than 10')
                .with.property('statusCode', 401);
        });
        it('should fail for value above maximum', () => {
            const filter: testObject.QueryParameterFilter = {
                required: true,
                name: "randomName",
                type: testObject.QueryParameterType.INTEGER,
                max: 100
            };
            expect(function () {
                let testValue: any = { "randomName": "129" };
                testObject.handleIntegerQueryParameter(testValue, filter);
            }).to.throw(RouteError, '"randomName" query parameter must not be larger than 100')
                .with.property('statusCode', 401);
        });
        it('should pass for being between max and min', () => {
            const filter: testObject.QueryParameterFilter = {
                required: true,
                name: "randomName",
                type: testObject.QueryParameterType.INTEGER,
                max: 100,
                min: 10
            };
            let testValue: any = { "randomName": "29" };
            testObject.handleIntegerQueryParameter(testValue, filter);
            expect(testValue).to.deep.equal({ "randomName": 29 });
        });
    });
});