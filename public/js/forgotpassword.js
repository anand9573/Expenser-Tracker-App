

async function setpassword(e){
    const message=async (err)=>{
        const sleep = m => new Promise(r => setTimeout(r, m))
        const submit=document.getElementById('submit')
        const h6=document.createElement('h6')
        h6.textContent+=`${err.response.data.message}`
        submit.before(h6)
        await sleep(4000);
        h6.remove()
    }
    try{
        e.preventDefault();
        const resetpassword={
            email:e.target.email.value,
        }
        const res=await axios.post(`http://16.171.202.45/password/forgotpassword`,resetpassword);
        if(res.status===200){
            message(res);
        }
    }catch(err){
        message(err)
    }
}