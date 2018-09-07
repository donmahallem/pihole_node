import {
    Request,
    Response,
    RequestHandler
} from "express";
import { expect } from 'chai';
import * as sinon from 'sinon';
import 'mocha';
import { QueryParameterType, QueryParameterFilter, HandleQueryParameterFilter, ParseFromToQueryParameter } from './query-param-tools';

describe('asdf', () => {

    var mockRequest;
    var mockResponse;
    var mockNext: sinon.spy;
    beforeEach(() => {
        mockRequest = sinon.mock({});
        mockResponse = sinon.mock({});
        mockNext = sinon.spy();
        //mockRequest.expects("method").once().throws();
    });

    afterEach(() => {

        //mockRequest.verify();
        //mockResponse.verify();
        sinon.assert.calledOnce(mockNext);
    });
    it('should return hello world', () => {
        expect(1).to.equal(1);
        let asdf: RequestHandler = ParseFromToQueryParameter();
        expect(asdf).to.be.not.null;
        mockRequest = {};
        mockResponse = {};
        asdf(mockRequest, mockResponse, mockNext);
    });

});