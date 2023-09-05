
async function resetpassword(e){
    const message=async (msg)=>{
        const sleep = m => new Promise(r => setTimeout(r, m))
        const submit=document.getElementById('submit')
        const h6=document.createElement('h6')
        h6.textContent+=`${msg.response.data.message}`
        if(msg.response.data.success===true){
            h6.style.color='green';
        }
        submit.before(h6)
        await sleep(4000);
        h6.remove()
    }
    try{
        e.preventDefault();
        const res=await axios.get(`http://16.171.202.45/password/updatepassword/${id}`,resetpassword);
        if(res.status===200){
            message(res);
        }
    }catch(err){
        message(err)
    }
}