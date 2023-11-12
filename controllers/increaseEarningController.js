const User = require('../models/user.model');


const increaseUserEarning = async (req, res) => {
    try {
        const { email, claim } = req.body;
        if (!email || !claim){
            return res.status(400).json({ error: 'missing email/claim' });
        }
        if (typeof email !== "string" || typeof parseFloat(claim) !== "number") {
            return res.status(400).json({ error: 'email must be string and claim must be a number' });
        }
        const currentUser = await User.findOne({
            $or: [
                { 'local.email': email },
                { 'google.email': email }
            ]
        }, 'local.email google.email commonFields.earning');
        console.log(email, claim);
        currentUser.commonFields.earning = currentUser.commonFields.earning + parseFloat(claim);
        await currentUser.save();
        return res.status(200).json(currentUser);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'an error occured' });
    }
}

module.exports = increaseUserEarning;
