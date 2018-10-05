import { Schema } from 'jsonschema';

export const PageOffsetSchema: Schema = {
    id: '/PageOffsetSchema',
    title: 'Offset',
    description: 'Offset for dataset list queries',
    anyOf: [
        {
            type: 'integer',
            minimum: 0,
        },
        {
            type: 'string',
            pattern: '^[0-9]+$'
        }
    ]
};
