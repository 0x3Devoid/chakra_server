const dbClient = require("../storage/db");

class currentUserController{
    static async getUser(req, res){
        const collection = await dbClient.db.collection('Users');
    try {
        const email = req.body.email;
        if (!email){
            return res.status(400).json({ error: 'missing email' });
        }
        if (typeof email !== "string") {
            return res.status(400).json({ error: 'email must be string' });
        }
        const currentUser = await collection.findOne({
            'local.email': email
        }, 'local.email local.earning local.lastLogin');
        if (!currentUser) {
            return res.status(404).json({ error: "User not found" });
          }
        const { local} = currentUser;
        const userObject = {
            email: local.email,
            earning: local.earning,
            lastLogin: local.lastLogin
        }
        return res.status(200).json(userObject);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
    }
}
module.exports = currentUserController;
