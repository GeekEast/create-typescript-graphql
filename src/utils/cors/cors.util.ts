export const generateCORSoptions = () => {
  return {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
  }
}
