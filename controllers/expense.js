const expenses=require('../model/expense');;

const User=require('../model/user')

const sequelize = require('../util/database');

function isInValid(string){
    if(string===undefined || string.length===0){
        return true
    }else{
        return false
    }
}

exports.postExpense=async(req,res,next)=>{
   let t=await sequelize.transaction();
    try{
        const {expenseAmount,description,category}=req.body;
        if(isInValid(expenseAmount) || isInValid(description) || isInValid(category)){
            res.status(400).json({message:'Missing parameters !',success:false});
        }
        const data=await req.user.createExpense({expenseAmount,description,category},{transaction:t});
        const totalExpense=Number(req.user.totalExpenses)+Number(expenseAmount);
        User.update({totalExpenses:totalExpense},{where:{id:req.user.id}},{transaction:t});
        await t.commit();
        res.status(201).json({newExpenseDetails:data,success:true,totalExpenses:totalExpense})
    }catch(err){
        if (t) {
            await t.rollback();
        }
        res.status(500).json({error:err,success:false}) 
    }
}

exports.getExpenses=async(req,res,next)=>{
    try{
        const allexpenses= await req.user.getExpenses()
        res.status(200).json({allExpenses: allexpenses,success:true});
    }catch(err){
        res.sendStatus(500).json({error:err,success:false});
    }
}

exports.deleteExpense=async(req,res,next)=>{
    let t=await sequelize.transaction();
    try{
        if(req.params.id==='undefined' || req.params.id.length===0 || req.user.id==='undefined' || req.user.id.length===0){
            if(t){
                await t.rollback();
            }
            return res.status(400).json({err:'id not found',success:false})
        }
        const expenseid=req.params.id
        const expense=await req.user.getExpenses({where:{id:expenseid}},{transaction:t});
        console.log(expense[0].expenseAmount);
        const totalExpense=Number(req.user.totalExpenses)-Number(expense[0].
            expenseAmount);
        User.update({totalExpenses:totalExpense},{where:{id:req.user.id}},{transaction:t});
        const deleteexpense=await expenses.destroy({where:{id:expenseid,userId:req.user.id}},{transaction:t});
        if(deleteexpense===0){
            if(t){
                await t.rollback();
            }
            return res.status(404).json({success:false,message:'Expense not belong to user'});
        }
        await t.commit()
        res.status(200).json({message:'deleted successfully',success:true});
    }catch(err){
        if(t){
            await t.rollback();
        }
        res.status(500).json({error:err});
    }
}

exports.editExpense=async(req,res,next)=>{
    try{
        if(req.params.id==='undefined'){
            return res.status(400).json({err:'id not found'})
        }
        const expenseid=req.params.id
        const expense=await expenses.findByPk(expenseid);
        await expenses.destroy({where:{id:expenseid}});
        res.status(200).json({editExpense:expense})
    }catch(err){
        res.status(500).json({error:err});
    }
}