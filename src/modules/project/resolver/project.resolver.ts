import { Resolver } from "type-graphql"
import { Service } from "typedi"

import { Trace } from "../../../utils/logger/trace.util"

@Trace({ perf: true, logInput: { enabled: true, beautify: true } })
@Service()
@Resolver()
export class ProjectResolver {}
