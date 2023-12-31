import React, { useEffect, useState } from "react";
import { cloudinary, preSearchCloudinary } from "../constants/config";
import { Link } from "react-router-dom";

const Search = () => {
  const [searchValue, setSearchValue] = useState("");
  const [preSearchItems, setPreSearchItems] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [debounceTimeout, setDebounceTimeOut] = useState(0);

  useEffect(() => {
    fetchPreSearch();
  }, []);

  const debounceSearch = (event, debounceTimeout) => {
    const val = event.target.value;
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    const Timeout = setTimeout(() => {
      fetchResults(val);
    }, 500);
    setDebounceTimeOut(Timeout);
  };

  async function fetchPreSearch() {
    try {
      const response = await fetch(
        "https://www.swiggy.com/dapi/landing/PRE_SEARCH?lat=17.385044&lng=78.486671"
      );
      const data = await response.json();
      setPreSearchItems(
        data?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle?.info
      );
      console.log(
        ">>> info data",
        data?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle?.info
      );
    } catch (error) {
      console.log(error?.message);
      return null;
    }
  }

  async function fetchResults(value) {
    try {
      const response = await fetch(
        `https://www.swiggy.com/dapi/restaurants/search/suggest?lat=17.385044&lng=78.486671&str=${value}&trackingId=undefined`
      );
      const data = await response.json();
      console.log(data?.data?.suggestions);
      setSuggestions(data?.data?.suggestions);
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='h-full grid grid-cols-1 w-3/4 mt-4 gap-y-3 place-content-start'>
        <div className='flex w-full mt-10 box-border'>
          <input
            className='rounded-l-full p-6 shadow-lg outline-orange-500 w-full h-16 font-medium text-lg'
            name='Search'
            value={searchValue}
            placeholder='Search Restaurants and Food'
            id='Search'
            onChange={(e) => {
              setSearchValue(e.target.value);
              debounceSearch(e, debounceTimeout);
            }}></input>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-10 h-16 bg-white rounded-r-full shadow-lg'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
            />
          </svg>
        </div>
        <div className='mt-5'>
          <h2 className='font-bold text-2xl pl-2 h-10'>Popular Cuisines</h2>
        </div>
        <div className='mt-5 flex w-full h-40 box-border'>
          {preSearchItems &&
            preSearchItems.map((item, index) => {
              if (index !== 7) {
                return (
                  <div
                    key={item.id}
                    className='overflow-auto'
                    onClick={() => {
                      setSearchValue(item.entityId.split("=")[1]);
                      fetchResults(item.entityId.split("=")[1]);
                    }}>
                    <img
                      className='object-fit cursor-pointer h-40 w-36'
                      src={preSearchCloudinary + item?.imageId}
                      alt='notfound'></img>
                  </div>
                );
              }
            })}
        </div>
        {suggestions &&
          suggestions.map((item, index) => {
            return (
              <Link
                to={
                  "/results?query=" +
                  item.text.replace(" ", "+") +
                  "&type=" +
                  item.type
                }
                className='flex w-full h-24 items-center gap-3 hover:bg-slate-100'
                key={index}>
                <img
                  className='h-20 w-20 pl-2'
                  src={cloudinary + item.cloudinaryId}
                  alt='notfound'></img>
                <div className='text-slate-800 font-medium'>
                  <p>{item.text}</p>
                  <p>{item.type}</p>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default Search;
