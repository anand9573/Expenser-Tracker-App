const expenses=require('../model/expense');

const sequelize = require('../util/database');

exports.postExpense=async(req,res,next)=>{
    try{
        const {expenseAmount,description,category}=req.body;
        const data=await expenses.create({expenseAmount,description,category})
        res.status(201).json({newExpenseDetails:data})
    }catch(err){
        res.status(500).json({error:err}) 
    }
}

exports.getExpenses=async(req,res,next)=>{
    try{
        const allexpenses= await expenses.findAll();
        res.status(200).json({allExpenses: allexpenses});
    }catch(err){
        res.sendStatus(500).json({error:err});
    }
}

exports.deleteExpense=async(req,res,next)=>{
    try{
        if(req.params.id==='undefined'){
            return res.status(400).json({err:'id not found'})
        }
        const expenseid=req.params.id
        await expenses.destroy({where:{id:expenseid}});
        res.sendStatus(200);
    }catch(err){
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