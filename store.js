// Variables relacionadas al stock

let carritoDeCompras = []
let urlStock = 'stock.json'
let productStock = []

// Fetch del archivo JSON

fetch(urlStock)
    .then(response => response.json())
    .then(json=>{
        mostrarProductos(json)
    })

// Constantes 

const contenedorProductos = document.getElementById('contenedor-productos');
const contenedorCarrito = document.getElementById('carrito-contenedor');
const contadorCarrito = document.getElementById('contadorCarrito');
const precioTotal = document.getElementById('precioTotal');
const carritoAbrir = document.getElementById('boton-carrito');
const carritoCerrar = document.getElementById('carritoCerrar');
const contenedorModal = document.getElementsByClassName('modal-contenedor')[0]
const modalCarrito = document.getElementsByClassName('modal-carrito')[0]
const buscador = document.getElementById('search')

// Listeners varios

carritoAbrir.addEventListener('click', ()=> {
    contenedorModal.classList.toggle('modal-active')
})
carritoCerrar.addEventListener('click', ()=> {
    contenedorModal.classList.toggle('modal-active')
})
modalCarrito.addEventListener('click',(e)=>{
    e.stopPropagation()
})
contenedorModal.addEventListener('click', ()=>{
    carritoCerrar.click()
})

// Función para actualizar el carrito 

function update (){
    contadorCarrito.innerText = carritoDeCompras.reduce((acc,el)=> acc + el.cantidad, 0)
    
    precioTotal.innerText = carritoDeCompras.reduce((acc,el)=> acc + (el.precio * el.cantidad), 0)
}
// Botón Compra del carrito
function botonComprar(){
    contenedorCarrito.innerHTML = '';
    precioTotal.innerText = '0';
    alertaCompra()
    
}

//Función display de productos en la página

function mostrarProductos(array){
   contenedorProductos.innerHTML ='';
    for (const producto of array) {
        productStock.push(producto)
        let div = document.createElement('div');
        div.className = 'producto';
        div.innerHTML += `<div class="card">
                            <div class="card-image">
                            <img src=${producto.img}>
                            <span class="card-title">${producto.nombre}</span>
                            <a id="botonAgregar${producto.id}"class="btn-floating halfway-fab"><i class="material-icons">add_shopping_cart</i></a>
                            </div>
                            <div class="card-content">
                            <p>${producto.desc}</p>
                            <p> $${producto.precio}</p>
                            </div>
                        </div> `
    contenedorProductos.appendChild(div);        
    let btnAgregar = document.getElementById(`botonAgregar${producto.id}`)
    btnAgregar.addEventListener('click',()=>{
        agregarAlCarrito(producto.id)
        alertSuccess();
        })
    }  
}

// Función para añadir productos al carrito

function agregarAlCarrito(id) {
    let repetido = carritoDeCompras.find(item => item.id == id)
    if(repetido){
        repetido.cantidad = repetido.cantidad + 1
        document.getElementById(`cantidad${repetido.id}`).innerHTML = `<p id= cantidad${repetido.id}>Cantidad:${repetido.cantidad}</p>`
        update()
    }else{
        let productoAgregar = productStock.find(elemento => elemento.id == id)
        carritoDeCompras.push(productoAgregar)
        update()
        let div = document.createElement('div')
        div.className = 'productoEnCarrito'
        div.innerHTML =`
                        <p>${productoAgregar.nombre}</p>
                        <p>Precio: $${productoAgregar.precio}</p>
                        <p id= cantidad${productoAgregar.id}>Cantidad:${productoAgregar.cantidad}</p>
                        <button id=botonEliminar${productoAgregar.id} class="boton-eliminar"><i class="fas fa-trash-alt">X</i></button>`
        contenedorCarrito.appendChild(div)
    
    // Botón para eliminar productos del carrito con su respectiva alerta

    let btnEliminar = document.getElementById(`botonEliminar${productoAgregar.id}`)
        btnEliminar.addEventListener('click',()=>{
            btnEliminar.parentElement.remove()                         
            carritoDeCompras = carritoDeCompras.filter(elemento => elemento.id != productoAgregar.id)
            update()
            alertDelete();
            localStorage.setItem('carrito', JSON.stringify(carritoDeCompras))
        })
    }
    localStorage.setItem('carrito', JSON.stringify(carritoDeCompras))
}

// Función busador con listener 

buscador.addEventListener('input', ()=>{
    
    if (buscador.value == "") {
        mostrarProductos(productStock)
    }else{
        mostrarProductos(productStock.filter(el => el.nombre.toLowerCase().includes(buscador.value.toLowerCase())))
    }
})

// Funciones para alertas utilizando Sweet Alerts

function alertSuccess(){
    swal({
        title: "Producto agregado",
        text: "Producto agregado exitosamente!",
        icon: "success",
      });
    
}
function alertDelete(){
    swal({
        title: "Producto eliminado",
        text: "Producto eliminado exitosamente!",
        icon: "error",
      });
}
function alertaCompra(){
    swal({
        title: "Compra Exitosa",
        text: "Productos comprados exitosamente!",
        icon: "success",
      });
}