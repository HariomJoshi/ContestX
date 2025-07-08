import { listenRunQueue } from "./queue/runConsumer.js";
import { listenSubmitQueue } from "./queue/submitConsumer.js";
listenRunQueue();
listenSubmitQueue();
