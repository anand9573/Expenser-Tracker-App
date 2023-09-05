

async function setpassword(e){
    const resetpassword={
        email:e.target.email.value,
    }
    const res=await axios.get(`http://16.171.202.45/password/forgotpassword?email=${email}`,resetpassword);

}