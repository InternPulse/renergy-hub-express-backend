export enum Role {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  VENDOR = 'VENDOR',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum OrderType {
  CUSTOMER = "CUSTOMER",
  VENDOR = "VENDOR"
}


export enum PaymentMethod {
  ONLINE = "ONLINE",
  CASH = "CASH"
}

export enum OrderOperationEnum {
  IN_QUEUE = "IN_QUEUE"
}