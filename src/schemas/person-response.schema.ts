//import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface"

export const PersonResponse = {
    id: {
        type: 'number'
    },
    fullname: {
        type: 'string'
    },
    pseudonym: {
        type: 'string'
    },
    description: {
        type: 'string'
    },
    personpic: {
        type: 'string'
    },
    previewWork: {
        type: 'string'
    },
    tags: {
        type: 'array'
    },
    likes: {
        type: 'number'
    },
    views: {
        type: 'number'
    },
    comments: {
        type: 'number'
    },
    socNetworks: {
        type: 'object'
    },
    liked: {
        type: 'boolean',
        additionalProperties: true
    },
    likedBy: {
        type: 'array',
        additionalProperties: true,
        items: {
            type: 'object'
        }
    }
}