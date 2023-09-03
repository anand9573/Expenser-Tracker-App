async function login(e){
    try{
        e.preventDefault()
        const loginDetails={
            email:e.target.email.value,
            password:e.target.password.value
        }
        const res=await axios.post('http://16.171.202.45/user/login',loginDetails);
        if(res.status===201){
            alert(res.data.message);
            console.log(res.data);
            localStorage.setItem('token',res.data.token);
            window.location.href = "../views/user/expense.html";
        }
    }catch(err){
        const message=async (err)=>{
            const sleep = m => new Promise(r => setTimeout(r, m))
            const submit=document.getElementById('submit')
            const h6=document.createElement('h6')
            h6.textContent+=`${err.response.data.message}`
            submit.before(h6)
            await sleep(4000);
            h6.remove()
        }
        message(err)
    }
}