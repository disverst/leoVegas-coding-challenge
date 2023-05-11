import Movie from './Movie'
import '../styles/movies.scss'

const Movies = ({ movies: { movies }, viewTrailer }) => {

    return (
        <div data-testid="movies" className="movies-grid">
            {movies.map((movie, index) => {
                return (
                    <Movie 
                        movie={movie} 
                        key={`${movie.id}-${index}`}
                        viewTrailer={viewTrailer}
                    />
                )
            })}
        </div>
    )
}

export default Movies
