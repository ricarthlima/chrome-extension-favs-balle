var btnAddFav = document.getElementById("btnAddFav");
btnAddFav.addEventListener("click", addNewFav);

var titleCurrent = "";
var urlCurrent = "";
var urlIconCurrent = "";

var listShowFavs = [];

window.onload = function (){
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        titleCurrent = tabs[0].title;
        urlCurrent = tabs[0].url;
        urlIconCurrent = tabs[0].favIconUrl;
    });

    getAllFavs();
}

function addNewFav(){
    var dict = {
        "title": titleCurrent,
        "url": urlCurrent,
        "favUrl": urlIconCurrent
    };

    var newJson = JSON.stringify(dict);
    
    chrome.storage.sync.get("STORAGE_KEY", function(result){
        if (result["STORAGE_KEY"] != undefined){
            newJson = result["STORAGE_KEY"] + "\n" + newJson;
        }

        chrome.storage.sync.set({"STORAGE_KEY": newJson}, function(){
            console.log("Salvo com sucesso!");
            getAllFavs();
        });
    });
}

function getAllFavs(){
    listShowFavs = [];
    chrome.storage.sync.get("STORAGE_KEY", function(result){
        var listFavs = result["STORAGE_KEY"].split("\n");

        for(var i = 0; i < listFavs.length; i++){
            listShowFavs.push(JSON.parse(listFavs[i]));
        }

        populatePage();
    });
}

function populatePage(){
    var colContent = document.getElementById("col-content");
    colContent.innerHTML = "";

    for(var i = 0; i < listShowFavs.length; i++){
        var linkDiv = document.createElement("DIV");
        linkDiv.id = "fav" + i.toString();

        linkDiv.classList.add("row");
        linkDiv.classList.add("link-all");

        linkDiv.innerHTML = 
            '<div class = "link-header col-2">' +
            '<img src = "' + listShowFavs[i]["favUrl"] + '" class = "sm-img">'+
            '</div>'+
            '<div class = "link-body col-10">'+
            '<div class = "row flex-wrap align-items-center">'+
            '<div class = "link-title col-10">'+
            listShowFavs[i]["title"] +
            '</div>' +
            '<div class = "col-2">' +
            '<a href="'+ listShowFavs[i]["url"] +'" target = "_blank" class = "btn btn-link">' +
            '<img src = "assets/link.png" class = "sm-img">'+
            '</a>'+                               
            '</div>'+
            '</div>'+
            '</div>'
        ;

        colContent.appendChild(linkDiv);
    }
}