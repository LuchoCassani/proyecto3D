export const useRouter = () => ({
  push: (_url: string) => {},
  replace: (_url: string) => {},
  back: () => {},
  refresh: () => {},
});

export const usePathname = () => "/";
export const useSearchParams = () => new URLSearchParams();
export const redirect = (_url: string): never => {
  throw new Error("redirect");
};
