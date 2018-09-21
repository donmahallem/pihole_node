import {
    Request,
    Response,
    RequestHandler
} from "express";
import { expect } from 'chai';
import * as sinon from 'sinon';
import 'mocha';
import * as testObject from './pihole-database';
import {
    RouteError
} from "../routes/route-error";

describe('src/helper/pihole-database', () => {

    describe("PiholeDatabase", () => {

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
        });
    });
});