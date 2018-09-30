import { Schema } from 'jsonschema';

export const PageLimitSchema: Schema = {
    id: "/PageLimitSchema",
    title: 'Limit',
    description: 'The maximum number of entries to return',
    anyOf: [
        {
            type: 'integer',
            minimum: 0,
            maximum: 50
        },
        {
            type: 'string',
            pattern: '^([0-9]|[1-4][0-9]|50)$'
        }
    ]
};