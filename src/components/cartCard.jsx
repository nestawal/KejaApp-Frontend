import React, { useState } from "react"

const CartCard = (props) => {
    // Provide safe defaults for all properties
    const {
        id,
        title = "Untitled Property",
        price = 0,
        location = "Unknown Location",
        stats = { rating: 0, reviewCount: 0 }, // Default stats object
        coverImg,
        file,
        openSpots,
        onRemove, // Function to remove from cart
        onCheckout, // Function for checkout
        originalItem // The original item data
    } = props;
    
    console.log("CartCard props:", props); // Debug log
    
    let badgeText;
    if (openSpots === 0) {
        badgeText = "SOLD OUT";
    } else if (location === "Online") {
        badgeText = "ONLINE";
    }
    
    const [isListed, setListed] = useState(false);
    
    // Handle rent/remove button
    function handleRentRemove() {
        if (isListed) {
            // If already listed, remove from cart
            if (onRemove) {
                onRemove(id || originalItem?.id || originalItem?._id);
            }
        } else {
            // If not listed, add to cart (though this shouldn't happen in cart view)
            if (props.cart) {
                props.cart();
            }
        }
        setListed(prev => !prev);
    }
    
    // Determine image source
    const getImageSrc = () => {
        if (file) {
            // Handle base64 images from API
            return `data:image/jpeg;base64,${file}`;
        } else if (coverImg) {
            // Handle regular image paths
            if (coverImg.startsWith('http') || coverImg.startsWith('data:')) {
                return coverImg;
            } else {
                return `/images/${coverImg}`;
            }
        } else if (originalItem?.file) {
            // Check original item for file
            return `data:image/jpeg;base64,${originalItem.file}`;
        } else if (originalItem?.coverImg) {
            // Check original item for coverImg
            const img = originalItem.coverImg;
            if (img.startsWith('http') || img.startsWith('data:')) {
                return img;
            } else {
                return `/images/${img}`;
            }
        }
        return "/images/default-property.jpg"; // Fallback image
    };
    
    const imageSrc = getImageSrc();

    return (
        <div className="cart-card" key={id}>
            {badgeText && 
                <div className="cart-card--badge">{badgeText}</div>
            }
            
            <img 
                src={imageSrc} 
                className="cart-card--image" 
                alt={title}
                onError={(e) => {
                    e.target.src = "/images/default-property.jpg";
                }}
            />
            
            <div className="cart-card--stats">
                {stats.rating > 0 && (
                    <>
                        <img src="/images/star.png" className="cart-card--star" alt="rating" />
                        <span>{stats.rating}</span>
                        <span className="gray">({stats.reviewCount}) • </span>
                    </>
                )}
                <span className="gray">{location}</span>
            </div>
            
            <p className="cart-card--title">{title}</p>
            <p className="cart-card--price">
                <span className="bold">Ksh {price.toLocaleString()}</span>
                {props.pricePerPerson && <span className="gray"> / person</span>}
            </p>
            
            <div className="cart-card--actions">
                <button 
                    onClick={handleRentRemove}
                    className={isListed ? "remove-btn" : "rent-btn"}
                >
                    {isListed ? "Remove from Cart" : "Rent"}
                </button>
                
                {onCheckout && (
                    <button 
                        onClick={() => onCheckout(id || originalItem?.id || originalItem?._id)}
                        className="checkout-btn"
                    >
                        Checkout
                    </button>
                )}
            </div>
            
            {/* Debug info - remove in production */}
            <div style={{ fontSize: '10px', color: '#666', marginTop: '5px' }}>
                ID: {id} | Type: {originalItem?.posts ? 'API' : 'Local'}
            </div>
        </div>
    )
}

export default CartCard;