const API = "http://127.0.0.1:8000/api";
//LOGIN
const loginForm=document.getElementById("loginForm");
if(loginForm){
    loginForm.addEventListener("submit",async(e)=>{
        e.preventDefault();
        const respuesta=await fetch(API+"/auth/login",{
            method:"POST",
            headers:{"Content-type":"application/json"},
            body:JSON.stringify({
                email:document.getElementById("email").value,
                password:document.getElementById("password").value
            })
        });
        const data=await respuesta.json();
        if(data.access_token){
            localStorage.setItem("token",data.access_token);
            localStorage.setItem("nombreUsuario",document.getElementById("email").value);
            window.location.href="dashboard.html";
        }
        else{
            alert("Correo o ontraseña incorrectos");
        }
    });
}
//REGISTRO
const registroForm=document.getElementById("registroForm");
if(registroForm){
    registroForm.addEventListener("submit",async(e)=>{
        e.preventDefault();
        let nombre=document.getElementById("first_name").value.trim();
        let apellido=document.getElementById("last_name").value.trim();
        let telefono=document.getElementById("phone").value.trim();
        let password=document.getElementById("password").value.trim();
        let errores=[];
        if(nombre.length<3){
            errores.push("El nombre debe tener mínimo 3 letras");
        }
        if(apellido.length<3){
            errores.push("El apellido debe tener mínimo 3 letras");
        }
        if(!/^[67]\d{7}$/.test(telefono)){
            errores.push("El teléfono debe comenzar con 6 o 7 y tener 8 dígitos");
        }
        if(password.length<8){
            errores.push("La contraseña debe tener mínimo 8 caracteres");
        }
        if(errores.length>0){
            alert("Por favor corrija sus errores:\n\n"+errores.join("\n\n"));
            return;
        }
        
        try{
            const respuesta=await fetch(API+"/auth/registro",{
                method:"POST",
                headers:{"Content-type":"application/json"},
                body:JSON.stringify({
                    name:document.getElementById("name").value,
                    email:document.getElementById("email").value,
                    password:password,
                    password_confirmation:document.getElementById("password_confirmation").value,
                    first_name:nombre,
                    last_name:apellido,
                    phone:telefono,
                    hire_date:document.getElementById("hire_date").value,
                    salary:document.getElementById("salary").value
                })
            });
            const data = await respuesta.json();
            if (respuesta.ok) {
                alert("Registro creado correctamente");
                window.location.href="login.html";
            } else {
                alert("Error al registrarse");
            }
        }catch(error){
            alert("Error de conexión");
            console.error(error);
        }
    });
}