import {
    Request,
    Response,
    RequestHandler
} from "express";
import { expect } from 'chai';
import * as sinon from 'sinon';
import 'mocha';
import * as topEndpoint from "./common-util";
import { Validator } from "jsonschema";
import { ClientSchema, PageOffsetSchema, PageLimitSchema } from "../../schemas";
describe('routes/top/common-util', () => {
    describe('CommonUtil', function () {
        describe('createSchemaValidator()', function () {
            it('should contain only ClientSchema', () => {
                const schemaValidator: Validator = topEndpoint.CommonUtil.createSchemaValidator(false, false, true);
                expect(schemaValidator.schemas).to.contain.keys([ClientSchema.id]);
                expect(schemaValidator.schemas).to.not.contain.keys([PageOffsetSchema.id, PageLimitSchema.id]);
                expect(schemaValidator.schemas[ClientSchema.id]).to.deep.equal(ClientSchema);
            });
            it('should contain only PageOffsetSchema', () => {
                const schemaValidator: Validator = topEndpoint.CommonUtil.createSchemaValidator(false, true, false);
                expect(schemaValidator.schemas).to.contain.keys([PageOffsetSchema.id]);
                expect(schemaValidator.schemas).to.not.contain.keys([ClientSchema.id, PageLimitSchema.id]);
                expect(schemaValidator.schemas[PageOffsetSchema.id]).to.deep.equal(PageOffsetSchema);
            });
            it('should contain only PageLimitSchema', () => {
                const schemaValidator: Validator = topEndpoint.CommonUtil.createSchemaValidator(true, false, false);
                expect(schemaValidator.schemas).to.contain.keys([PageLimitSchema.id]);
                expect(schemaValidator.schemas).to.not.contain.keys([ClientSchema.id, PageOffsetSchema.id]);
                expect(schemaValidator.schemas[PageLimitSchema.id]).to.deep.equal(PageLimitSchema);
            });
            it('should contain all schemas', () => {
                const schemaValidator: Validator = topEndpoint.CommonUtil.createSchemaValidator(true, true, true);
                expect(schemaValidator.schemas).to.contain.keys([PageLimitSchema.id, ClientSchema.id, PageOffsetSchema.id]);
                expect(schemaValidator.schemas[ClientSchema.id]).to.deep.equal(ClientSchema);
                expect(schemaValidator.schemas[PageOffsetSchema.id]).to.deep.equal(PageOffsetSchema);
                expect(schemaValidator.schemas[PageLimitSchema.id]).to.deep.equal(PageLimitSchema);
            });
            it('should contain all schemas by default', () => {
                const schemaValidator: Validator = topEndpoint.CommonUtil.createSchemaValidator();
                expect(schemaValidator.schemas).to.contain.keys([PageLimitSchema.id, ClientSchema.id, PageOffsetSchema.id]);
                expect(schemaValidator.schemas[ClientSchema.id]).to.deep.equal(ClientSchema);
                expect(schemaValidator.schemas[PageOffsetSchema.id]).to.deep.equal(PageOffsetSchema);
                expect(schemaValidator.schemas[PageLimitSchema.id]).to.deep.equal(PageLimitSchema);
            });
        });
    });
});