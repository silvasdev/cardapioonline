const menu = document.getElementById("menu")
const CartBtn = document.getElementById("cart-btn")
const CartModal = document.getElementById("cart-modal")
const CartItemsContainer = document.getElementById("cart-items")
const CartTotal = document.getElementById("cart-total")
const CheckoutBtn = document.getElementById("checkout-btn")
const CloseModalBtn = document.getElementById("close-modal-btn")
const CartCounter = document.getElementById("cart-count")
const AdressInput = document.getElementById("address")
const AdressWarn = document.getElementById("addres-warn")

let cart = [];

// Abrir o modal do carrinho

CartBtn.addEventListener("click", function() {
    updateCartModal();
    CartModal.style.display = "flex"
   
})

//Fechar o modal quando clicar fora

CartModal.addEventListener("click", function(event) {
    if(event.target === CartModal)
        CartModal.style.display = "none"
})

//fechar o modal botão fechar

CloseModalBtn.addEventListener("click", function() {
    CartModal.style.display = "none"
})

menu.addEventListener("click", function(event) {

    let parentBtn = event.target.closest(".add-to-cart-btn")
    
    if(parentBtn){
        const name = parentBtn.getAttribute("data-name")
        const price = parseFloat(parentBtn.getAttribute("data-price"))

        addToCart(name, price)
    }
    
})

//função adicionar no carrinho

function addToCart (name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        //se o item já existe aumenta apenas a quantidade no carrinho
       existingItem.quantity += 1;
    
    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        })

    
    }
    updateCartModal()
}

// atualizar o carrinho

function updateCartModal(){
   CartItemsContainer.innerHTML = "";
   let total = 0;

   cart.forEach(item => {
     const cartItemElement = document.createElement("div");
     cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")


     cartItemElement.innerHTML = `
           
      <div class="flex items-center justify-between">
       <div>
         <p class="font-medium">${item.name}</p>
         <p>Qtd: ${item.quantity}</p>
         <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
       </div>

        <button class="remove-from-cart-btn" data-name="${item.name}">excluir</button>

      </div
     `
     total += item.price * item.quantity

     CartItemsContainer.appendChild(cartItemElement)
   })

   CartTotal.textContent = total.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL"
   });

   CartCounter.innerHTML = cart.length;
}

//função para remover o item do carrinho

CartItemsContainer.addEventListener("click", function(event) {

   if(event.target.classList.contains("remove-from-cart-btn")){
    const name = event.target.getAttribute("data-name")

    removeItemCart(name)
   }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }
        
        cart.splice(index, 1);
        updateCartModal();
    }
}

AdressInput.addEventListener("input", function(event) {
    let inputValue = event.target.value;

    if(inputValue !== ""){
        AdressInput.classList.remove("border-red-500")
        AdressWarn.classList.add("hidden")
    }
})

//botão de finalizar pedido
CheckoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();

    if(!isOpen){
        Toastify({
            text: "RESTAURANTE FECHADO, ABRE AS 8:00",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
        
          }).showToast();

        return;
    }

    if(cart.length === 0) return;

    if(AdressInput.value === ""){
        AdressWarn.classList.remove("hidden")
        AdressInput.classList.add("border-red-500")
        return;
    };

    //enviar o pedido para whatssap
    const cartItems = cart.map((item) => {
        return(
            ` ${item.name} Quantidade: ${item.quantity} preço: R$${item.price} |`
        );
    }).join();

    const message = encodeURIComponent(cartItems);
    const phone = "38997527884"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${AdressInput.value}`, "_blank")

    cart = [];
    updateCartModal();
});


//verificar se o restaurante esta aberto
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 8 && hora < 23;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else{
    spanItem.classList.add("bg-red-500")
    spanItem.classList.remove("bg-green-600")
}