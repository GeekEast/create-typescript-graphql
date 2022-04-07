export declare global {
  namespace jest {
    interface Matchers {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toHaveBeenCalledWithInclude(args: any): CustomMatcherResult
    }
  }
}
