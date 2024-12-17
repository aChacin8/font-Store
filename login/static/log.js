class Users {
    constructor(username, password, rol) {
        this.username = username;
        this.password = password;
        this.rol = rol;
    }
}

let userList = JSON.parse(localStorage.getItem("list")) || [];

const registerUser = () => {
    let submit = document.querySelector("#submit-reg");

    submit.addEventListener("click", (e) => {
        e.preventDefault(); 
        
        let username = document.querySelector("#input-username").value;
        let password = document.querySelector("#input-password").value;

        let exist = userList.find(user => user.username === username);

        if (exist) {
            alert("Usuario Existente");
        } else {
            let newUser = new Users(username, password, rol);
            userList.push(newUser);
            alert(`Usuario registrado: ${username} - Rol: ${rol}`);
            localStorage.setItem("list", JSON.stringify(userList));
        }
    });
    console.log(userList);
    
};

document.addEventListener("DOMContentLoaded", registerUser);

const logUser = (e) => {
    let submit = document.querySelector("#submit-input"); 
    e.preventDefault(); 

    registerUser(); 
        let exist = userList.find(user => user.username === username);
}