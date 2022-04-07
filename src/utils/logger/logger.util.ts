import createDebugger from "debug"

// info logger
const info = createDebugger("app:log")

// warning logger
const warn = createDebugger("app:warning")

// error logger
const error = createDebugger("app:error")

// used in test evn only
const test = createDebugger("app:test")

export const Logger = { error, info, warn, test }
