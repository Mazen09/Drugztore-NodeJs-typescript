export enum supportedContentTypes {
  jpeg = "image/jpeg",
  png = "image/png",
}

export enum orderStatus {
  Created = "Created",
  Processed = "Processed",
  Shipped = "Shipped",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
}

export function isAllowedContentType(contentType: string): boolean {
  return Object.values(supportedContentTypes).includes(
    <supportedContentTypes>contentType
  );
}

export function isValidOrderStatus(status: string): boolean {
  return Object.values(orderStatus).includes(<orderStatus>status);
}
