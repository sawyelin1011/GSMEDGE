import { describe, it, expect } from 'vitest';
import app from '../index';

describe('Hello Route', () => {
  it('should return greeting with default name', async () => {
    const req = new Request('http://localhost/hello');
    const res = await app.fetch(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({ message: 'Hello, World!' });
  });

  it('should return greeting with custom name', async () => {
    const req = new Request('http://localhost/hello?name=Edge');
    const res = await app.fetch(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({ message: 'Hello, Edge!' });
  });

  it('should handle missing query parameter', async () => {
    const req = new Request('http://localhost/hello?');
    const res = await app.fetch(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({ message: 'Hello, World!' });
  });
});
