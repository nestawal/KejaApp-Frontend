import {useState,useEffect} from "react";
import axios from "axios";

//fix tomorrow trying to take pendingUsername to the acceptInfo function and patch in the database
export default function Requests(props){
    const url = "https://kejaapp-backend.onrender.com"
    const [info,setInfo] = useState(props.info)
    console.log(info[0].name)
    const postInfo = useState(props.postInfo)
    console.log("this is a post info for requests",postInfo)
    console.log("post info id :",postInfo[0]._id)
    console.log("this is the post Id :",postInfo[0].postId)

    useEffect(()=>{
        setInfo(props.info)
        console.log("this is new props:",info);
    },[props.info]);

    //write this
    const acceptInfo=async()=>{
        const acceptedUserId = info[0].pendingUserId
        console.log(acceptedUserId)
        const months = info[0].months
        const name = info[0].name
        const postId = postInfo[0].postId
        

        const newReq={
            postId: postId,
            leased : true,
            acceptedUserId : acceptedUserId,
            months : months,
            date : Date.now(),
            acceptedUserName: name
        }

        
        await axios.patch(`${url}/requests/acceptReq`,newReq)
            .then(result=>console.log(result.data))
            .then(window.location.reload())

        console.log("new request",newReq);
        

    }


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
                    {info.map(user=>{
                        return(
                            <tr key={user._id}> 
                                <td>{new Date(user.date).toLocaleDateString()}</td>
                                <td>{user.name}</td>
                                <td>{user.months}</td>

                                {postInfo[0].leased==false && <td><button className="accept" onClick={()=>acceptInfo()}>accept</button></td>}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}