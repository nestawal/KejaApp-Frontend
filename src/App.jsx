import {React,useState,useEffect} from "react"
import Navbar from "./components/Navbar.jsx"
import Card from "./components/Card.jsx"
import fuggazi from "./data.js"
import Search from "./components/searchBar.jsx"
import {useLocation,useNavigate} from "react-router-dom"
import SideBar from "./SideBar.jsx"
import NewCard from "./components/newCard.jsx"

export default function App() {
    const navigate = useNavigate()
    const location = useLocation();
    const formData = location.state?.user || location.state?.formData || {};
    console.log(formData)
    const url = "https://kejaapp-backend.onrender.com"


    useEffect(()=>{
        if(formData){
            console.log(formData)
        }else{
            console.log("formData not available")
        }
    },[formData])


    function goSign(){
        navigate("/signUp")
    }

    const[cart,setCart]= useState([])
    function handleCart(newItem){
            setCart(prev=>[
                ...prev,
                newItem
            ])
        
    }
    console.log(cart);

    useEffect(()=>{
        localStorage.setItem("cart",JSON.stringify(cart))
    })

    function goCart(){
        navigate("/cart",{state:{cart}})
    }

    function goDash(){
        navigate("/Dashboard",{state:{formData}})
    }
   
    //search functionality
    //search functionality
    const [search,setSearch] = useState({
        title:"",
        location:""
    })
    //function for change on the searchbar component
    function writeSearch(e){
        setSearch(prev=>{
            return{
                ...prev,
                [e.target.name] : e.target.value
            }
        
        })
        filterCards();
    }
    //filter search function
    const [filtered,setFiltered] = useState([])
    function filterCards(){
            if(search.title==""&&search.location==""){
                setFiltered(fuggazi)
            }else{
                const filteredData = fuggazi.filter(item => 
                    item.title.toLowerCase() === search.title.toLowerCase() || 
                    item.location.toLowerCase() === search.location.toLowerCase() ); 
                setFiltered(filteredData);
            }
    }
    console.log(filtered)


    const [dataNew, setDataNew] = useState([]);
    console.log(dataNew);
    const [error, setError] = useState(null); // Optional: for error handling
    const [loading, setLoading] = useState(true); // Optional: for loading state

    // 2. Use useEffect to perform the data fetching
    
    const fetchData = async () => {
        try {
            setLoading(true); 
            const response = await fetch(`${url}/Post/feed`);
            const data = await response.json();
            console.log(data);
            setDataNew(data); 
        } catch (err) {
            setError(err.message); 
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false); 
        }
    };
    useEffect(() => {
        fetchData(); 
    }, []);

   


    console.log(search)
    const [render,setRender] = useState(false)    
    function renderSearch(){
        setRender(prev=>!prev)
    }

    useEffect(() => {
        console.log("Render state changed:", render);
    }, [render]);


   
    const [show,setShow] = useState(false)
    function showSideBar(){
        setShow(prev=> !prev)
    }


    //not show list button and dashboard if user is not signed in 
    const postLogOnly = formData.name ? true : false ;
    console.log(postLogOnly);

     const filCards = filtered.map(item => {
        return (
            <Card
                {...item}
                key={item.id}
                cart={()=>handleCart(item)}
                postLogOnly = {postLogOnly}
            />
        )
    })

     const unFil = fuggazi.map(item => {
        return (
            <Card
                {...item}
                key={item.id}
                cart={()=>handleCart(item)}
                postLogOnly = {postLogOnly}
                
                
            />
        )
    })

    const cards = filtered.length === 0 ? unFil : filCards ;

     const newCards = dataNew.map(item => (
             <NewCard
                key={item._id}
                {...item}
                postLogOnly = {postLogOnly}
                cart={()=>handleCart(item)}
                file={item.file}
                description={item.posts.description}
                price={item.posts.price}
                title={item.posts.name}
                location={item.posts.location}
                formData={formData}

            />
        )
    );


    return (
        <div>
            {render && <Search
                content={search}
                writeSearch={writeSearch}
                filter={filterCards}
            />}
            <Navbar 
            fullName={formData ? formData.name : "Guest"} 
            renderSearch = {renderSearch}
            show = {show}
            setShow = {setShow}
            showSideBar = {showSideBar}
            
            />
            <div className="bodySec">
                <section style={{ minWidth: show ? '75%' : undefined }}className="cards-list">

                    {cards  } 
                    {newCards} 
                </section>
                {show && 
                <section className="SideSec">
                    <SideBar 
                        signUp = {goSign}
                        cart={goCart}
                        render={renderSearch}
                        dash={goDash}
                        formData={formData}
                    />
                </section>}
            </div>
           
        </div>
    )
}