async function signup(e){
    try{
        e.preventDefault();
        const user={
            name:e.target.name.value,
            email:e.target.email.value,
            password:e.target.password.value
        }
        const response=await axios.post('http://16.171.202.45/user/sign-up',user);
        const sleep = m => new Promise(r => setTimeout(r, m))
            if(response.status===200){
                async function emailExist(){
                    const submit=document.getElementById('submit')
                    const h6=document.createElement('h6')
                    h6.textContent+=" * Email already exist";
                    submit.before(h6);
                    await sleep(4000);
                    h6.remove()
                }
                emailExist()
            }else if(response.status===201){
                window.location.href = "http://16.171.202.45/user/login.html";
            }
    }catch(err){
        document.body.innerHTML+=`<h3 style='color:red'>something went wrong try after sometime</h3>`
    }
}