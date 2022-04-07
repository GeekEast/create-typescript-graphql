import Container from "typedi"

export const resetContainer = (containerInstanceId = "default") =>
  Container.of(containerInstanceId).reset({ strategy: "resetServices" })
