const dbClient = require("../storage/db");


class Claiming {
  static async dailyClaiming(req, res) {
    const collection = await dbClient.db.collection("Users");
    try {
      const { email, earning } = req.body;
      if (!email || !earning) {
        return res.status(400).json({ error: "missing email/claim" });
      }
      if (typeof email !== "string" || typeof parseFloat(earning) !== "number") {
        return res
          .status(400)
          .json({ error: "email must be string and claim must be a number" });
      }
      const filter = { "local.email": email };
      const update = {
        $inc: { "local.earning": parseFloat(earning) },
        $set: { "local.lastLogin": new Date() },
      };

      const result = await collection.updateOne(filter, update);

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      const updatedUser = await collection.findOne(filter);
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "an error occured" });
    }
  }

  static async referalClaim(req, res) {
    const collection = await dbClient.db.collection("Users");
    try {
      const { email, earning } = req.body;
      if (!email || !earning) {
        return res.status(400).json({ error: "missing email/claim" });
      }
      if (typeof email !== "string" || typeof parseFloat(earning) !== "number") {
        return res
          .status(400)
          .json({ error: "email must be string and claim must be a number" });
      }
      const filter = { "local.email": email };
      const update = {
        $inc: { "local.earning": parseFloat(earning) },
      };

      const result = await collection.updateOne(filter, update);

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      const updatedUser = await collection.findOne(filter);
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "an error occured" });
    }
  }
}

module.exports = Claiming;
