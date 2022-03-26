export const ArtResponce = {
    id: {type:'number'},
    pic: {
        type: 'array',
        items: {type:'string'}
    },
    video: {
        type: 'array',
        items: {type:'string'}
    },
    description: {type:'string'},
    title: {type:'string'},
    personid: {type:'number'},
    previewChange: {type:'boolean'}
}