export enum supportedContentTypes {
    jpeg = 'image/jpeg',
    png = 'image/png'
}

export function isAllowedContentType(contentType: string):boolean {
    return Object.values(supportedContentTypes).includes(<supportedContentTypes>contentType)
}