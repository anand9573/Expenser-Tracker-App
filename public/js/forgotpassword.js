

async function setpassword(e){
    const resetpassword={
        email:e.target.email.value,
    }
    const res=await axios.put(`http://16.171.172.201:3000/password/forgotpassword`,resetpassword);

}