import React from "react";
import axios from "axios";

export default function Payments({ propertyId, transactions, loading, onRefresh }) {
    const url = "https://kejaapp-backend.onrender.com";
    
    // Calculate total amount
    const totalAmount = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
    const completedTransactions = transactions.filter(tx => tx.status === 'COMPLETED');
    const completedAmount = completedTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
    
    if (loading) {
        return (
            <div className="payments">
                <h2>Payment History</h2>
                <p>Loading transactions...</p>
            </div>
        );
    }
    
    return (
        <div className="payments">
            <div className="payments-header">
                <h2>Payment History</h2>
                <button onClick={onRefresh} className="refresh-btn">
                    Refresh
                </button>
            </div>
            
            {propertyId && (
                <div className="payment-summary">
                    <p><strong>Property ID:</strong> {propertyId}</p>
                    <p><strong>Total Transactions:</strong> {transactions.length}</p>
                    <p><strong>Total Amount:</strong> Ksh {totalAmount.toLocaleString()}</p>
                    <p><strong>Completed Payments:</strong> Ksh {completedAmount.toLocaleString()} ({completedTransactions.length} transactions)</p>
                </div>
            )}
            
            {transactions.length === 0 ? (
                <div className="no-transactions">
                    <p>No payment transactions found for this property.</p>
                </div>
            ) : (
                <div className="transactions-table">
                    <table className="infotable">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Payment Ref</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => (
                                <tr key={tx._id}>
                                    <td>
                                        {tx.createdAt 
                                            ? new Date(tx.createdAt).toLocaleDateString() 
                                            : 'N/A'}
                                    </td>
                                    <td>Ksh {tx.amount?.toLocaleString() || '0'}</td>
                                    <td>{tx.phone || 'N/A'}</td>
                                    <td>
                                        <span className={`status-badge status-${tx.status?.toLowerCase() || 'pending'}`}>
                                            {tx.status || 'PENDING'}
                                        </span>
                                    </td>
                                    <td>
                                        {tx.mpesaReceiptNumber 
                                            ? tx.mpesaReceiptNumber 
                                            : tx.checkoutRequestId 
                                                ? tx.checkoutRequestId.slice(-8) 
                                                : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            <style jsx>{`
                .payments {
                    padding: 20px;
                }
                
                .payments-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                
                .refresh-btn {
                    padding: 8px 16px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                
                .refresh-btn:hover {
                    background-color: #45a049;
                }
                
                .payment-summary {
                    background-color: #f5f5f5;
                    padding: 15px;
                    border-radius: 5px;
                    margin-bottom: 20px;
                }
                
                .payment-summary p {
                    margin: 5px 0;
                }
                
                .no-transactions {
                    text-align: center;
                    padding: 40px;
                    color: #666;
                }
                
                .status-badge {
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: bold;
                }
                
                .status-completed {
                    background-color: #d4edda;
                    color: #155724;
                }
                
                .status-pending {
                    background-color: #fff3cd;
                    color: #856404;
                }
                
                .status-failed {
                    background-color: #f8d7da;
                    color: #721c24;
                }
            `}</style>
        </div>
    );
}