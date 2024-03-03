import {cart, removeFromCart,updateDeliveryOption} from '../../data/cart.js';
import { products,getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import {hello} from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js';//external library esm version
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';//only exports dayjs function
import {deliveryOptions,getDeliveryOption} from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';

export function renderOrderSummary(){


    let cartSummaryHTML= '';
    //to get full product details of the products as we only saved product id and quantity before
    cart.forEach((cartItem)=>{      //  m->v
        const productId = cartItem.productId;
        const matchingProduct = getProduct(productId);//from products.js

        const deliveryOptionId = cartItem.deliveryOptionId;
        const deliveryOption = getDeliveryOption(deliveryOptionId);//from deliveryOptions.js

        const today = dayjs();
        const deliveryDate =  today.add(deliveryOption.deliveryDays,'days');
        const dateString = deliveryDate.format('dddd, MMMM D');
        


    //remove item form cart HTML , 2nd line added    
    cartSummaryHTML+=    `
        <div class="cart-item-container 
        js-cart-item-container-${matchingProduct.id}"> 
            <div class="delivery-date">
                Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
                <img class="product-image"
                src="${matchingProduct.image}">

                <div class="cart-item-details">
                <div class="product-name">
                    ${matchingProduct.name}
                </div>
                <div class="product-price">
                    $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                    <span>
                    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary">
                    Update
                    </span>
                    <span class="delete-quantity-link link-primary
                    js-delete-link"data-product-id="${matchingProduct.id}">
                    Delete
                    </span>
                </div>
                </div>

                <div class="delivery-options">
                <div class="delivery-options-title">
                    Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(matchingProduct,cartItem)}
                </div>
            </div>
        </div>
        `;
    
    });

    function deliveryOptionsHTML(matchingProduct,cartItem){//external library dayjs
        let html ='';
        deliveryOptions.forEach((deliveryOption) =>{
            const today = dayjs();
            const deliveryDate =  today.add(deliveryOption.deliveryDays,'days');
            const dateString = deliveryDate.format('dddd, MMMM D');
            const priceString = deliveryOption.priceCents === 0 ?'FREE' : `$${formatCurrency(deliveryOption.priceCents)} -`;

            const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
        html+=     `
            <div class="delivery-option js-delivery-option" 
            data-product-id="${matchingProduct.id}"
            data-delivery-option-id="${deliveryOption.id}">
                <input type="radio"
                    ${isChecked?'checked':''}
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                <div>
                    <div class="delivery-option-date">
                        ${dateString}
                    </div>
                    <div class="delivery-option-price">
                        ${priceString} Shipping
                    </div>
                </div>
            </div>
        `
        });
        return html;
    }

    document.querySelector('.js-order-summary')
    .innerHTML=cartSummaryHTML;

    document.querySelectorAll('.js-delete-link')
    .forEach((link)=>{
    link.addEventListener('click',()=>{//when we delete a product we must use mvc
        const productId = link.dataset.productId;
        removeFromCart(productId);//c to m which is update data
                                 
        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.remove(); 
        renderPaymentSummary(); //m to v which is regenerate html
    });
    });

    document.querySelectorAll('.js-delivery-option') //v->c
        .forEach((element)=>{
        element.addEventListener('click',()=>{
            const {productId,deliveryOptionId} =element.dataset;
            updateDeliveryOption(productId, deliveryOptionId); //c->m
            renderOrderSummary();// callwhen we select a delivery option //m->v
            renderPaymentSummary();
        });
    });
}

renderOrderSummary(); // to update all values in cart without refreshing , regnerate all html