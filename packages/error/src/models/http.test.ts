import {describe, it, expect} from 'vitest';
import {HttpError} from './http';
import {BaseError} from './base';

// Mock implementations for Request and Response
class MockRequest {
  url: string;
  method: string;

  constructor(url: string, method: string) {
    this.url = url;
    this.method = method;
  }
}

class MockResponse {
  status: number;
  statusText: string;

  constructor(status: number, statusText: string) {
    this.status = status;
    this.statusText = statusText;
  }
}

describe('HttpError', () => {
  it('should create an instance of HttpError with correct properties', () => {
    const context = {
      url: 'https://example.com',
      method: 'GET',
      statusCode: 404
    };
    const error = new HttpError({
      code: 'NOT_FOUND',
      message: 'Not Found',
      context
    });

    expect(error).toBeInstanceOf(BaseError);
    expect(error).toBeInstanceOf(HttpError);
    expect(error.name).toBe('HttpError');
    expect(error.code).toBe('NOT_FOUND');
    expect(error.message).toBe('Not Found');
    expect(error.context).toBe(context);
  });

  it('should create an HttpError from request and response', () => {
    const request = new MockRequest('https://example.com', 'POST');
    const response = new MockResponse(400, 'Bad Request');

    const error = HttpError.fromRequest(
      request as unknown as Request,
      response as unknown as Response
    );

    expect(error).toBeInstanceOf(HttpError);
    expect(error.code).toBe('BAD_REQUEST');
    expect(error.message).toBe('Bad Request');
    expect(error.context).toEqual({
      url: 'https://example.com',
      method: 'POST',
      statusCode: 400
    });
  });
});
