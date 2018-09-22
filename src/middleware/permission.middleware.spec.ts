/// <reference path="../extensions.d.ts" />
import {
    RequestHandler
} from "express";
import { expect } from 'chai';
import * as sinon from 'sinon';
import 'mocha';
import * as testObject from './permission.middleware';
import {
    RouteError
} from "../routes/route-error";
import * as jwt from "jsonwebtoken";

describe('src/middleware/permission.middleware', () => {

    describe("createAuthorizationMiddleware", () => {

        let nextSpy: sinon.SinonSpy;
        let verifyStub: sinon.SinonStub;
        before(() => {
            nextSpy = sinon.spy();
            verifyStub = sinon.stub(jwt, "verify");
        });
        beforeEach(() => {
        })

        afterEach(() => {
            verifyStub.reset();
            nextSpy.resetHistory();
        });
        after(() => {
            verifyStub.restore();
        });
        it('should pass as unauthorized without header object', () => {
            const testInstance: any = { testdata1: 129, testdata2: "asdf" };
            verifyStub.callsArgWith(2, []);
            let asdf: RequestHandler = testObject.createAuthorizationMiddleware();
            let queryData: any = { offset: 2 };
            let req: any = { query: queryData };
            let res: any = {};
            expect(asdf).to.be.not.null;
            asdf(req, res, <any>nextSpy);
            expect(req.user).to.exist;
            expect(req.user).to.deep.equal({ "authorized": false });
            expect(nextSpy.callCount).to.equal(1);
            expect(nextSpy.getCall(0).args.length).to.equal(0);
        });
        it('should pass as unauthorized without header.authorization object', () => {
            const testInstance: any = { testdata1: 129, testdata2: "asdf" };
            verifyStub.callsArgWith(2, []);
            let asdf: RequestHandler = testObject.createAuthorizationMiddleware();
            let queryData: any = { offset: 2 };
            let req: any = { query: queryData, headers: { notAuthorization: 299 } };
            let res: any = {};
            expect(asdf).to.be.not.null;
            asdf(req, res, <any>nextSpy);
            expect(req.user).to.exist;
            expect(req.user).to.deep.equal({ "authorized": false });
            expect(nextSpy.callCount).to.equal(1);
            expect(nextSpy.getCall(0).args.length).to.equal(0);
        });
        it('should throw error for a user already being set', () => {
            const testInstance: any = { testdata1: 129, testdata2: "asdf" };
            verifyStub.callsArgWith(2, []);
            let asdf: RequestHandler = testObject.createAuthorizationMiddleware();
            let queryData: any = { offset: 2 };
            let req: any = { query: queryData, user: {}, headers: { authorization: 299 } };
            let res: any = {};
            expect(asdf).to.be.not.null;
            asdf(req, res, <any>nextSpy);
            expect(req.user).to.exist;
            expect(req.user).to.deep.equal({});
            expect(nextSpy.callCount).to.equal(1);
            expect(nextSpy.getCall(0).args.length).to.equal(1);
            const err: RouteError = nextSpy.getCall(0).args[0];
            expect(err.statusCode).to.equal(500);
            expect(err.message).to.equal("User Object already set");
        });
    });
});