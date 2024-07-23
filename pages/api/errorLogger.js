import { getCurrentTime } from "@/tool/helper";

export default async function errorLogger(req, res) {
  if (req.method !== "POST" || !req.body.logError) {
    return res.status(405).send("Invalid request.");
  }

  console.log(
    `# Custom Logger [${getCurrentTime()}]: ${
      req.body.logError
    }`
  );
  res.status(200).send("Success log error.");
}
