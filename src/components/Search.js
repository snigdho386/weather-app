import React from 'react'
import "./Search.css"


function Search({ value, data, change, submit, darkmode }) {
    return (
        <>
            <form className="search__container" onSubmit={submit}>
                <input type="text" value={value} onChange={change} placeholder="e.g. Kharagpur, India" className="search__input" style={{ color: "orangered" }} />
            </form>
        </>
    )
}

export default Search
