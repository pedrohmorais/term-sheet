/// <reference types="jasmine" />

import { CapRateStatusPipe } from './cap-rate-status.pipe';

describe('CapRateStatusPipe', () => {
  let pipe: CapRateStatusPipe;

  beforeEach(() => {
    pipe = new CapRateStatusPipe();
  });

  it('should return "low" when capRate is less than 5', () => {
    expect(pipe.transform(0)).toBe('low');
    expect(pipe.transform(4.9)).toBe('low');
  });

  it('should return "healthy" when capRate is between 5 and 12', () => {
    expect(pipe.transform(5)).toBe('healthy');
    expect(pipe.transform(10)).toBe('healthy');
    expect(pipe.transform(12)).toBe('healthy');
  });

  it('should return "high" when capRate is greater than 12', () => {
    expect(pipe.transform(12.1)).toBe('high');
    expect(pipe.transform(20)).toBe('high');
  });

  it('should handle edge cases correctly', () => {
    expect(pipe.transform(5)).toBe('healthy');   // boundary
    expect(pipe.transform(12)).toBe('healthy');  // boundary
  });
});