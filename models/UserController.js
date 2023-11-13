class UserController{
    static async app(req, res){
        return res.send('<h1>Welcome to Chakra mining app server</h1>')
    }
}

module.exports = UserController;
