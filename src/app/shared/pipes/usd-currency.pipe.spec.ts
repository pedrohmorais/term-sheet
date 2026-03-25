import { UsdCurrencyPipe } from './usd-currency.pipe';

describe('UsdCurrencyPipe', () => {
  let pipe: UsdCurrencyPipe;

  beforeEach(() => {
    pipe = new UsdCurrencyPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return dash when value is null', () => {
    expect(pipe.transform(null)).toBe('—');
  });

  it('should return dash when value is undefined', () => {
    expect(pipe.transform(undefined)).toBe('—');
  });

  it('should format integer value as USD without decimals', () => {
    expect(pipe.transform(1000)).toBe('$1,000');
  });

  it('should round and remove decimal places', () => {
    expect(pipe.transform(1234.56)).toBe('$1,235');
  });

  it('should handle zero correctly', () => {
    expect(pipe.transform(0)).toBe('$0');
  });

  it('should handle negative values', () => {
    expect(pipe.transform(-500)).toBe('-$500');
  });
});