import FavoriteMovieIdb from '../src/scripts/data/favorite-movie-idb';
import * as TestFactories from './helpers/testFactories';

describe('Liking A Movie', () => {
  // supaya selalu dijalankan untuk tiap tes yang kita buat
  const addLikeButtonContainer = () => {
    document.body.innerHTML = '<div id="likeButtonContainer"></div>';
  };

  beforeEach(() => {
    addLikeButtonContainer();
  });

  // untuk widget like
  it('should show the like button when the movie has not been liked before', async () => {
    await TestFactories.createLikeButtonPresenterWithMovie({ id: 1 });

    expect(document.querySelector('[aria-label="like this movie"]'))
      .toBeTruthy();
  });

  // untuk widget unlike
  it('should not show the unlike button when the movie has not been liked before', async () => {
    await TestFactories.createLikeButtonPresenterWithMovie({ id: 1 });

    expect(document.querySelector('[aria-label="unlike this movie"]'))
      .toBeFalsy();
  });

  // ketika user menekan widget dan film tersimpan di daftar film yang disukai.
  it('should be able to like the movie', async () => {
    await TestFactories.createLikeButtonPresenterWithMovie({ id: 1 });

    document.querySelector('#likeButton').dispatchEvent(new Event('click'));
    const movie = await FavoriteMovieIdb.getMovie(1);

    expect(movie).toEqual({ id: 1 });

    FavoriteMovieIdb.deleteMovie(1);
  });

  // Ternyata film sudah disukai.
  it('should not add a movie again when its already liked', async () => {
    await TestFactories.createLikeButtonPresenterWithMovie({ id: 1 });

    // Tambahkan film dengan ID 1 ke daftar film yang disukai
    await FavoriteMovieIdb.putMovie({ id: 1 });
    // Simulasikan pengguna menekan tombol suka film
    document.querySelector('#likeButton').dispatchEvent(new Event('click'));
    // tidak ada film yang ganda
    expect(await FavoriteMovieIdb.getAllMovies()).toEqual([{ id: 1 }]);

    FavoriteMovieIdb.deleteMovie(1);
  });

  it('should not add a movie when it has no id', async () => {
    await TestFactories.createLikeButtonPresenterWithMovie({});

    document.querySelector('#likeButton').dispatchEvent(new Event('click'));

    expect(await FavoriteMovieIdb.getAllMovies()).toEqual([]);
  });
});
