import { Container } from "typedi"

export class SampleProvider {
  static async provide() {
    if (Container.has("sample")) return

    Container.set("sample", { name: "sample" })
  }
}
