import React, { useState } from 'react'
// import { useNavigate } from "react-router-dom";
import "../../App.css";

const Search = () => {

    // const [keyword, setKeyword] = useState('');
    // let navigate = useNavigate();

    // const searchHandler = (e) => {
    //     e.preventDefault()
    //     if (keyword.trim()) {
    //         navigate(`/search/${keyword}`)
    //     } else {
    //         navigate('/')
    //     }
    // }

    return (
        // <form onSubmit={searchHandler} >
        <div className='Search'>
            <div className="input-group">
                <input
                    type="text"
                    id="search_field"
                    className="form-control"
                    placeholder="Enter Product Name ..."
                    // onChange={(e) => setKeyword(e.target.value)}
                />
                <div className="input-group-append">
                    <button id="search_btn" className="btn">
                        <i className="bi bi-search" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
            </div>
        // </form>
    )
}

export default Search