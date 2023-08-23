const form=document.getElementById('form')
const des=document.getElementById('description')
form.addEventListener('submit',storedata)
function storedata(e){
    try{
    e.preventDefault();
    const expensDetails={
        expenseAmount:e.target.expense.value,
        description:e.target.description.value,
        category:e.target.category.value
    }
    const addexpense=async ()=>{
    const token=localStorage.getItem('token')
    const response=await axios.post('http://localhost:3000/expense/add-expense',expensDetails,{headers:{"Authorization":token}})
    displaydetails(response.data.newExpenseDetails)
}
addexpense()    
}catch(err){
    console.log(err)
    document.body.innerHTML+='<h4>Something went wrong</h4>'
}
} 

function displaydetails(expense){
const parEle=document.getElementById('itemslist')
parEle.innerHTML+=`<li id=${expense.id}>Expense Amount : ${expense.expenseAmount}<br> Description : ${expense.description}<br>Category : ${expense.category}<button onclick="editExpense(${expense.id})" class="edit btn f-e" id="${expense.id}">Edit</button>
<button onclick="deleteExpense(${expense.id})" class="delete btn f-e" id="${expense.id}">Delete</button></li>`
}  
window.addEventListener('DOMContentLoaded',async()=>{
try{
    const token=localStorage.getItem('token')
    const response=await axios.get('http://localhost:3000/expense/get-expenses',{headers:{"Authorization":token}});
    response.data.allExpenses.forEach(element => {
        displaydetails(element)
    });
}catch(err){
console.log(err)
} 
})
async function deleteExpense(id){
try{
    const token=localStorage.getItem('token')
    const response=await axios.delete(`http://localhost:3000/expense/delete-expense/${id}`,{headers:{"Authorization":token}})
    console.log(response)
    const child=document.getElementById(id)
    child.remove();
}catch(err){
        document.body.innerHTML+='<h4>Something went wrong</h4>'
        console.log(err)
}
}  
async function editExpense(id){
try{
    const response=await axios.put(`http://localhost:3000/expense/edit-expense/${id}`)
    console.log(response)
    document.getElementById('expense').value=response.data.editExpense.expenseAmount;
document.getElementById('description').value=response.data.editExpense.description;
document.getElementById('category').value=response.data.editExpense.category;
    const child=document.getElementById(id)
    child.remove();
}catch(err){
        document.body.innerHTML+='<h4>Something went wrong</h4>'
        console.log(err)
}
}  