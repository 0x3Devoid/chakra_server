const User = require('../models/user.model');

const dashBoardLeaders = async (req, res) => {
    try {
        const leaders = await User.find({}, 'local.username google.username commonFields.earning').sort({ 'commonFields.earning': -1 });
        const formattedLeaders = leaders.map(leader => {
            const { local, google, commonFields } = leader;
            const username = local.username || google.username || 'No Username Found';
            return { username, earning: commonFields.earning };
        });
        console.log(leaders);
        return res.json(formattedLeaders);
    } catch (error) {
        console.log(error);
        return res.json({error}).status(500);
    }
}

module.exports = dashBoardLeaders;
