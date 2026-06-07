export const cookies = async () => ({
  get: (_name: string) => null,
  set: (_name: string, _value: string) => {},
  delete: (_name: string) => {},
  getAll: () => [] as { name: string; value: string }[],
});

export const headers = async () => new Headers();
