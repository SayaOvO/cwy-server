import {db} from "./db";

const main = async () => {
  const files = await db.query.filesTable.findMany({})
  console.log(files)
}

main();
