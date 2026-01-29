import React from "react";

export default function Lease({ 
    postInfo, 
    property, 
    latestPayment  // Receive latest transaction data
}) {
    console.log(latestPayment)
    
    // Format the date
    const formatDate = (dateString) => {
        if (!dateString) return "No date";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return "Invalid date";
        }
    };
    
    // Only show if we have latestPayment
    if (!latestPayment) {
        return (
            <div className="lease-container">
                <h3>Lease Information</h3>
                <p>No payment data available.</p>
            </div>
        );
    }

    const { name, email, date } = latestPayment;

    return (
        <div className="lease-container">
            <h3>Lease Information</h3>
            
            {/* Simple Table with only 3 columns */}
            <table className="simple-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Payment Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{name || "Not available"}</td>
                        <td>{email || "Not available"}</td>
                        <td>{formatDate(date)}</td>
                    </tr>
                </tbody>
            </table>
            
            <style jsx>{`
                .lease-container {
                    padding: 20px;
                }
                
                .lease-container h3 {
                    margin-bottom: 20px;
                    color: #333;
                }
                
                .simple-table {
                    width: 100%;
                    border-collapse: collapse;
                    background: white;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                
                .simple-table th {
                    background: #f8f9fa;
                    padding: 12px 15px;
                    text-align: left;
                    font-weight: 600;
                    color: #495057;
                    border-bottom: 2px solid #dee2e6;
                }
                
                .simple-table td {
                    padding: 12px 15px;
                    border-bottom: 1px solid #dee2e6;
                    color: #495057;
                }
                
                .simple-table tbody tr:last-child td {
                    border-bottom: none;
                }
            `}</style>
        </div>
    );
}

// Add default props
Lease.defaultProps = {
    latestPayment: null
};