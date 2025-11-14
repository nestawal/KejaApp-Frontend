import React from "react"
import {useLocation} from "react-router-dom"
import Card from "./components/cartCard.jsx"


export default function Cart(){
    const location = useLocation()
    const cart = location.state?.cart || JSON.parse(localStorage.getItem("cart")) || [];
    console.log({cart})
    

    const cards = cart.map(item => {
        return (
            <Card
                key={item.id}
                {...item}
                cart={()=>handleCart(item)}
            />
        )
    })        


    return(
        <div>
            <h1>WELCOME TO CART</h1>
            <section className="cards-list">
                {cards}
            </section>
        </div>
    )
}