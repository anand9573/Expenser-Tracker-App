

async function setpassword(e){
    const resetpassword={
        email:e.target.email.value,
    }
    const res=await axios.put(`http://localhost:3000/password/forgotpassword`,resetpassword);

}