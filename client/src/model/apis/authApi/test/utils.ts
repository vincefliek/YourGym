export function mockFetch(data: any, ok = true) {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    json: async () => data,
  });
}
