
//URL de la API - enpoint
const API_URL = "https://retoolapi.dev/39xMC5/expo";

//Funcion para llamar a la APi y traer el JSON
async function ObtenerPersonas(){
    //Obtenemos la repsuesta del servidor 
    const res = await fetch(API_URL); //Obtener datos de la API

    //Convertir la respuesta del servidor a formato JSON
    const data = await res.json(); //esto es un JSON

    CrearTabla(data); //Enviamos el JSON a la función "CrearTabla".

}


//Funcion que creara las filas de las tablas en base a los registros que vienne de la API

function CrearTabla(datos){ //"Datos" representa al JSON que viene de la API
    //Se llama al "tbody" dentro de la tabla id "tabla"

    const tabla = document.querySelector("#tabla tbody");

    //inner HTML es para inyectar código HTML desde JS
    tabla.innerHTML = ""; //Vaciamos el contenido de la tabla

    datos.forEach(persona => {
        tabla.innerHTML += `
            <tr>
                    <td>${persona.id}</td>
                    <td>${persona.nombre}</td>
                    <td>${persona.apellido}</td>
                    <td>${persona.edad}</td>
                    <td>${persona.correo}</td>
                    <td> 
                        <button onClick="AbrirModalEditar(${persona.id},'${persona.nombre}','${persona.apellido}',${persona.edad},'${persona.correo}' )">Editar</button>
                        <button onClick ="EliminarRegistro(${persona.id})">Eliminar</button>
                    </td>
            </tr>
        `;
    });

}

ObtenerPersonas();






//proceso para agregar un nuevo registro
const modal = document.getElementById("modalAgregar");
const btnAgregar = document.getElementById("btnAbrirModal");
const btnCerrar = document.getElementById("btnCerrarModal");

btnAgregar.addEventListener("click", ()=>{
    modal.showModal(); //abrir modal
});

btnCerrar.addEventListener("click", () => {
    modal.close(); //cerrar modal
});

document.getElementById("frmAgregarIntegrantes").addEventListener("submit", async e => {
    e.preventDefault(); // e representa al evento submin - evita que el formulario se envie

    //capturamos los valores del formulario 
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const edad = document.getElementById("edad").value.trim();
    const correo = document.getElementById("email").value.trim();

    //validacion basica
    if(!nombre || !apellido || !correo || !edad){
        alert("Complete todos los campos");
        return; //evita que el codigo se siga ejecutando
    }

    //llamar a la API  para enviar el usuario
    const respuesta = await fetch(API_URL, {
        method: "POST", 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({nombre, apellido, edad, correo})
    });

    if(respuesta.ok){
        alert("El registro fue agregado correctamente")

        document.getElementById("frmAgregarIntegrantes").rest();

        modal.close();

        ObtenerPersonas();

    }

    else{
        alert("hubo un error al agregar");
    }
});//fin formulario


//para eliminar reistros 
async function EliminarRegistro(id) {
    if( confirm("¿Estás seguro que quieres borrar el registro?")){
        await fetch(`${API_URL}/${id}`, {method: 'DELETE'});
        ObtenerPersonas();
        
    }
};

//proceso para editar el registro
const modalEditar = document.getElementById("modalEditar"); 
const btnCerrarEditar = document.getElementById("btnCerrarEditar"); 


//EventListener para cerrar el modal de editar 
btnCerrarEditar.addEventListener("click", () => {
    modalEditar.close(); //cerrar modal
});

function AbrirModalEditar (id, nombre, apellido, edad, correo){
    document.getElementById("idEditar").value = id;
    document.getElementById("nombreEditar").value = nombre; 
    document.getElementById("apellidoEditar").value = apellido; 
    document.getElementById("edadEditar").value = edad; 
    document.getElementById("emailEditar").value = correo; 
    //el ID va oculto pero debe estar presente

    modalEditar.showModal();//el modal se abre cuando ya tiene los valores ingresados
};


document.getElementById("frmEditarIntegrantes").addEventListener("submit", async e => {
    e.preventDefault();

    //capturamos los calores del formulario
    const id = document.getElementById("idEditar").value;
    const nombre = document.getElementById("nombreEditar").value.trim();
    const apellido = document.getElementById("apellidoEditar").value.trim();
    const edad = document.getElementById("edadEditar").value.trim();
    const correo = document.getElementById("emailEditar").value.trim();

    //validar que los campos esten bien 
    if (!nombre || !apellido || !edad || !correo|| !id){
        alert("Complete todos los campos bby plis")
        return; 
    }

    const respuesta = await fetch (`${API_URL}/${id}`, {
        method: "PUT", 
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({edad, correo, apellido, nombre})
    });

    if(respuesta.ok){
        alert("Registro actualizado correctamente"); //mensaje de confirmacion
        modalEditar.onclose(); //cerramos el modal 
        ObtenerPersonas(); // recargamos la lista
    }
    else{
        alert("Error al actualiazar");
    }

});