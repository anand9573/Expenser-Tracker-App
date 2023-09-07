

async function setpassword(e){
    
    try{
        e.preventDefault();
        const email=e.target.email.value;
        const res=await axios.post(`http://16.171.202.45/password/forgotpassword/${email}`);
        if(res.status===200){
            const submit=document.getElementById('submit')
            const h5=document.createElement('h5')
            h5.textContent+=`Reset Password link Sent to Your Registered Email Successfully`
            h5.style.color='green';
            submit.before(h5)
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