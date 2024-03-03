//get items in cart using local storage(it will be null in the start,so we give default value)
export let cart = JSON.parse(localStorage.getItem('cart'));

//default cart items
if(!cart){
  cart= [{
    productId:
    'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
    quantity: 2,
    deliveryOptionId: '1'
  },{
    productId:
    '15b6fc6f-327a-4ec4-896f-486349e85a3d',
    quantity: 1,
    deliveryOptionId: '2'
  }];
}
//update the local storage each time we make any changes
function saveToStorage(){
  localStorage.setItem('cart',JSON.stringify(cart));
}
export function addToCart(productId){
    let matchingItem;
          
    cart.forEach((cartItem)=>{
       if(productId == cartItem.productId){
         matchingItem = cartItem;
       }
    });
  
    if(matchingItem){
        matchingItem.quantity+=1;
    } else {
  
      cart.push({
        productId : productId,
        quantity:1,
        deliveryOptionId: '1'
      }); 
    }
    saveToStorage();
  }
//remove the item with the productiD ,push the rest
export function removeFromCart(productId){
    const newCart =[];

    cart.forEach((cartItem)=>{
      if(cartItem.productId !== productId){
          newCart.push(cartItem);
      }
    });


    cart=newCart;
    saveToStorage();
  }

  //function for updating delivery option

  export function updateDeliveryOption(productId,deliveryOptionId){
    let matchingItem;
          
    cart.forEach((cartItem)=>{
       if(productId == cartItem.productId){
         matchingItem = cartItem;
       }
    });

    matchingItem.deliveryOptionId = deliveryOptionId;

    saveToStorage();
  }

