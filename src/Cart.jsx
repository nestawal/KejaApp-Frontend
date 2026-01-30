import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import CartCard from "./components/cartCard.jsx"

export default function Cart() {
    const location = useLocation()
    const navigate = useNavigate()
    
    // Get cart from multiple sources with fallbacks
    let cart = [];
    
    // First, try location state
    if (location.state?.cart && Array.isArray(location.state.cart)) {
        cart = location.state.cart;
        console.log("Cart from location state:", cart);
    } 
    // Then try localStorage
    else {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                cart = JSON.parse(savedCart);
                console.log("Cart from localStorage:", cart);
            } catch (error) {
                console.error("Error parsing cart from localStorage:", error);
                cart = [];
            }
        }
    }
    
    // Transform cart items to ensure they have proper structure
    const getTransformedItem = (item, index) => {
        // Handle different data structures
        const isApiItem = item.posts || item._id;
        const isLocalItem = item.id && item.title;
        
        let transformedItem = {
            // Unique ID
            id: item.id || item._id || `cart-item-${index}-${Date.now()}`,
            
            // Title/Name
            title: item.title || item.posts?.name || item.name || "Property",
            
            // Price
            price: item.price || item.posts?.price || 0,
            
            // Location
            location: item.location || item.posts?.location || "Location not specified",
            
            // Stats with defaults
            stats: item.stats || { rating: 0, reviewCount: 0 },
            
            // Image data
            coverImg: item.coverImg,
            file: item.file,
            
            // Other properties
            openSpots: item.openSpots,
            
            // Keep original item for reference
            originalItem: item
        };
        
        return transformedItem;
    };
    
    const handleRemoveFromCart = (itemId) => {
        console.log("Removing item:", itemId);
        
        // Filter out the item to remove
        const updatedCart = cart.filter(item => {
            // Check all possible ID fields
            return item.id !== itemId && 
                   item._id !== itemId &&
                   (item.posts ? item._id !== itemId : true);
        });
        
        // Update localStorage
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        
        // Navigate to refresh with updated cart
        navigate("/cart", { 
            state: { cart: updatedCart },
            replace: true 
        });
    };
    
    const handleCheckoutItem = (itemId) => {
        const item = cart.find(item => 
            item.id === itemId || 
            item._id === itemId ||
            (item.posts && item._id === itemId)
        );
        
        if (item) {
            navigate("/checkout", { 
                state: { 
                    cart: [item], // Single item checkout
                    totalPrice: item.price || item.posts?.price || 0
                } 
            });
        }
    };
    
    const handleCheckoutAll = () => {
        const totalPrice = cart.reduce((total, item) => {
            return total + (item.price || item.posts?.price || 0);
        }, 0);
        
        navigate("/checkout", { 
            state: { 
                cart: cart,
                totalPrice: totalPrice
            } 
        });
    };
    
    const handleContinueShopping = () => {
        navigate("/");
    };
    
    // Generate cart cards
    const cartCards = cart.map((item, index) => {
        const transformedItem = getTransformedItem(item, index);
        
        return (
            <CartCard
                key={transformedItem.id}
                {...transformedItem}
                onRemove={handleRemoveFromCart}
                onCheckout={handleCheckoutItem}
            />
        );
    });
    
    // Calculate totals
    const totalItems = cart.length;
    const totalPrice = cart.reduce((total, item) => {
        return total + (item.price || item.posts?.price || 0);
    }, 0);

    return (
        <div className="cart-page">
            <header className="cart-header">
                <h1>YOUR SHOPPING CART</h1>
                <p>Review and manage your selected properties</p>
            </header>
            
            {totalItems === 0 ? (
                <div className="empty-cart">
                    <div className="empty-cart-icon">🛒</div>
                    <h2>Your cart is empty</h2>
                    <p>Add properties to your cart to see them here</p>
                    <button 
                        onClick={handleContinueShopping}
                        className="primary-button"
                    >
                        Browse Properties
                    </button>
                </div>
            ) : (
                <>
                    <div className="cart-summary">
                        <div className="summary-item">
                            <span className="summary-label">Items in Cart:</span>
                            <span className="summary-value">{totalItems}</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Total Amount:</span>
                            <span className="summary-value price">Ksh {totalPrice.toLocaleString()}</span>
                        </div>
                        <div className="summary-actions">
                            <button 
                                onClick={handleCheckoutAll}
                                className="checkout-button"
                            >
                                Checkout All Items
                            </button>
                            <button 
                                onClick={handleContinueShopping}
                                className="secondary-button"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                    
                    <div className="cart-items">
                        <h2>Your Selected Properties ({totalItems})</h2>
                        <div className="cart-cards-container">
                            {cartCards}
                        </div>
                    </div>
                    
                    <div className="cart-footer">
                        <button 
                            onClick={() => {
                                localStorage.removeItem("cart");
                                navigate("/cart", { replace: true });
                            }}
                            className="clear-cart-button"
                        >
                            Clear Entire Cart
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}