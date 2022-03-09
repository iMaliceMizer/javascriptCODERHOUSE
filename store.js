let carritoDeCompras = []
let urlStock = 'stock.json'

fetch(urlStock)
    .then(response => response.json())
    .then(json=>{
        mostrarProductos(json)
    })

const contenedorProductos = document.getElementById('contenedor-productos');
const contenedorCarrito = document.getElementById('carrito-contenedor');
const contadorCarrito = document.getElementById('contadorCarrito');
const precioTotal = document.getElementById('precioTotal');
const carritoAbrir = document.getElementById('boton-carrito');
const carritoCerrar = document.getElementById('carritoCerrar');
const contenedorModal = document.getElementsByClassName('modal-contenedor')[0]
const modalCarrito = document.getElementsByClassName('modal-carrito')[0]
const buscador = document.getElementById('search')

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

function update (){
    contadorCarrito.innerText = carritoDeCompras.reduce((acc,el)=> acc + el.cantidad, 0)
    precioTotal.innerText = carritoDeCompras.reduce((acc,el)=> acc + (el.precio * el.cantidad), 0)
}
function mostrarProductos(array){
   contenedorProductos.innerHTML ='';
    for (const producto of array) {
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
        alertSuccess("");
        })
    }  
}
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
                        <button id=botonEliminar${productoAgregar.id} class="boton-eliminar"><i class="fas fa-trash-alt">X</i></button>
                        <button id=botonEliminar${productoAgregar.id} class="boton-eliminar"><i class="fas fa-trash-alt">X</i></button>`
        contenedorCarrito.appendChild(div)
    let btnEliminar = document.getElementById(`botonEliminar${productoAgregar.id}`)
        btnEliminar.addEventListener('click',()=>{
            btnEliminar.parentElement.remove()                         
            carritoDeCompras = carritoDeCompras.filter(elemento => elemento.id != productoAgregar.id)
            update()
            alertDelete("");
            localStorage.setItem('carrito', JSON.stringify(carritoDeCompras))
        })
    }
    localStorage.setItem('carrito', JSON.stringify(carritoDeCompras))
}
buscador.addEventListener('input', ()=>{
    if (buscador.value == "") {
        mostrarProductos(productStock)
    }else{
        mostrarProductos(productStock.filter(el => el.nombre.toLowerCase().includes(buscador.value.toLowerCase())))
    }
})
function alertSuccess(message){
    $('#alerts').append(
        '<div class="alert alert-success alert-dismissible fade show">' +
        '<strong>Producto agregado con exito !</strong> <button type="button" class="close" data-dismiss="alert">&times;</button>' + message + '</div>');
    
}
function alertDelete(message2){
    $('#alerts2').append(
        '<div class="alert alert-danger alert-dismissible fade show">' +
        '<strong>Producto eliminado con exito !</strong> <button type="button" class="close" data-dismiss="alert">&times;</button>' + message2 + '</div>');
    
}
