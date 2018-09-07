import {
    Request,
    Response,
    RequestHandler
} from "express";
import { expect } from 'chai';
import * as sinon from 'sinon';
import 'mocha';
import { QueryParameterType, QueryParameterFilter, HandleQueryParameterFilter, ParseFromToQueryParameter } from './query-param-tools';

describe('QueryParamTool', () => {

    describe("ParseFromToQUeryParameter", () => {

        let mockRequest;
        let mockResponse;
        let mockNext: sinon.spy;
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
    });

});