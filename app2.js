"//NodeJs - udemy course" 

let proba = {
    signup : {
        error : true,
        errorMsg :  "Signup Error Msg",
        email : "vladimirpavk@telekom.rs",
        password : "pile123"
    },
    login : {
        error : true,
        errorMsg : "Login Error Msg",
        email : "natasap@telekom.rs",
        password : "pile321"
    }
}

for(let x in proba){
    console.log(x);
}

