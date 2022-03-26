export const CommentResponse = {
    id: {
        type: 'number'
    },
    text: {
        type: 'string'
    },
    createdAt: {
        type: 'string'
    },
    updatedAt: {
        type: 'string'
    },
    user: {
        type: 'object',
        properties: {
            id: {
                type: 'number'
            },
            name: {
                type: 'string'
            },
            userpic: {
                type: 'string'
            }
        }
    }
}