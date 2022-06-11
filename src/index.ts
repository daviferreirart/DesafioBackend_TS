import { application } from "./server";

application().then((app) => {
  app.listen(3333, () => {
    console.log("Server UP");
  });
});
