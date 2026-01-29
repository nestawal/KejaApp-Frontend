import React, { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import NewCard from "../components/newCard.jsx"
import axios from "axios"

export default function MyLeased() {
    const navigate = useNavigate()
    const location = useLocation()
    const formData = location.state?.formData || {};
    console.log("FormData:", formData)
    
    const [posts, setPosts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const personId = formData._id;
    const userEmail = formData.email;
    const url = "https://kejaapp-backend.onrender.com"
    
    useEffect(() => {
        if (!personId || !userEmail) {
            setError("User not logged in");
            setLoading(false);
            return;
        }
        
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // 1. Fetch ALL transactions for this person
                const transactionsResponse = await axios.get(`${url}/transactions/person/${personId}`);
                console.log("User transactions:", transactionsResponse.data);
                setTransactions(transactionsResponse.data.transactions || []);
                
                // 2. Fetch ALL posts for this user
                const postsResponse = await axios.post(`${url}/Post/yourPosts`, { 
                    email: userEmail 
                });
                
                console.log("All posts from email:", postsResponse.data);
                
                // Get posts array from response
                const allPosts = postsResponse.data.enrPosts || postsResponse.data.posts || postsResponse.data;
                
                // Show ALL posts (not filtered)
                setPosts(Array.isArray(allPosts) ? allPosts : []);
                
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data");
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [personId, userEmail]);
    
    // Function to get transactions for a specific property
    const getTransactionsForProperty = (propertyId) => {
        return transactions.filter(txn => 
            txn.propertyId && txn.propertyId.toString() === propertyId.toString()
        );
    };
    
    if (loading) {
        return <div>Loading your properties...</div>;
    }
    
    if (error) {
        return (
            <div>
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => navigate("/")}>Go Home</button>
            </div>
        );
    }
    
    // Calculate payment summary
    const totalTransactions = transactions.length;
    const totalAmountPaid = transactions.reduce((sum, txn) => sum + (txn.amount || 0), 0);
    const pendingTransactions = transactions.filter(txn => txn.status === 'pending').length;
    const completedTransactions = transactions.filter(txn => txn.status === 'completed' || !txn.status).length;
    
    // Create cards for ALL properties
    const cards = posts.map(post => {
        const propertyId = post._id;
        const propertyTransactions = getTransactionsForProperty(propertyId);
        const totalPaidForProperty = propertyTransactions.reduce((sum, txn) => sum + (txn.amount || 0), 0);
        const pendingForProperty = propertyTransactions.filter(txn => txn.status === 'pending').length;
        
        return (
            <NewCard
                key={post._id}
                _id={post._id}
                file={post.file}
                description={post.description || post.posts?.description}
                price={post.price || post.posts?.price}
                title={post.title || post.posts?.name || post.name}
                location={post.location || post.posts?.location}
                isAdmin={true} // Show admin controls
                personId={personId}
                propertyId={propertyId}
                formData={formData}
                showRequestButton={true}
                // Add payment info to card
                transactionCount={propertyTransactions.length}
                totalPaid={totalPaidForProperty}
                pendingPayments={pendingForProperty}
            />
        );
    });
    
    return (
        <div className="my-leased-container">
            <h1>Your Properties & Payments</h1>
            
            {/* Small Payment Summary at top */}
            <div className="small-summary">
                <div className="summary-item">
                    <span className="summary-label">Total Payments:</span>
                    <span className="summary-value">{totalTransactions}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Amount Paid:</span>
                    <span className="summary-value">ksh {totalAmountPaid}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Completed:</span>
                    <span className="summary-value">{completedTransactions}</span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Pending:</span>
                    <span className="summary-value">{pendingTransactions}</span>
                </div>
            </div>
            
            {/* Property Cards (ALL properties) */}
            <section className="cards-list">
                {cards}
            </section>
            
            {/* Remove the "Add Post" button from MyPosts since this is different */}
            
            <style jsx>{`
                .my-leased-container {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                
                h1 {
                    color: #333;
                    margin-bottom: 15px;
                    font-size: 24px;
                }
                
                /* Small summary at top */
                .small-summary {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                    margin-bottom: 30px;
                    padding: 15px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    border-left: 4px solid #007bff;
                }
                
                .summary-item {
                    display: flex;
                    flex-direction: column;
                    padding: 0 15px;
                    border-right: 1px solid #dee2e6;
                }
                
                .summary-item:last-child {
                    border-right: none;
                }
                
                .summary-label {
                    font-size: 12px;
                    color: #6c757d;
                    margin-bottom: 4px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .summary-value {
                    font-size: 18px;
                    font-weight: bold;
                    color: #007bff;
                }
                
                .cards-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    .small-summary {
                        gap: 10px;
                        padding: 10px;
                    }
                    
                    .summary-item {
                        padding: 0 10px;
                        min-width: calc(50% - 20px);
                        border-right: none;
                        border-bottom: 1px solid #dee2e6;
                        padding-bottom: 10px;
                    }
                    
                    .summary-item:nth-child(odd) {
                        border-right: 1px solid #dee2e6;
                        padding-right: 20px;
                    }
                    
                    .summary-item:nth-child(even) {
                        padding-left: 20px;
                    }
                    
                    .summary-item:nth-last-child(-n+2) {
                        border-bottom: none;
                        padding-bottom: 0;
                    }
                    
                    .cards-list {
                        grid-template-columns: 1fr;
                    }
                }
                
                @media (max-width: 480px) {
                    .summary-item {
                        min-width: 100%;
                        border-right: none !important;
                        border-bottom: 1px solid #dee2e6;
                        padding: 10px 0 !important;
                    }
                    
                    .summary-item:last-child {
                        border-bottom: none;
                    }
                }
            `}</style>
        </div>
    );
}