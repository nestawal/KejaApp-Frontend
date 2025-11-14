import React from "react";

export default function Accepted(props){
    const postInfo = props.postInfo
    console.log(postInfo)
    const accepted = postInfo.accepted
    console.log(accepted)
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
                    <tr > 
                        <td>{new Date(accepted.date).toLocaleDateString()}</td>
                        <td>{accepted.acceptedUserName}</td>
                        <td>{accepted.months}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}