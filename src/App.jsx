import { React, useState, useEffect, useCallback } from "react"
import Navbar from "./components/Navbar.jsx"
import Card from "./components/Card.jsx"
import fuggazi from "./data.js"
import Search from "./components/searchBar.jsx"
import { useLocation, useNavigate } from "react-router-dom"
import SideBar from "./SideBar.jsx"
import NewCard from "./components/newCard.jsx"

export default function App() {
    const navigate = useNavigate()
    const location = useLocation();
    const formData = location.state?.user || location.state?.formData || {};
    console.log("Form Data:", formData)
    const url = "https://kejaapp-backend.onrender.com"

    // User authentication state
    const postLogOnly = formData.name ? true : false;
    console.log("User logged in:", postLogOnly);

    // State declarations
    const [cart, setCart] = useState([])
    const [search, setSearch] = useState({
        title: "",
        location: ""
    })
    const [filtered, setFiltered] = useState([])
    const [render, setRender] = useState(false)
    const [show, setShow] = useState(false)
    const [dataNew, setDataNew] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (err) {
                console.error("Error parsing cart from localStorage:", err);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // Navigation functions
    const goSign = () => navigate("/signUp")
    const goCart = () => navigate("/cart", { state: { cart } })
    const goDash = () => navigate("/Dashboard", { state: { formData } })
    
    const showSideBar = () => setShow(prev => !prev)
    const renderSearch = () => setRender(prev => !prev)

    // Cart functionality
    const handleCart = useCallback((newItem) => {
        // Check if item already exists in cart
        const exists = cart.some(item => 
            item.id === newItem.id || 
            item._id === newItem._id ||
            (item.title === newItem.title && item.location === newItem.location)
        );
        
        if (!exists) {
            setCart(prev => [...prev, newItem]);
        } else {
            console.log("Item already in cart");
        }
    }, [cart]);

    // Fetch data from API
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${url}/Post/feed`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Fetched data:", data);
            setDataNew(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // IMPROVED FILTER FUNCTION - FIXED FOR LOCATION FORMAT
    const filterCards = useCallback(() => {
        const title = search.title.toLowerCase().trim();
        const locationQuery = search.location.toLowerCase().trim();
        
        console.log("Searching with:", { title, locationQuery });
        
        // If both search fields are empty, show all cards
        if (title === "" && locationQuery === "") {
            setFiltered([]); // Empty array means show all
            return;
        }
        
        // Filter fuggazi data
        const filteredData = fuggazi.filter(item => {
            const itemTitle = (item.title || "").toLowerCase();
            const itemLocation = (item.location || "").toLowerCase();
            
            console.log("Checking item:", {
                itemTitle,
                itemLocation,
                title,
                locationQuery
            });
            
            // FIX: Handle location search more flexibly
            let titleMatch = true;
            let locationMatch = true;
            
            if (title !== "") {
                titleMatch = itemTitle.includes(title);
            }
            
            if (locationQuery !== "") {
                // Try different matching strategies for location
                // 1. Direct contains
                // 2. Match city name before comma (e.g., "Nakuru" in "Nakuru, Kenya")
                // 3. Match any part of the location string
                const locationParts = itemLocation.split(',');
                const cityName = locationParts[0]?.trim();
                
                locationMatch = 
                    itemLocation.includes(locationQuery) ||
                    (cityName && cityName.includes(locationQuery)) ||
                    locationParts.some(part => part.trim().includes(locationQuery));
            }
            
            console.log("Match results:", { titleMatch, locationMatch });
            
            // Use AND logic: must match both title AND location if provided
            return titleMatch && locationMatch;
        });
        
        console.log("Filtered results:", filteredData);
        setFiltered(filteredData);
    }, [search]);

    // Also filter API data for consistency
    const filterApiCards = useCallback(() => {
        const title = search.title.toLowerCase().trim();
        const locationQuery = search.location.toLowerCase().trim();
        
        if (title === "" && locationQuery === "") {
            return dataNew; // Return all if no search
        }
        
        return dataNew.filter(item => {
            const itemTitle = (item.posts?.name || "").toLowerCase();
            const itemLocation = (item.posts?.location || "").toLowerCase();
            
            let titleMatch = true;
            let locationMatch = true;
            
            if (title !== "") {
                titleMatch = itemTitle.includes(title);
            }
            
            if (locationQuery !== "") {
                const locationParts = itemLocation.split(',');
                const cityName = locationParts[0]?.trim();
                
                locationMatch = 
                    itemLocation.includes(locationQuery) ||
                    (cityName && cityName.includes(locationQuery)) ||
                    locationParts.some(part => part.trim().includes(locationQuery));
            }
            
            return titleMatch && locationMatch;
        });
    }, [search, dataNew]);

    // Update search state
    const writeSearch = (e) => {
        const { name, value } = e.target;
        setSearch(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Filter cards whenever search changes
    useEffect(() => {
        filterCards();
    }, [search, filterCards]);

    // Render all cards
    const unFil = fuggazi.map(item => (
        <Card
            {...item}
            key={item.id}
            cart={() => handleCart(item)}
            postLogOnly={postLogOnly}
        />
    ));

    const filCards = filtered.map(item => (
        <Card
            {...item}
            key={item.id}
            cart={() => handleCart(item)}
            postLogOnly={postLogOnly}
        />
    ));

    // Get filtered API cards
    const filteredApiCards = filterApiCards();
    
    const newCards = filteredApiCards.map(item => (
        <NewCard
            key={item._id}
            {...item}
            postLogOnly={postLogOnly}
            cart={() => handleCart(item)}
            file={item.file}
            description={item.posts?.description}
            price={item.posts?.price}
            title={item.posts?.name}
            location={item.posts?.location}
            formData={formData}
        />
    ));

    // Determine which cards to display
    let displayCards;
    const hasSearch = search.title !== "" || search.location !== "";
    
    if (hasSearch) {
        // When searching, combine filtered local cards and filtered API cards
        displayCards = [...filCards, ...newCards];
        
        // If no results in either, show message
        if (displayCards.length === 0) {
            displayCards = (
                <div className="no-results" key="no-results">
                    <p>No properties found matching "{search.title} {search.location}". Try different search terms.</p>
                    <button onClick={() => {
                        setSearch({ title: "", location: "" });
                        setFiltered([]);
                    }}>
                        Clear Search
                    </button>
                </div>
            );
        }
    } else {
        // No search, show all cards
        displayCards = [...unFil, ...newCards];
    }

    // Loading and error states
    if (loading && dataNew.length === 0) {
        return (
            <div className="app-loading">
                <div>Loading properties...</div>
            </div>
        );
    }

    if (error && dataNew.length === 0) {
        return (
            <div className="app-error">
                <div>Error loading properties: {error}</div>
                <button onClick={fetchData}>Retry</button>
            </div>
        );
    }

    return (
        <div className="app-container">
            {render && (
                <Search
                    content={search}
                    writeSearch={writeSearch}
                    filter={filterCards}
                />
            )}
            
            <Navbar 
                fullName={formData?.name || "Guest"} 
                renderSearch={renderSearch}
                show={show}
                showSideBar={showSideBar}
                cartCount={cart.length}
                onCartClick={goCart}
            />
            
            <div className="bodySec">
                <section 
                    style={{ minWidth: show ? '75%' : undefined }}
                    className="cards-list"
                >
                    {displayCards}
                </section>
                
                {show && (
                    <section className="SideSec">
                        <SideBar 
                            signUp={goSign}
                            cart={goCart}
                            render={renderSearch}
                            dash={goDash}
                            formData={formData}
                            postLogOnly={postLogOnly}
                        />
                    </section>
                )}
            </div>
        </div>
    )
}