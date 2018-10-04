import { Validator } from 'jsonschema';
import {
    PageLimitSchema,
    PageOffsetSchema,
    ClientSchema
} from '../../schemas';

export class CommonUtil {
    public static createSchemaValidator(limit: boolean = true, offset: boolean = true, client: boolean = true): Validator {
        const validator: Validator = new Validator();
        if (limit) {
            validator.addSchema(PageLimitSchema, PageLimitSchema.id);
        }
        if (offset) {
            validator.addSchema(PageOffsetSchema, PageOffsetSchema.id);
        }
        if (client) {
            validator.addSchema(ClientSchema, ClientSchema.id);
        }
        return validator;
    }
}