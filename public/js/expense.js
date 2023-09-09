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
    const response=await axios.post('http://16.171.202.45/expense/add-expense',expensDetails,{headers:{"Authorization":token}})
    displaydetails(response.data.newExpenseDetails);
    const decodeToken=parseJwt(token);
    const premiumuser=decodeToken.ispremiumuser
    if(premiumuser){
        showLeaderBoard()
    }
}
addexpense()    
}catch(err){
    console.log(err)
    document.body.innerHTML+='<h4>Something went wrong</h4>'
}
}

async function showLeaderBoard(){
    const token=localStorage.getItem('token');
    const userLeaderBoardArray=await axios.get('http://16.171.202.45/premium/showLeaderBoard',{headers:{"Authorization":token}})
    console.log(userLeaderBoardArray)
    var LeaderboardEle=document.getElementById('premium');
    LeaderboardEle.innerHTML=`<h4 class="text-white p-2">Premium Features<h4><button class="btn fw-bold text-center m-2" onclick="showLeaderBoard()">Leaderboard</button><table class="table-responsive table-bordered table-striped">
    <thead class="thead-dark text-white">
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Total Expenses</th>
      </tr>
    </thead>
    <tbody id="tbodylead" class="tbody-dark fw-bold text-primary">
    </tbody>
    </table>`
    userLeaderBoardArray.data.forEach((userDetails)=>{
        document.getElementById('tbodylead').innerHTML+=`
        <tr>
      <td>${userDetails.name}</td>
      <td>${userDetails.totalExpenses}</td>
    </tr>`
    })
}

function displaydetails(expense){
    const parEle=document.getElementById('tbody')
    parEle.innerHTML+=`
  <tr id=${expense.id}>
      <td>${expense.expenseAmount}</td>
      <td>${expense.description}</td>
      <td>${expense.category}</td>
      <td><button onclick="deleteExpense(${expense.id})" class="delete btn f-e" id="${expense.id}">Delete</button></td>
      <td><button onclick="editExpense(${expense.id})" class="edit btn f-e" id="${expense.id}">Edit</button></td>
    </tr>`
}  
async function updateOutput() {
    const token=localStorage.getItem('token')
    const rows = document.getElementById("options").value;
    let res=await axios.get(`http://16.171.202.45/expense/get-expenses?rows=${rows}&page=${page}`,{headers:{"Authorization":token}});
    showexpenses(res.data.allExpenses);
    showpagination(res.data,rows);
}

function premiumfeature(){
    document.getElementById('rzp-button1').style.visibility='hidden'
    const parent=document.getElementById('premium');
    parent.innerHTML+=`<h4 class="text-white p-2">Premium Features<h4><button class="btn fw-bold text-center m-2" onclick="showLeaderBoard()">Leaderboard</button>`
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
    const page=1;
    const premiumuser=decodeToken.ispremiumuser
    if(premiumuser){
        premiumfeature()
        showLeaderBoard()
    }
    let res=await axios.get(`http://16.171.202.45/expense/get-expenses?page=${page}&rows=5`,{headers:{"Authorization":token}});
    showexpenses(res.data.allExpenses);
    showpagination(res.data,5);

}catch(err){
console.log(err)
} 
})

function showpagination({
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    previousPage,
    lastPage
},rows){
    const pagination=document.getElementById('page')
    pagination.innerHTML='';

    if(hasPreviousPage){
        const btn2=document.createElement('button');
        btn2.innerHTML=previousPage
        btn2.addEventListener('click',()=>getProducts(previousPage,rows))
        btn2.className='pagination'
        pagination.appendChild(btn2)

    }
    const btn1=document.createElement('button');
        btn1.innerHTML=currentPage
        btn1.className='pagination'
        btn1.addEventListener('click',()=>getProducts(currentPage,rows))
        pagination.appendChild(btn1)
    if(hasNextPage){
        const btn3=document.createElement('button');
        btn3.className='pagination'
        btn3.innerHTML=nextPage
        btn3.addEventListener('click',()=>getProducts(nextPage,rows))
        pagination.appendChild(btn3)
    }
}

