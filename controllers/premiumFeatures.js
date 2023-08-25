const User=require('../model/user');
const Expense=require('../model/expense');
const sequelize=require('../util/database');

exports.getUserLeaderboard=async(req,res)=>{
    try{
        const users=await User.findAll();
        const expenses=await Expense.findAll();
        const userAgregatedExpenses={}
        expenses.forEach(expense => {
            if(userAgregatedExpenses[expense.userId]){
                userAgregatedExpenses[expense.userId]=Number(userAgregatedExpenses[expense.userId])+Number(expense.expenseAmount)
            }else{
                userAgregatedExpenses[expense.userId]=Number(expense.expenseAmount)
            }
        });
        var userLeaderBoardDetails=[];
        users.forEach((user)=>{
            userLeaderBoardDetails.push
            ({name:user.name,totalAmount:userAgregatedExpenses[user.id] || 0});

        })
        userLeaderBoardDetails.sort((a,b)=>b.totalAmount-a.totalAmount)
        res.status(200).json(userLeaderBoardDetails)

    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}
