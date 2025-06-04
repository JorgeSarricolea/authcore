export default class AppException extends Error {
  public status: number;
  public description: string;
  public details?: Record<string, unknown>;

  constructor(
    message: string,
    status: number = 500,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.status = status;
    this.description = AppException.getDescriptionForStatus(status);
    this.details = details;
    this.name = this.constructor.name;
  }

  static getDescriptionForStatus(status: number): string {
    const descriptions: Record<number, string> = {
      400: "Bad Request",
      401: "Unauthorized",
      403: "Forbidden",
      404: "Not Found",
      409: "Conflict",
      429: "Too Many Requests",
      500: "Internal Server Error",
      501: "Not Implemented",
    };

    return descriptions[status] || "Unknown Error";
  }
}
