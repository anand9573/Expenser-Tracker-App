
async function resetpassword(e){
    try{
        e.preventDefault();
        const resetpassword={
            newpassword:e.target.newpassword.value,
        }
        const res=await axios.get(`http://16.171.202.45/password/updatepassword/${id}`,resetpassword);
        if(res.status===200){
            const submit=document.getElementById('submit')
        const h5=document.createElement('h5')
        h5.textContent+=`Password Changed Successfully`
            h5.style.color='green';
        submit.before(h5)
        }
    }catch(err){
        const message=async(err)=>{
            const sleep = m => new Promise(r => setTimeout(r, m))
            const submit=document.getElementById('submit')
            const h6=document.createElement('h6')
            h6.textContent+=`Something went wrong try after some time!`
            submit.before(h6)
            await sleep(4000);
            h6.remove()
        }
        message(err)
    }
}