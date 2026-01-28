import { useState, useEffect } from "react";
import axios from "axios";

export default function Requests(props) {
    //const url = "http://localhost:3001"
    const url = "https://kejaapp-backend.onrender.com"
    const [info, setInfo] = useState(props.info || [])
    const [acceptingId, setAcceptingId] = useState(null);
    const [error, setError] = useState(null);
    
    // postInfo should come from props, not useState
    const postInfo = props.postInfo || [];
    
    useEffect(() => {
        if (props.info) {
            setInfo(props.info)
        }
    }, [props.info]);

    const acceptInfo = async (user) => {
        if (!user || postInfo.length === 0) return;
        
        // Check if post is already leased
        if (postInfo[0]?.leased) {
            alert("This property is already leased!");
            return;
        }
        
        setAcceptingId(user.pendingUserId);
        setError(null);
        
        try {
            const newReq = {
                postId: postInfo[0].postId,
                leased: true,
                acceptedUserId: user.pendingUserId,
                months: user.months,
                date: Date.now(),
                acceptedUserName: user.name
            };

            console.log("Sending acceptance request:", newReq);
            
            const result = await axios.patch(`${url}/requests/acceptReq`, newReq);
            console.log("Response:", result.data);
            
            // Update UI without reloading
            // Remove the accepted user from the list
            setInfo(prevInfo => prevInfo.filter(u => u.pendingUserId !== user.pendingUserId));
            
            // You might want to update parent component that post is now leased
            // Or refresh the data from parent
            
            alert(`Successfully accepted ${user.name}'s request!`);
            
        } catch (error) {
            console.error("Error accepting request:", error);
            setError(`Failed to accept request: ${error.response?.data?.error || error.message}`);
            
            // Show error alert
            alert(`Failed to accept request: ${error.response?.data?.error || error.message}`);
        } finally {
            setAcceptingId(null);
        }
    };

    // Check if info is loaded and has data
    if (!info || info.length === 0) {
        return (
            <div>
                <p>No requests found.</p>
            </div>
        )
    }

    // Check if postInfo is available
    const isLeased = postInfo[0] ? postInfo[0].leased : false;
    console.log("Is leased?", isLeased);
    console.log("Post info:", postInfo);

    return (
        <div>
            {error && (
                <div className="error-message" style={{ color: 'red', padding: '10px' }}>
                    {error}
                </div>
            )}
            
            <table className="infotable">
                <thead>
                    <tr>
                        <th>date</th>
                        <th>name</th>
                        <th>months</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {info.map(user => {
                        return (
                            <tr key={user._id}> 
                                <td>{new Date(user.date).toLocaleDateString()}</td>
                                <td>{user.name}</td>
                                <td>{user.months}</td>
                                {!isLeased && (
                                    <td>
                                        <button 
                                            className="accept" 
                                            onClick={() => acceptInfo(user)}
                                            disabled={acceptingId === user.pendingUserId}
                                        >
                                            {acceptingId === user.pendingUserId ? 'Accepting...' : 'accept'}
                                        </button>
                                        {error && acceptingId === user.pendingUserId && (
                                            <div className="error-message" style={{ color: 'red' }}>
                                                {error}
                                            </div>
                                        )}
                                    </td>
                                )}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}