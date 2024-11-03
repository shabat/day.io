export class CustomException extends Error {
  constructor(
    public readonly message: string,
    public readonly code: string,
    public readonly status: number,
    public readonly details?: any,
  ) {
    super(message);
    this.name = 'CustomException';
  }
}
