import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from 'next/link';
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import Results from "../components/Results";
import { setWatchlist } from "../redux/list";
import { fetchWatchList } from "../api";
import getUser from '../hooks/getUser';

export default function Watchlist() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const results = useSelector(state => state.list.watchlist);
  const user = getUser();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (user) {
        const response = await fetchWatchList(user);
        dispatch(setWatchlist(response));
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  return (
    <div>
      <Header />

      {/* Nav */}
      <NavBar />

      <h1 className="text-center mt-10 font-bold text-2xl lg:text-3xl">
        Watchlist
      </h1>

      {loading && <div className="loader">Loading...</div>}

      {/* Results */}
      {!loading && user && <Results results={results} />}

      {!loading && !user && (
        <div className="text-center font-bold text-xl lg:text-2xl">
          Please
          <span className="text-link hover:pointer">
            <Link href="/login"> sign in </Link>
          </span>
          to see your watchlist.
        </div>
      )}
    </div>
  );
}
