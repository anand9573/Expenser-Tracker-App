const form=document.getElementById('form')
const des=document.getElementById('description');

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

async function showLeaderBoard(){
    const token=localStorage.getItem('token');
    const userLeaderBoardArray=await axios.get('http://localhost:3000/premium/showLeaderBoard',{headers:{"Authorization":token}})
    console.log(userLeaderBoardArray)
    var LeaderboardEle=document.getElementById('premium');
    LeaderboardEle.innerHTML='<h4 class="text-white p-2">YOU are a Premium User Now<h4><button class="btn fw-bold text-center m-2" onclick="showLeaderBoard()">Leaderboard</button>'
    userLeaderBoardArray.data.forEach((userDetails)=>{
        LeaderboardEle.innerHTML+=`<li>Name-${userDetails.name} Total Expense-${userDetails.totalExpenses}</li>`
    })
}

function displaydetails(expense){
    const parEle=document.getElementById('itemslist')
    parEle.innerHTML+=`<li id=${expense.id}>Expense Amount : ${expense.expenseAmount}<br> Description : ${expense.description}<br>Category : ${expense.category}<button onclick="editExpense(${expense.id})" class="edit btn f-e" id="${expense.id}">Edit</button>
    <button onclick="deleteExpense(${expense.id})" class="delete btn f-e" id="${expense.id}">Delete</button></li>`
}  

function premiumfeature(){
    document.getElementById('rzp-button1').style.visibility='hidden'
    const parent=document.getElementById('premium');
    parent.innerHTML+=`<h4 class="text-white p-2">YOU are a Premium User Now<h4><button class="btn fw-bold text-center m-2" onclick="showLeaderBoard()">Leaderboard</button>`
}

function parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
}

window.addEventListener('DOMContentLoaded',async()=>{
try{
    const token=localStorage.getItem('token');
    const decodeToken=parseJwt(token);
    console.log(decodeToken);
    const premiumuser=decodeToken.ispremiumuser
    if(premiumuser){
        premiumfeature()
        showLeaderBoard()
    }
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
    document.getElementById(id).remove()
    console.log(response)

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

document.getElementById('rzp-button1').onclick=async function(e){
    try{
        const token=localStorage.getItem('token');
        const response=await axios.get('http://localhost:3000/purchase/premiummembership',{headers:{"Authorization":token}});
        console.log(response);
        var options={
            "key":response.data.key_id,
            "order_id":response.data.order.id,
            "handler":async function(response){
                const res=await axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
                    order_id:options.order_id,
                    payment_id:response.razorpay_payment_id,
                },{headers:{"Authorization":token} })
                alert('You are a premium user')
                localStorage.setItem('token',res.data.token)
                premiumfeature()
                showLeaderBoard()
            }
        }
        const rzp1=new Razorpay(options);
        await rzp1.open();
        e.preventDefault();

        rzp1.on('payment.failed',async(response)=>{
            console.log(response)
            alert('something went wrong')
});
    }catch(err){
        console.log(err)
    }
}
