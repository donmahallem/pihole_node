import {
    Request,
    Response,
    RequestHandler
} from "express";
import { expect } from 'chai';
import * as sinon from 'sinon';
import 'mocha';
import {
    RouteError
} from "../route-error";
import * as express from "express";
import * as testObject from "./combined.endpoint";
import * as httpMocks from "node-mocks-http";
import { PiholeDatabase } from "../../helper/pihole-database";
import { of as rxjsOf } from "rxjs";
describe('routes/history/combined.endpoint', () => {
    describe('createCombinedEndpoint', function () {
        var nextSpy: sinon.SinonSpy;
        var databaseStubbedInstance: sinon.SinonStubbedInstance<PiholeDatabase>;
        before(function () {
            nextSpy = sinon.spy();
            databaseStubbedInstance = sinon.createStubInstance(PiholeDatabase);
            databaseStubbedInstance.getCombinedHistory
                .callsFake(() => {
                    return rxjsOf({ "test": "object" });
                })
        });
        afterEach(() => {
            databaseStubbedInstance.getCombinedHistory.resetHistory();
        });
        after(() => {
        })

        it('should respond without query parameters', (done) => {
            let req = httpMocks.createRequest({
                query: undefined
            });
            let res = httpMocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });
            res.on('end', function () {
                expect(nextSpy.callCount).to.equal(0);
                expect(res.statusCode).to.equal(200);
                let respBody: any = JSON.parse(res._getData());
                expect(res.header("Content-Type")).to.equal("application/json");
                expect(respBody).to.deep.equal({ data: [{ "test": "object" }] });
                expect(databaseStubbedInstance.getCombinedHistory.callCount).to.equal(1);
                let call = databaseStubbedInstance.getCombinedHistory.getCall(0);
                expect(call.args).to.deep.equal([undefined, undefined]);
                done();
            });
            const testa = testObject.createCombindedEndpoint(<any>databaseStubbedInstance);
            testa(req, res, nextSpy);
        });

        it('should respond with both query parameter', (done) => {
            let req = httpMocks.createRequest({
                query: {
                    from: 29,
                    to: 299
                }
            });
            let res = httpMocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });
            res.on('end', function () {
                expect(nextSpy.callCount).to.equal(0);
                expect(res.statusCode).to.equal(200);
                let respBody: any = JSON.parse(res._getData());
                expect(res.header("Content-Type")).to.equal("application/json");
                expect(respBody).to.deep.equal({ data: [{ "test": "object" }] });
                expect(databaseStubbedInstance.getCombinedHistory.callCount).to.equal(1);
                let call = databaseStubbedInstance.getCombinedHistory.getCall(0);
                expect(call.args).to.deep.equal([29, 299]);
                done();
            });
            const testa = testObject.createCombindedEndpoint(<any>databaseStubbedInstance);
            testa(req, res, nextSpy);
        });


        it('should respond with just from present', (done) => {
            let req = httpMocks.createRequest({
                query: {
                    from: 2993
                }
            });
            let res = httpMocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });
            res.on('end', function () {
                expect(nextSpy.callCount).to.equal(0);
                expect(res.statusCode).to.equal(200);
                let respBody: any = JSON.parse(res._getData());
                expect(res.header("Content-Type")).to.equal("application/json");
                expect(respBody).to.deep.equal({ data: [{ "test": "object" }] });
                expect(databaseStubbedInstance.getCombinedHistory.callCount).to.equal(1, "getTopAds should just be called once");
                let call = databaseStubbedInstance.getCombinedHistory.getCall(0);
                expect(call.args).to.deep.equal([2993, undefined]);
                done();
            });
            const testa = testObject.createCombindedEndpoint(<any>databaseStubbedInstance);
            testa(req, res, nextSpy);
        });
        it('should respond with just to present', (done) => {
            let req = httpMocks.createRequest({
                query: {
                    to: 594
                }
            });
            let res = httpMocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });
            res.on('end', function () {
                expect(nextSpy.callCount).to.equal(0);
                expect(res.statusCode).to.equal(200);
                let respBody: any = JSON.parse(res._getData());
                expect(res.header("Content-Type")).to.equal("application/json");
                expect(respBody).to.deep.equal({ data: [{ "test": "object" }] });
                expect(databaseStubbedInstance.getCombinedHistory.callCount).to.equal(1, "getTopAds should just be called once");
                let call = databaseStubbedInstance.getCombinedHistory.getCall(0);
                expect(call.args).to.deep.equal([undefined, 594]);
                done();
            });
            const testa = testObject.createCombindedEndpoint(<any>databaseStubbedInstance);
            testa(req, res, nextSpy);
        });
    });
});