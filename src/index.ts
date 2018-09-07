import { PiholeApp } from "./app";
import { PiholeDatabase } from "./helper/pihole-database";
let app: PiholeApp = new PiholeApp(3000);

app.start();