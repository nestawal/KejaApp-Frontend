import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Payments from "./InfoRecord/postPayments.jsx";
import Accepted from "./InfoRecord/Accepted.jsx";
import Requests from "./InfoRecord/Requests.jsx";
import Lease from "./InfoRecord/postLeased.jsx";

export default function AgentPostInfo() {
    const location = useLocation();
    const formData = location.state || {};
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [Record, SetRecord] = useState("requests");
    const [postInfo, setPostInfo] = useState(null);
    const [requestInfo, setRequestInfo] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paymentsLoading, setPaymentsLoading] = useState(false);
    
    // NEW: State to store the latest transaction for Lease section
    const [latestTransaction, setLatestTransaction] = useState(null);
    
    const url = "https://kejaapp-backend.onrender.com";

    useEffect(() => {
        if (!id) {
            console.error("No ID provided in URL");
            setError("No property ID provided");
            return;
        }

        const findPost = async () => {
            setLoading(true);
            setError(null);
            
            try {
                console.log("Fetching post with ID:", id);
                
                const postResponse = await axios.get(`${url}/Post/${id}`);
                console.log("Post data:", postResponse.data);
                setPost(postResponse.data);
                
                const requestResponse = await axios.get(`${url}/requests/getRequest/${id}`);
                console.log("Request data:", requestResponse.data);
                
                if (requestResponse.data && requestResponse.data.requestedId) {
                    const { requestedId } = requestResponse.data;
                    setRequestInfo(requestedId.pending || []);
                    setPostInfo(requestedId);
                } else {
                    setRequestInfo([]);
                    setPostInfo(null);
                }
                
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error.message);
                
                if (error.response?.status === 404) {
                    setError("Property not found");
                } else if (error.response?.status === 500) {
                    setError("Server error. Please try again later.");
                }
            } finally {
                setLoading(false);
            }
        };

        findPost();
    }, [id]);

    // Function to fetch transactions
    const fetchTransactions = async () => {
        if (!id) return;
        
        setPaymentsLoading(true);
        try {
            console.log("Fetching transactions for propertyId:", id);
            
            const response = await axios.get(`${url}/transactions/property/${id}`);
            console.log("Transactions response:", response.data);
            
            const fetchedTransactions = response.data.transactions || [];
            setTransactions(fetchedTransactions);
            
            // NEW: Find the latest transaction to pass to Lease section
            if (fetchedTransactions.length > 0) {
                // Get the most recent transaction (already sorted by createdAt: -1)
                const latest = fetchedTransactions[0];
                setLatestTransaction({
                    name: latest.personName,
                    email: latest.personEmail,
                    date: latest.createdAt || latest.formattedDate
                });
                console.log("Latest transaction set for Lease:", {
                    name: latest.personName,
                    email: latest.personEmail,
                    date: latest.createdAt
                });
            } else {
                setLatestTransaction(null);
            }
            
        } catch (error) {
            console.error("Error fetching transactions:", error);
            setTransactions([]);
            setLatestTransaction(null);
        } finally {
            setPaymentsLoading(false);
        }
    };

    // Fetch transactions when Payments tab is selected
    useEffect(() => {
        if (Record === "Payments" && id) {
            fetchTransactions();
        }
    }, [Record, id]);

    function recordChoice(r) {
        SetRecord(r);
        console.log("Selected record:", r);
        
        if (r === "Payments" && id) {
            fetchTransactions();
        }
    }

    // Loading state
    if (loading) {
        return <div className="loading">Loading post information...</div>;
    }

    // Error state
    if (error) {
        return (
            <div className="error">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => window.history.back()}>Go Back</button>
            </div>
        );
    }

    if (!post || !post.posts) {
        return <div>Loading post information...</div>;
    }

    return (
        <div className="postInfo">
            <div className="postInfo--profile">
                {post.file ? (
                    <img 
                        src={`data:image/jpeg;base64,${post.file}`}  
                        className="postInfo--image" 
                        alt={post.posts.name}
                    />
                ) : (
                    <div className="postInfo--image-placeholder">No Image</div>
                )}
                <div className="postInfo--details">
                    <div className="postInfo--title">{post.posts.name}</div>
                    <div><strong>Rooms:</strong> {post.posts.rooms}</div>
                    <div><strong>Price:</strong> ksh {post.posts.price} p/m</div>
                    <div><strong>Location:</strong> {post.posts.location}</div>
                </div>
            </div>
            
            <div className="postInfo--choice">
                <button 
                    onClick={() => recordChoice("Requests")}
                    className={Record === "Requests" ? "active" : ""}
                >
                    Requests
                </button>
                <button 
                    onClick={() => recordChoice("Accepted")}
                    className={Record === "Accepted" ? "active" : ""}
                >
                    Accepted
                </button>
                <button 
                    className={Record === "Lease" ? "active" : ""} 
                    onClick={() => recordChoice("Lease")}
                >
                    Lease
                </button> 
                <button 
                    onClick={() => recordChoice("Payments")}
                    className={Record === "Payments" ? "active" : ""}
                >
                    Payments
                </button>
            </div>
            
            {Record === "Requests" && (
                <Requests
                    info={requestInfo}
                    postInfo={postInfo ? [postInfo] : []}
                />
            )}
            
            {Record === "Accepted" && postInfo && (
                <Accepted
                    postInfo={postInfo}
                />
            )}

            {Record === "Lease" && postInfo && (
                <Lease
                    postInfo={postInfo}
                    property={post}
                    
                    // NEW: Pass the latest transaction data
                    latestPayment={latestTransaction}
                />
            )}
            
            {Record === "Payments" && (
                <Payments 
                    propertyId={id}
                    transactions={transactions}
                    loading={paymentsLoading}
                    onRefresh={fetchTransactions}
                />
            )}
        </div>
    );
}