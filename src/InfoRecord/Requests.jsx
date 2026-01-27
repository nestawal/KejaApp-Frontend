import {useState, useEffect} from "react";
import axios from "axios";

export default function Requests(props){
    const url = "https://kejaapp-backend.onrender.com"
    const [info, setInfo] = useState(props.info || [])
    const postInfo = useState(props.postInfo || [])
    
    // Remove the direct console.log statements that cause errors
    // console.log(info[0].name) // This was causing the error
    
    useEffect(()=>{
        if(props.info){
            setInfo(props.info)
        }
    },[props.info]);

    const acceptInfo = async (user) => {
        if (!user || !postInfo[0]) return;
        
        const acceptedUserId = user.pendingUserId
        console.log(acceptedUserId)
        const months = user.months
        const name = user.name
        const postId = postInfo[0].postId
        

        const newReq = {
            postId: postId,
            leased : true,
            acceptedUserId : acceptedUserId,
            months : months,
            date : Date.now(),
            acceptedUserName: name
        }

        try {
            await axios.patch(`${url}/requests/acceptReq`, newReq)
                .then(result => console.log(result.data))
                .then(() => window.location.reload())
        } catch (error) {
            console.error("Error accepting request:", error)
        }

        console.log("new request", newReq);
    }

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

    return(
        <div>
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
                        return(
                            <tr key={user._id}> 
                                <td>{new Date(user.date).toLocaleDateString()}</td>
                                <td>{user.name}</td>
                                <td>{user.months}</td>
                                {!isLeased && (
                                    <td>
                                        <button 
                                            className="accept" 
                                            onClick={() => acceptInfo(user)}
                                        >
                                            accept
                                        </button>
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