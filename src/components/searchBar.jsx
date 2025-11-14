import React from 'react'

export default function Search(prop){
   
    return(
        <div className='srchSpc'>
            <div className='searchbar'>
                <input
                name="title"
                placeholder="title"
                onChange={prop.writeSearch}
                className="search"
                value={prop.content.title} 
                />
                <input
                name="location"
                onChange={prop.writeSearch}
                placeholder="location" 
                className="search"
                value={prop.content.location} 
                />
                <button onClick={prop.filter}>
                  <img src="/src/images/search.png" alt="search" className='searchImg' />
                </button>
                <button>
                    X
                </button>
            </div>
        </div>
    )
}