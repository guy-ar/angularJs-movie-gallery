app.factory("movieSrv", function($log, $http, $q, convert) {

    function Movie(idOrObj, name, imdbId, releaseYear, movieLen, posterUrl, starsArr, director){
        // constructor may accept 2 options
        // 5 different attributes
        // or one simpleObject with all fields
        if (arguments.length > 1) {
          this.id = idOrObj;
          this.name = name;
          this.imdbId = imdbId;
          this.releasedDate = releaseYear;  
          this.length = movieLen;
          this.poster = posterUrl;
          this.starsArr = starsArr;
          this.director = director; 
        } else {
          this.id = idOrObj.id;
          this.name = idOrObj.name;
          this.imdbId = idOrObj.imdbId;
          this.releasedDate = idOrObj.releaseYear;  
          this.length = idOrObj.movieLen;
          this.poster = idOrObj.posterUrl;
          this.starsArr = idOrObj.starsArr;
          this.director = idOrObj.director;
        }
    };
  
    Movie.prototype.min2Hour = function() {
        return convert.convertMinToHours(this.length);
    } 

    /*
    // hard code population
    $scope.movies.push(new Movie('Avengers: Endgame', 'tt4154796', '2019', 181, 
            'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SY1000_CR0,0,674,1000_AL_.jpg',
            ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo'], ' Anthony Russo, Joe Russo'));
        
    $scope.movies.push(new Movie('Avengers: Infinity War', 'tt4154756', '2018', 149, 
            'https://m.media-amazon.com/images/M/MV5BMjMxNjY2MDU1OV5BMl5BanBnXkFtZTgwNzY1MTUwNTM@._V1_SY1000_CR0,0,674,1000_AL_.jpg',
            ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo'], ' Anthony Russo, Joe Russo'))
    */

    let movies = [];

    
    function getMoviesFromJson() {
        // ionitiate the data beore loading from "db"
        movies = [];
        let async = $q.defer();
         // read content from Json
        $http.get("movies.json").then(
            function (res){
                // on success
                for (let i = 0, len = res.data.length; i < len; i++) {
                    movies.push(new Movie(res.data[i]));
                }
                async.resolve(movies);
            }, function(err) {
                // on error
                $log.error(err);
                async.reject(err)
            });
        return async.promise;
    }

    // Initializing variables

    let apiKey = "?api_key=bf17da39659009eb552f15e8ebda08ad";
    let prefixUrl = "https://api.themoviedb.org/3/";

    function getMoviesFromTmdb(queryVal) {
        let async = $q.defer();
        let searchOptionActor = "search/movie";
        let searchQuery = "&query=" + queryVal;
        let fullSearchUrl = prefixUrl + searchOptionActor + apiKey + searchQuery;
        /* example for search movies
        https://api.themoviedb.org/3/search/movie?api_key=bf17da39659009eb552f15e8ebda08ad&language=en-US&query=avengers&page=1&include_adult=false
        */
    
        // example for actor: 
        /*https://api.themoviedb.org/3/search/person?api_key=53d2ee2137cf3228aefae083c8158855&query=" 
        + $scope.movieSearchText;*/

        $http.get(fullSearchUrl).then(function(res) {
            async.resolve(res.data.results);
            
        }, function(err) {
            $log.error(err);
            async.reject(err);
        })
        
        return async.promise;
    
    }


    function addMovie(idOrObj, name, imdbId, releaseYear, movieLen, posterUrl, starsArr, director) {
        let fullPosterUrl = "https://image.tmdb.org/t/p/w500" + posterUrl;
        let movie = new Movie(idOrObj, name, imdbId, releaseYear, movieLen, fullPosterUrl, starsArr, director);
        movies.push(movie);

    }

// Adding movie (getting details from TMDB)

   


    function addMovieDtlsFromApi(movieId) {
        let movieDetailsUrl = prefixUrl + "movie/" + 
        movieId + apiKey;
        let async = $q.defer();

        $http.get(movieDetailsUrl).then(function(res) {
            let tmdbMovie = {"id": res.data.id,
                            "title": res.data.title,   
                            "imdbId": res.data.imdb_id,
                            "releaesDate": res.data.release_date,
                            "length": res.data.runtime,
                            "poster": res.data.poster_path
                            };           
            async.resolve(tmdbMovie);
      }, function(err) {
          $log.error(err);
          async.reject();
      })
     

        return async.promise;
    }
    return {
        getMovies: getMoviesFromJson,
        getMoviesApi: getMoviesFromTmdb,
        addMovie: addMovie,
        getMovieDtlsApi: addMovieDtlsFromApi
    }
});