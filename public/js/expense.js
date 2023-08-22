const form=document.getElementById('form')
const des=document.getElementById('description')
form.addEventListener('submit',storedata)
function storedata(e){
    e.preventDefault();
    const expenseAmount=e.target.expense.value
    const description=e.target.description.value;
    const category=e.target.category.value
    const obj={
        expenseAmount,
        description,
        category
    }
const addexpense=async ()=>{
try{
    const response=await axios.post('http://localhost:3000/expense/add-expense',obj)
    displaydetails(response.data.newExpenseDetails)
}catch(err){
    console.log(err)
    document.body.innerHTML+='<h4>Something went wrong</h4>'
}
} 
addexpense()    
} 
function displaydetails(person){
document.getElementById('expense').value=''
document.getElementById('description').value=''
document.getElementById('category').value=''
const parEle=document.getElementById('itemslist')
const childEle=document.createElement('li')
childEle.innerHTML=`Name : ${person.expenseAmount}<br> Email : ${person.description}<br>phone : ${person.category}<button onclick="editExpense(${person.id})" class="edit btn f-e" id="${person.id}">Edit</button>
<button onclick="deleteExpense(${person.id})" class="delete btn f-e" id="${person.id}">Delete</button>`
childEle.id=`${person.id}`
parEle.appendChild(childEle)
}  
window.addEventListener('DOMContentLoaded',async()=>{
try{
    const response=await axios.get('http://localhost:3000/expense/get-expenses')
    for(let i=0;i<response.data.allExpenses.length;i++){
        displaydetails(response.data.allExpenses[i]);
}
}catch(err){
console.log(err)
} 
})
async function deleteExpense(id){
try{
    const response=await axios.delete(`http://localhost:3000/expense/delete-expense/${id}`)
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