async function getProducts(page,rows){
    const token=localStorage.getItem('token')
    const res=await axios.get(`http://16.171.202.45/expense/get-expenses?page=${page}&rows=${rows}`,{headers:{"Authorization":token}})
    showexpenses(res.data.allExpenses);
    showpagination(res.data,rows)
}

function showexpenses(expense){
    const parEle=document.getElementById('tbody')
    parEle.innerHTML=``
    expense.forEach((expense)=>{
        parEle.innerHTML+=`
        <tr id=${expense.id}>
            <td>${expense.expenseAmount}</td>
            <td>${expense.description}</td>
            <td>${expense.category}</td>
            <td><button onclick="deleteExpense(${expense.id})" class="delete btn f-e" id="${expense.id}">Delete</button></td>
            <td><button onclick="editExpense(${expense.id})" class="edit btn f-e" id="${expense.id}">Edit</button></td>
        </tr>`
    })

}

async function deleteExpense(id){
try{
    const token=localStorage.getItem('token')
    const response=await axios.delete(`http://16.171.202.45/expense/delete-expense/${id}`,{headers:{"Authorization":token}})
    document.getElementById(id).remove()
    console.log(response)
    const decodeToken=parseJwt(token);
    const premiumuser=decodeToken.ispremiumuser
    if(premiumuser){
        showLeaderBoard()
    }

}catch(err){
        document.body.innerHTML+='<h4>Something went wrong</h4>'
        console.log(err)
}
}  

async function editExpense(id){
try{
    const token=localStorage.getItem('token')
    const response=await axios.get(`http://16.171.202.45/expense/edit-expense`+id,{headers:{"Authorization":token}})
    document.getElementById('expense').value=response.data.editExpense.expenseAmount;
document.getElementById('description').value=response.data.editExpense.description;
document.getElementById('category').value=response.data.editExpense.category;
    const child=document.getElementById(id)
    child.remove();
    const decodeToken=parseJwt(token);
    const premiumuser=decodeToken.ispremiumuser
    if(premiumuser){
        showLeaderBoard()
    }
}catch(err){
        document.body.innerHTML+='<h4>Something went wrong</h4>'
        console.log(err)
}
}  

function showlistdownload(filesdownloaded){
    parent=document.getElementById('uldownload');
    parent.innerHTML=`<h4 class="m-2">Download  List</h4><table class="table-responsive table-bordered table-striped">
    <thead class="thead-dark text-white">
      <tr>
        <th scope="col">Downloaded File</th>
        <th scope="col">Date At</th>
      </tr>
    </thead>
    <tbody id="tbodydown" class="tbody-dark fw-bold text-primary">
    </tbody>
    </table>`;
    filesdownloaded.forEach((ele)=>{
                document.getElementById('tbodydown').innerHTML+=`<tr>
                <td><a href="${ele.fileurl}">myexpense/${new Date()}</a></td>
                <td>${ele.createdAt}</td>
            </tr>`;
    })
}

document.getElementById('rzp-button1').onclick=async function(e){
    try{
        const token=localStorage.getItem('token');
        const response=await axios.get('http://16.171.202.45/purchase/premiummembership',{headers:{"Authorization":token}});
        console.log(response);
        var options={
            "key":response.data.key_id,
            "order_id":response.data.order.id,
            "handler":async function(response){
                const res=await axios.post('http://16.171.202.45/purchase/updatetransactionstatus',{
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
            alert('something went wrong')
});
    }catch(err){
        console.log(err)
    }
}


document.getElementById('download').onclick=async()=>{
    try{
        const token=localStorage.getItem('token')
        const res=await axios.get('http://16.171.202.45/user/download',{headers:{"Authorization":token} });
        if(res.status===200){
            var a=document.createElement('a');
            a.href=res.data.fileURL;
            a.download='myexpense.csv';
            a.click();
            showlistdownload(res.data.filesdownloaded)
        }
        else{
            throw new Error(res.data.message)
        }
    }catch(error){
        console.log(error)
    }
}

document.getElementById('oldownload').onclick=async()=>{
    try{
        const token=localStorage.getItem('token')
        const res=await axios.get('http://16.171.202.45/user/download',{headers:{"Authorization":token} });
        if(res.status===200){
            showlistdownload(res.data.filesdownloaded)
        }
        else{
            throw new Error(res.data.message)
        }
    }catch(error){
        console.log(error)
    }
}


