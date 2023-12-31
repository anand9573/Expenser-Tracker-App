const User=require('../model/user');
const Expense=require('../model/expense');
const sequelize=require('../util/database');

exports.getUserLeaderboard=async(req,res)=>{
    try{
        const leaderboardofusers=await User.findAll({
            order:[['totalExpenses','DESC']]
        });
        res.status(200).json(leaderboardofusers)
    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}
