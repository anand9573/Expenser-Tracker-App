
async function resetpassword(e){
    try{
        e.preventDefault();
        const resetpassword={
            newpassword:e.target.newpassword.value,
        }
        const id=e.target.id.value
        console.log(id);
        const res=await axios.post(`http://16.171.202.45/password/updatepassword/${id}`,resetpassword);
        if(res.status===200){
            const submit=document.getElementById('submit')
        const h5=document.createElement('h5')
        h5.textContent+=`Password Changed Successfully`
        submit.before(h5)
        h5.style.color='green';
        console.log('done')
        }
    }catch(err){
        const message=async(err)=>{
            const sleep = m => new Promise(r => setTimeout(r, m))
            const submit=document.getElementById('submit')
            const h6=document.createElement('h6')
            h6.textContent+=`Failed to change password try again!`
            submit.before(h6)
            await sleep(4000);
            h6.remove()
        }
        message(err)
    }
}