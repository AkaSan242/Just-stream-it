var moviePath = 'http://localhost:8000/api/v1/titles/'
/*the url of all movies from API*/
var moviesUrls = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";

/*the url tus to get all categories*/
var categoriesUrls = "http://localhost:8000/api/v1/genres/"

/* movies urls for each category sort by imdb score */
var actionsMoviesUrls = "http://localhost:8000/api/v1/titles/?genre_contains=action&sort_by=-imdb_score";
var comedyMoviesUrls = "http://localhost:8000/api/v1/titles/?genre_contains=comedy&sort_by=-imdb_score";
var animationMoviesUrls = "http://localhost:8000/api/v1/titles/?genre_contains=animation&sort_by=-imdb_score";

class Movie {
    constructor(image_url, title, genre, date_published,
        rated, imdb_score, directors, actors, duration,
        countries, box_office_score, resume){

            this.image_url = image_url;
            this.title = title;
            this.genre = genre;
            this.date_published = date_published;
            this.rated = rated;
            this.imdb_score = imdb_score;
            this.directors = directors;
            this.actors = actors;
            this.duration = duration;
            this.countries = countries;
            this.box_office_score = box_office_score;
            this.resume = resume;

        }

};

   // Get the modal
var modal = document.getElementById("myModal");
  
   // Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
   
   // When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}
   
   // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
        modal.style.display = "none";
       }
   }

async function getMovies(url){
    var response = await fetch(url);
    var responseJson = await response.json();
    return responseJson;
};

/* get the best movie on API*/
getMovies(moviesUrls).then(function(response){
        let bestMovie = response.results[0];

        getMovies(moviePath + bestMovie.id).then(function(response){
            let title = document.createElement('p');
            title.append(response.title);
            document.querySelector('div.title').append(title);
            let resume = document.createElement('p');
            resume.append(response.description);
            document.querySelector('div.resume').append(resume);
            getInfos(bestMovie, document.querySelector('section.best_movie'));

        })

});

/*Use to get all categories available from API*/
async function getCategories(url){
    let response = await getMovies(url)
    let categories = [];
    
    for (let i = 0; i < response.results.length; i++)
        categories.push(response.results[i].name);

    let categoriesDeep = [];
    if (response.next != null)
        categoriesDeep = await getCategories(response.next);

    categories = categories.concat(categoriesDeep);
    return categories;
}

/*Use to get a list of all categries wehn click on categories button*/ 

getCategories(categoriesUrls).then(function(response){

    console.log(response);

    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");
    var c = document.getElementById("categories");

    var category = ""
    for (categorie of response){
        category += categorie + "<br>";
    }
    c.onclick = function(){
        modal.style.display = "block";
        modalImg.src = "images/sharingan.gif";
        captionText.innerHTML = category;
        captionText.style.display = "flex";
    };
        
    })


/*get the seven best movies from a category with url*/ 
function getSevenBestMovies(url, doc){
    getMovies(url).then(function(response){
    let movies = [];
    let i = 0;
    let max = 7;

    while (i < response.results.length){
        movies.push(response.results[i]);
        i++;
    }

    if (movies.length < max){
        max = max - movies.length;
        getMovies(response.next).then(function(response){
            i = 0;
            while (i < max){
                movies.push(response.results[i]);
                i++
        };

    for (movie of movies){

        getInfos(movie, doc)

            }
        })
        }
    })
};

/*Get all information of a movie by using is Id*/
function getInfos(movie, doc){
    getMovies(moviePath + movie.id).then(function(response){

        var movie = new Movie(
            response.image_url, response.title,
            response.genres, response.date_published, response.rated,
            response.imdb_score, response.directors, response.actors,
            response.duration, response.countries,
             response.worldwilde_gross_income, response.description
             );

        let newImage = document.createElement('img');
        newImage.src = movie.image_url;
        newImage.title = movie.title;

        var modalImg = document.getElementById("img01");
        var captionText = document.getElementById("caption");

        newImage.onclick = function(){
            modal.style.display = "block";
            modalImg.src = newImage.src;
            captionText.innerHTML = "Film: " + movie.title + "<br>" + "Genre: " + movie.genre + "<br>" +
            "Date de sortie: " +  movie.date_published + "<br>" + "Rated: " +  movie.rated + "<br>" +
            "Imdb score: " + movie.imdb_score + "<br>" + "Réalisateurs: " + movie.directors + "<br>" +
            "Acteurs: " + movie.actors + "<br>" + "Durée: " + movie.duration + "min" + "<br>" +
            "Pays: " + movie.countries + "<br>" + "Entrées Box office: " + movie.box_office_score + "<br>" +
            "Résumé: " + movie.resume; 
            
        }
        doc.append(newImage);
    })
};


getSevenBestMovies(moviesUrls, document.querySelector('div.best-rated-image'));
getSevenBestMovies(animationMoviesUrls, document.querySelector('div.animation-image'));
getSevenBestMovies(actionsMoviesUrls, document.querySelector('div.action-image'));
getSevenBestMovies(comedyMoviesUrls, document.querySelector('div.comedy-image'));
