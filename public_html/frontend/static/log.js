class Users {
    constructor(username, password, rol) {
        this.username = username;
        this.password = password;
        this.rol = rol;
    }
}

const Admin = {
    admin1: {
        username: 'alejandrochacin@gmail.com',
        password: 'administradornumero1',
        rol: 'admin'
    },
    admin2: {
        username: 'wendy@gmail.com',
        password: 'administradornumero2',
        rol: 'admin'
    }
}

const UsersList = {
    user1: {
        username: 'erizo28@gmail.com',
        password: 'usuarionumero1',
        rol: 'user'
    },
    user2: {
        username: 'usuario2@gmail.com',
        password: 'usuarionumero2',
        rol: 'user'
    }
}

let userList = JSON.parse(localStorage.getItem("list")) || [];

const registerUser = () => {
    let form = document.querySelector("#registro-form");

    form?.addEventListener("submit", (e) => {
        e.preventDefault(); 
        
        let username = document.querySelector("#input-username").value;
        let password = document.querySelector("#input-password").value;
        let rol = document.querySelector ("#input-roll").value;
        if (!username || !password) { 
            alert("Por favor, completa todos los campos."); 
            return; 
        }

        let exist = userList.find(user => user.username === username);

        if (exist) {
            alert("Usuario Existente");
        } else {
            let newUser = new Users(username, password);
            userList.push(newUser);
            alert(`Usuario registrado: ${username}`);
            localStorage.setItem("list", JSON.stringify(userList));
        }

        console.log(userList);
    });
};

const hrefRol = (url) => {
    window.location.href = url;
}

const logUser = () => {
    let form = document.querySelector("#form-login");

    form?.addEventListener("submit", (e) => {
        e.preventDefault();

        let username = document.querySelector("#input-user").value;
        let password = document.querySelector("#input-pswd").value;
        let rol = document.querySelector("#input-rol").value;

        let exist = userList.find(user => user.username === username && user.password === password);
        let adminExist = Object.values(Admin).find(admin => admin.username === username && admin.password === password && admin.rol === rol);
        let userExist = Object.values(UsersList).find(user => user.username === username && user.password === password && user.rol === rol);

        if (exist || adminExist || userExist) {
            if (rol === 'admin'){
                alert ("Inicio de sesion exitoso como Adminisitrador");
                hrefRol("./admin.html")
            } else if (rol === 'user') {
                alert ("Inicio de sesion exitoso como Usuario");
                hrefRol("./usuario.html")
            }
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    });
};

document.addEventListener("DOMContentLoaded", () => {
    registerUser();
    logUser();
});

