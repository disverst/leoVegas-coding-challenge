import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, createSearchParams, useSearchParams, useNavigate } from "react-router-dom"
import 'reactjs-popup/dist/index.css'
import { fetchMovies } from './data/moviesSlice'
import { ENDPOINT_SEARCH, ENDPOINT_DISCOVER, ENDPOINT, API_KEY } from './constants'
import Header from './components/Header'
import Modal from './components/Modal';
import Movies from './components/Movies'
import Starred from './components/Starred'
import WatchLater from './components/WatchLater'
import './app.scss'

const App = () => {

  const state = useSelector((state) => state)
  const { movies } = state  
  const dispatch = useDispatch()
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('search')
  const [videoKey, setVideoKey] = useState(null)
  const [isOpen, setOpen] = useState(false)
  const navigate = useNavigate()
  
  const closeModal = () => setOpen(false)

  const getSearchResults = (query) => {
    if (query !== '') {
      dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=`+query))
      setSearchParams(createSearchParams({ search: query }))
    } else {
      dispatch(fetchMovies(ENDPOINT_DISCOVER))
      setSearchParams()
    }
  }

  const searchMovies = (query) => {
    navigate('/')
    getSearchResults(query)
  }

  useEffect(() => {
  const getMovies = async () => {
    const fetchMoviesQuery = searchQuery
      ? `${ENDPOINT_SEARCH}&query=${searchQuery}&page=${currentPage}`
      : `${ENDPOINT_DISCOVER}&page=${currentPage}`;

    dispatch(fetchMovies(fetchMoviesQuery));
  };

  getMovies();
}, [searchQuery, currentPage, dispatch]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  const viewTrailer = (movie) => {
    getMovie(movie.id)
    if (!videoKey) setOpen(true)
    setOpen(true)
  }

  const getMovie = async (id) => {
    const URL = `${ENDPOINT}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`

    setVideoKey(null)
    const videoData = await fetch(URL)
      .then((response) => response.json())

    if (videoData.videos && videoData.videos.results.length) {
      const trailer = videoData.videos.results.find(vid => vid.type === 'Trailer')
      setVideoKey(trailer ? trailer.key : videoData.videos.results[0].key)
    }
  }

  return (
    <div className="App">
      <Header searchMovies={searchMovies} searchParams={searchParams} setSearchParams={setSearchParams} />

      <div className="container">
        <Modal isOpen={isOpen} closeModal={closeModal} videoKey={videoKey} />
        <Routes>
          <Route path="/" element={<Movies movies={movies} viewTrailer={viewTrailer} />} />
          <Route path="/starred" element={<Starred viewTrailer={viewTrailer} />} />
          <Route path="/watch-later" element={<WatchLater viewTrailer={viewTrailer} />} />
          <Route path="*" element={<h1 className="not-found">Page Not Found</h1>} />
        </Routes>
      </div>
    </div>
  )
}

export default App
