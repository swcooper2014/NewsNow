$(document).ready(function(){


var config = {
  apiKey: "AIzaSyCEd4RSIw_LG9szIaL90oihqIB0rZinJMo",
  authDomain: "news-now-21207.firebaseapp.com",
  databaseURL: "https://news-now-21207.firebaseio.com",
  projectId: "news-now-21207",
  storageBucket: "",
  messagingSenderId: "766554358758"
};

firebase.initializeApp(config);

var database = firebase.database().ref("news-articles");

//We are receiving headlines from Google News API, and 10 news headlines are showing on our app dynamically. 
//News headlines are changing every few hours. 

var queryUrl = "https://newsapi.org/v2/top-headlines?country=us&pageSize=10&apiKey=f20969c09d7746be9cf73c7eee8744ad"

//AJAX Call for live headlines.
$.ajax({
  url: queryUrl,
  method:"GET"
}).done(function(response){
  var newsHeadlines = response.articles
  
  for( var i = 0; i < newsHeadlines.length; i++) {
    var newsTitle = newsHeadlines[i].title;
    var newsUrl = newsHeadlines[i].url;
      
    console.log(newsTitle);

    var headline = $("<li>");
    var link = $("<a>").attr("href", newsUrl).attr("target", "_blank").text(newsTitle);
    headline.append(link);

    $("#top5").append(headline);

  }
});

//To search for live channels in youtube database
$("#search-button").click(function(event){

  event.preventDefault();

  $("#video").empty();
  

  var searchInput = $(".form-control").val().trim(); 

  var queryUrl = "https://www.googleapis.com/youtube/v3/search?part=snippet&eventType=live&maxResults=1&order=relevance&q=" + searchInput + "&type=video&videoSyndicated=true&key=AIzaSyA0FF9mZcak8ZymkT0BmyY4kJJxKr-KfC0"

  console.log(searchInput);

  // AJAX call from youtube for live tv.
  $.ajax({
    url: queryUrl,
    method:"GET"
  }).done(function(response){
    

    var showVideo = "https://www.youtube.com/embed/" + response.items[0].id.videoId;
    console.log(showVideo);


    var videoDiv = $("<iframe src='" + showVideo + "' frameborder='0' scrolling='no' allow='encrypted-media' width='100%' height='100%' id='videoframe'></iframe>");

    $("#video").append(videoDiv);
    
  });

});

//Search button for searching a specific news or an article.
$("#search-news-button").click(function(event){

  event.preventDefault();
  $(".table > tbody").empty();

  //We don't let the user enter an empty string to search by implementing if/else statement. 
  if ($("#search-article").val() === ""){

      return false;

  }else{
      
  //Grabbing the value inside the search box.
  var searchArticle = $("#search-article").val().trim();

  //This url is the same as global url, however this url is inside this function, it will only work in this function.
  var queryUrl = "https://newsapi.org/v2/everything?q=" + searchArticle + "&language=en&pageSize=10&sortBy=relevancy&apiKey=f20969c09d7746be9cf73c7eee8744ad"
  
  console.log(queryUrl);
  

  //AJAX call to get data from googlenews api.

  $.ajax({
    url: queryUrl,
    method:"GET"
    }).done(function(response){

      console.log(response);
      
      var articleSearch = response.articles;
      //we have to create a loop to receive so that we can get 5 articles about our search.
      for (var i = 0; i < articleSearch.length; i++){

        var newsSource = articleSearch[i].source.name;
        var newsArticles = articleSearch[i].title;
        var newsDate = articleSearch[i].publishedAt;
        var newsUrl = articleSearch[i].url;
        
        console.log(newsSource, newsArticles, newsDate, newsUrl);
        // We are pushing results of our search to firebase so that we can keep track of search. 
        database.push({
          newsSource:newsSource,
          newsArticles:newsArticles,
          newsDate:newsDate,
          newsUrl:newsUrl
        });

      }
    
    });

  };

});
  
//pulling the data from our firebase.
database.on("child_added", function(snapshot){

    var sv = snapshot.val();

    console.log(sv);


    var row = $("<tr>");
    var articlesUrl = sv.newsUrl
    var articles = [sv.newsSource,sv.newsArticles,sv.newsDate];

    for (var i = 0; i < articles.length; i++){

      
        row.append("<td>" + articles[i] + "</td>");

        $(".table > tbody").append(row);

     }
       
    //In order to provide a link for searched articles under related links. 
     var a = $("<a>").attr("href", articlesUrl).attr("target", "_blank").text("Click Me to See the Article!");

     row.append(a)
     $(".table").append(row);

});

//Cleaning the search results from table, also from firebase.
$("#clear-results").click(function(){

  $(".table > tbody").empty();
  database.remove();
  return false;

});

//Channel buttons for live channel via YouTube.
$(".channel-button").on("click", function(e){
  console.log("Clicked");

  e.preventDefault();
  $("#video").empty();

  var value = $(this).attr('data-value');

  var queryUrl = "https://www.googleapis.com/youtube/v3/search?part=snippet&eventType=live&maxResults=1&order=relevance&q=" + value + "&type=video&videoSyndicated=true&key=AIzaSyA0FF9mZcak8ZymkT0BmyY4kJJxKr-KfC0"

  $.ajax({
    url: queryUrl,
    method:"GET"
  }).done(function(response){
    
    console.log(response);
    var linkChannel = "https://www.youtube.com/embed/" + response.items[0].id.videoId;
    console.log(linkChannel);


    var iframeEl = $("<iframe src='" + linkChannel + "' frameborder='0' scrolling='no' allow='encrypted-media' width='100%' height='100%' id='videoframe'></iframe>");

    $("#video").append(iframeEl);
    
  });

});
     
//Weather information by using zip code. 
$("#weather-button").click(function(){

  event.preventDefault();
  $(".weather-control").empty();

  var zipCode = $(".weather-control").val().trim();
  
  var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?zip=" +  zipCode + "&units=imperial&appid=96d9998aea65bf4a2c82d20b6f51afde";

  var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?zip=" +  zipCode + "&units=imperial&appid=96d9998aea65bf4a2c82d20b6f51afde";


  $.ajax({
    url:weatherUrl,
    method:"GET"
  }).done(function(response){
    
    console.log(response);

    var temp = response.main.temp;
    var weatherIcon = response.weather[0].icon;
    console.log(temp,weatherIcon);
    tempDiv = $("<p>").text(temp + " F");
    weather = $("<img>").attr("src", "assets/images/" + weatherIcon + ".png");       

    $(".weather-icon").append(weather);
    $(".weather-icon").append(tempDiv);
       
  });
});

});
