export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext) {
    return env.ASSETS.fetch(request)
  },
}