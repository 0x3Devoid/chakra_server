const dbClient = require("../storage/db");



const currentUserController = async (req, res) => {
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
            $or: [
                { 'local.email': email },
                { 'google.email': email }
            ]
        }, 'local.email google.email commonFields.earning commonFields.lastLogin');
        const { local, google, commonFields } = currentUser;
        const userObject = {
            email: local.email || google.email,
            earning: commonFields.earning,
            lastLogin: commonFields.lastLogin
        }
        return res.status(200).json(userObject);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
}

module.exports = currentUserController;
