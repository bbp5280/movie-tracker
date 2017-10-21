import { connect } from 'react-redux';
import React, { Component } from 'react';
import { fetchRecentMovies } from '../API/movieDatabase';
import Card from '../Card/Card';
import Slider from 'react-slick';
import PropTypes from 'prop-types';
import sliderOptions from './sliderOptions';
import {
  addRecentMovies,
  getFavorites,
  addFavorite,
  removeFavorites
} from './CardCatelogActions';
import {
  addFavoriteFetch,
  fetchFavorites,
  fetchRemoveFavorite
} from '../API/User';

class CardCatelog extends Component {

  async componentDidMount() {
    const recentMovies = await fetchRecentMovies();
    this.props.addRecentMovies(recentMovies);
    if (this.props.user.id) {
      this.getUserFavorites();
    }
  }

  findFavToRemoveFromStore(favMovie) {
    const updatedFavoriteMovies = this.props.favoriteMovies.filter((movie) => {
      return movie.movie_id !== favMovie.id;
    });
    this.props.removeFavorites(updatedFavoriteMovies);
  }

  removeFavorites = (movie) => {
    fetchRemoveFavorite(this.props.user.id, movie.id);
    this.findFavToRemoveFromStore(movie);
  }

  addFavoriteMovie = async (movie) => {
    debugger;
    const favoriteMovieForFetch = {
      movie_id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      overview: movie.overview,
      user_id: this.props.user.id
    };
    await addFavoriteFetch(favoriteMovieForFetch);
    this.props.addFavorite(movie);
  }

  async getUserFavorites() {
    const savedFavorites = await fetchFavorites(this.props.user.id);
    this.props.getFavorites(savedFavorites.data);
  }

  buildCards() {
    return this.props.recentMovies.map( (movie, index) => {
      let cardStyle='';
      let favoriteText='Add to Favorites';
      const isFavorite = this.props.favoriteMovies.find( fav => (
        fav.movie_id === movie.id
      ));
      if (isFavorite) {
        cardStyle='isFavorite';
        favoriteText='Remove from Favorites';
      }
      return (<Card key={index}
        movie={movie}
        cardStyle={cardStyle}
        favoriteText={favoriteText}
        addToFavorites={this.addFavoriteMovie}
        removeFavorites={this.removeFavorites}
        favoriteMovies={this.props.favoriteMovies}
      />
      );
    });
  }


  render() {
    return (
      <div className='CardCatelog'>
        <div className='slider'>
          <Slider {...sliderOptions}>
            {this.buildCards()}
          </Slider>
        </div>
      </div>
    );
  }
}

CardCatelog.propTypes = {
  recentMovies: PropTypes.array,
  addRecentMovies: PropTypes.func,
  user: PropTypes.object,
  getFavorites: PropTypes.func,
  favoriteMovies: PropTypes.array,
  addFavorite: PropTypes.func,
  removeFavorites: PropTypes.func
};

const mapStateToProps =  (store) => ({
  recentMovies: store.recentMovies,
  favoriteMovies: store.favoriteMovies,
  user: store.user
});

const mapDispatchToProps = (dispatch) => ({
  addRecentMovies: ( recentMovies ) => {
    dispatch(addRecentMovies(recentMovies));
  },
  getFavorites: (favoriteMovies) => { dispatch(getFavorites(favoriteMovies)); },
  addFavorite: (favMov) => { dispatch(addFavorite(favMov)); },
  removeFavorites: (favoriteMovies) => { dispatch(removeFavorites(favoriteMovies)); }
});

export default connect(mapStateToProps, mapDispatchToProps)(CardCatelog);
