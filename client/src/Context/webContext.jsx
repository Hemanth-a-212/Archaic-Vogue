import {createContext, useState, useEffect} from 'react'
import banner from '../Components/Assets/banner';

export const webContext = createContext(null);

const cartdefault = () => {
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i]=0;
    }
    return cart;
}

const ContextProvider = (props) => {
    const [all_product,setAll_product]=useState([]);
    const [cartItems,setCartItems]=useState(cartdefault());
    
    useEffect(()=> {
        fetch("http://localhost:5000/allproducts")
        .then((res)=>res.json())
        .then((data)=>setAll_product(data));

        if(localStorage.getItem("auth-token")){
            fetch("http://localhost:5000/getcart",{
                method:"POST",
                headers:{Accept:"application/form-data","auth-token":`${localStorage.getItem("auth-token")}`,"Content-Type":"application/json"},
                body:""
            }).then((res)=>res.json())
            .then((data)=>setCartItems(data))
        }
    },[])

    const addToCart = (itemId) => {
       setCartItems((p)=>({...p,[itemId]:p[itemId]+1}));
        if(localStorage.getItem("auth-token")){
            fetch("http://localhost:5000/addtocart",{
                method:"POST",
                headers:{Accept:"application/form-data","auth-token":`${localStorage.getItem("auth-token")}`,"Content-Type":"application/json"},
                body:JSON.stringify({"itemId":itemId})
            })
            .then((res)=>res.json())
            .then((data)=>console.log(data))
        }
    } 
    const removefromCart = (itemId) => {
        setCartItems((p)=>({...p,[itemId]:p[itemId]-1}));
        if(localStorage.getItem("auth-token")){
            fetch("http://localhost:5000/removefromcart",{
                method:"POST",
                headers:{Accept:"application/form-data","auth-token":`${localStorage.getItem("auth-token")}`,"Content-Type":"application/json"},
                body:JSON.stringify({"itemId":itemId})
            })
            .then((res)=>res.json())
            .then((data)=>console.log(data))
        }
    }
    const getTotalCartamount=()=>{
        let total=0;
        for(const i in cartItems){
            if(cartItems[i]>0)
            {
                let item=all_product.find((prod) => prod.id === Number(i));
                total += item.price*cartItems[i];
            }
        }
        return total;
    }
    const totalItemsInCart=()=>{
        let totalItem = 0;
        for(const i in cartItems){
            if(cartItems[i]>0){
                totalItem += cartItems[i];
            }
        }
        return totalItem;
    }
    const contextvalue = {all_product,banner,cartItems,totalItemsInCart,addToCart,removefromCart,getTotalCartamount};

    return (
        <webContext.Provider value={contextvalue}>
            {props.children}
        </webContext.Provider>
    );
}
export default ContextProvider;