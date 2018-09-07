import {
    Request,
    Response,
    RequestHandler
} from "express";
import { expect } from 'chai';
import * as sinon from 'sinon';
import 'mocha';
import {
    QueryParameterType,
    QueryParameterFilter,
    HandleQueryParameterFilter,
    ParseFromToQueryParameter
} from './query-param-tools';
import {
    RouteError
} from "../routes/route-error";

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
            expect(1).to.equal(1);
            let asdf: RequestHandler = ParseFromToQueryParameter();
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
            let asdf: RequestHandler = ParseFromToQueryParameter();
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
            let asdf: RequestHandler = ParseFromToQueryParameter();
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
            let asdf: RequestHandler = ParseFromToQueryParameter();
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
            let asdf: RequestHandler = ParseFromToQueryParameter();
            expect(asdf).to.be.not.null;
            mockRequest = { query: { from: "asdf213f" } };
            mockResponse = {};
            asdf(mockRequest, mockResponse, mockNext);
            sinon.assert.calledOnce(mockNext);
            const call: sinon.Spy = mockNext.getCall(0);
            expect(call.args.length).to.be.equal(1);
            expect(call.args[0] instanceof RouteError).to.be.true;
            expect(call.args[0].statusCode).to.equal(401);
        });
    });

    describe("HandleQueryParameterFilter", () => {

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

        it('should pass if no parameter matches and optional', () => {
            const filter: QueryParameterFilter = {
                required: false,
                name: "randomName",
                type: QueryParameterType.INTEGER
            };
            HandleQueryParameterFilter({}, filter);
        });
        it('should fail if no parameter matches and optional', () => {
            const filter: QueryParameterFilter = {
                required: true,
                name: "randomName",
                type: QueryParameterType.INTEGER
            };
            expect(function () {
                HandleQueryParameterFilter({}, filter);
            }).to.throw(RouteError, '"randomName" query parameter is required')
                .with.property('statusCode', 401);;
        });
    });
});