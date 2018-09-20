import {
    Request,
    Response,
    RequestHandler
} from 'express';
import { expect } from 'chai';
import * as sinon from 'sinon';
import 'mocha';
import {
    RouteError
} from '../route-error';
import * as testObject from './ads.endpoint';
import * as httpMocks from 'node-mocks-http';
import { PiholeDatabase } from '../../helper/pihole-database';
import { of as rxjsOf } from 'rxjs';
describe('routes/history/ads.endpoint', () => {
    describe('createAdsEndpoint', function () {
        var nextSpy: sinon.SinonSpy;
        var databaseStubbedInstance: sinon.SinonStubbedInstance<PiholeDatabase>;
        before(function () {
            nextSpy = sinon.spy();
            databaseStubbedInstance = sinon.createStubInstance(PiholeDatabase);
            databaseStubbedInstance.getAdsHistory
                .callsFake(() => {
                    return rxjsOf({ test: 'object' });
                })
        });
        afterEach(() => {
            databaseStubbedInstance.getAdsHistory.resetHistory();
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
                expect(res.header('Content-Type')).to.equal('application/json');
                expect(respBody).to.deep.equal({ data: [{ 'test': 'object' }] });
                expect(databaseStubbedInstance.getAdsHistory.callCount).to.equal(1);
                let call = databaseStubbedInstance.getAdsHistory.getCall(0);
                expect(call.args).to.deep.equal([undefined, undefined, undefined]);
                done();
            });
            const testa = testObject.createAdsEndpoint(<any>databaseStubbedInstance);
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
                expect(res.header('Content-Type')).to.equal('application/json');
                expect(respBody).to.deep.equal({ data: [{ 'test': 'object' }] });
                expect(databaseStubbedInstance.getAdsHistory.callCount).to.equal(1);
                let call = databaseStubbedInstance.getAdsHistory.getCall(0);
                expect(call.args).to.deep.equal([29, 299, undefined]);
                done();
            });
            const testa = testObject.createAdsEndpoint(<any>databaseStubbedInstance);
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
                expect(res.header('Content-Type')).to.equal('application/json');
                expect(respBody).to.deep.equal({ data: [{ 'test': 'object' }] });
                expect(databaseStubbedInstance.getAdsHistory.callCount).to.equal(1, 'getTopAds should just be called once');
                let call = databaseStubbedInstance.getAdsHistory.getCall(0);
                expect(call.args).to.deep.equal([2993, undefined, undefined]);
                done();
            });
            const testa = testObject.createAdsEndpoint(<any>databaseStubbedInstance);
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
                expect(res.header('Content-Type')).to.equal('application/json');
                expect(respBody).to.deep.equal({ data: [{ 'test': 'object' }] });
                expect(databaseStubbedInstance.getAdsHistory.callCount).to.equal(1, 'getTopAds should just be called once');
                let call = databaseStubbedInstance.getAdsHistory.getCall(0);
                expect(call.args).to.deep.equal([undefined, 594, undefined]);
                done();
            });
            const testa = testObject.createAdsEndpoint(<any>databaseStubbedInstance);
            testa(req, res, nextSpy);
        });
        it('should respond with client present', (done) => {
            let req = httpMocks.createRequest({
                query: {
                    to: 594,
                    client: 'randomclient'
                }
            });
            let res = httpMocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });
            res.on('end', function () {
                expect(nextSpy.callCount).to.equal(0);
                expect(res.statusCode).to.equal(200);
                let respBody: any = JSON.parse(res._getData());
                expect(res.header('Content-Type')).to.equal('application/json');
                expect(respBody).to.deep.equal({ data: [{ 'test': 'object' }] });
                expect(databaseStubbedInstance.getAdsHistory.callCount).to.equal(1, 'getTopAds should just be called once');
                let call = databaseStubbedInstance.getAdsHistory.getCall(0);
                expect(call.args).to.deep.equal([undefined, 594, 'randomclient']);
                done();
            });
            const testa = testObject.createAdsEndpoint(<any>databaseStubbedInstance);
            testa(req, res, nextSpy);
        });
    });
});