import React from "react";

export default function Accepted(props){
    const postInfo = props.postInfo || {};
    console.log("Post info:", postInfo);
    
    const accepted = postInfo.accepted || {};
    console.log("Accepted info:", accepted);

    // Check if accepted data exists
    if (!accepted || Object.keys(accepted).length === 0) {
        return (
            <div>
                <p>No tenant has been accepted for this post yet.</p>
            </div>
        )
    }

    // Check if required fields exist
    if (!accepted.date || !accepted.acceptedUserName || accepted.months === undefined) {
        return (
            <div>
                <p>Incomplete acceptance data.</p>
            </div>
        )
    }

    return(
        <div>
            <table className="infotable">
                <thead>
                    <tr>
                        <th>date</th>
                        <th>name</th>
                        <th>months</th>
                    </tr>
                </thead>
                <tbody>
                    <tr> 
                        <td>{new Date(accepted.date).toLocaleDateString()}</td>
                        <td>{accepted.acceptedUserName}</td>
                        <td>{accepted.months}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}