// Lease.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Lease({ postInfo, property, onUpdateLease }) {
    const [lease, setLease] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const url = "https://kejaapp-backend.onrender.com";
    
    useEffect(() => {
        fetchLeaseInfo();
    }, [postInfo]);
    
    const fetchLeaseInfo = async () => {
        if (!postInfo?.postId) return;
        
        try {
            setLoading(true);
            const response = await axios.get(`${url}/leases/${postInfo.postId}`);
            setLease(response.data);
        } catch (err) {
            console.error("Error fetching lease:", err);
            setError("Failed to load lease information");
        } finally {
            setLoading(false);
        }
    };
    
    const handleSignLease = async () => {
        try {
            await axios.post(`${url}/leases/sign`, {
                postId: postInfo.postId,
                tenantId: postInfo.accepted?.acceptedUserId,
                months: postInfo.accepted?.months,
                startDate: new Date().toISOString()
            });
            alert("Lease signed successfully!");
            fetchLeaseInfo(); // Refresh lease data
        } catch (err) {
            alert("Failed to sign lease: " + err.message);
        }
    };
    
    if (loading) return <div>Loading lease information...</div>;
    if (error) return <div>Error: {error}</div>;
    
    return (
        <div className="lease-container">
            <h2>Lease Agreement</h2>
            
            {lease ? (
                <div className="lease-details">
                    <div className="lease-info">
                        <p><strong>Property:</strong> {property?.posts?.name}</p>
                        <p><strong>Location:</strong> {property?.posts?.location}</p>
                        <p><strong>Tenant:</strong> {postInfo.accepted?.acceptedUserName}</p>
                        <p><strong>Lease Duration:</strong> {postInfo.accepted?.months} months</p>
                        <p><strong>Monthly Rent:</strong> Ksh {property?.posts?.price}</p>
                        <p><strong>Start Date:</strong> {new Date(lease.startDate).toLocaleDateString()}</p>
                        <p><strong>End Date:</strong> {new Date(lease.endDate).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> {lease.status}</p>
                    </div>
                    
                    {lease.status === 'ACTIVE' && (
                        <div className="lease-actions">
                            <button onClick={() => window.print()}>Print Lease</button>
                            <button onClick={handleSignLease}>Renew Lease</button>
                            <button onClick={() => {/* Terminate lease logic */}}>
                                Terminate Lease
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="no-lease">
                    <p>No lease agreement has been created yet.</p>
                    {postInfo.accepted && (
                        <button onClick={handleSignLease}>
                            Create Lease Agreement
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}