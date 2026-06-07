export const cookies = () => ({
  get: (_name: string) => null,
  set: (_name: string, _value: string) => {},
  delete: (_name: string) => {},
  getAll: () => [],
});

export const headers = () => new Headers();
