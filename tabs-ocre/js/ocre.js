
//var baseUrl = "http://shot.holycross.edu/ocre/ocre.html"
var baseUrl = "http://localhost:8000/ocre.html"
//var remoteDataUrl = "http://shot.holycross.edu/ocre/test.csv"
var remoteDataUrl = "http://localhost:8000/test.csv"
var idParam = "id"



var previewImageUrl1 = "http://www.homermultitext.org/iipsrv?OBJ=IIP,1.0&FIF=/project/homer/pyramidal/deepzoom/"
var previewImageUrl2 = ".tif&wid=200&CVT=JPEG"

var ictUrl = "http://www.homermultitext.org/wamcoins/index.html?urn="

var searchParams = new URLSearchParams(window.location.search);
var filterId = searchParams.get(idParam);

var totalResults = 0;
var showingResults = 0;

function makeImageUrl(urn){
	 var imgUrl = ictUrl + urn;
    return imgUrl;
}

function makeThumbUrl(urn){
		var imagePath = urn.split(":")[2] + "/" +  urn.split(":")[3].split(".")[0] + "/" + urn.split(":")[3].split(".")[1] + "/";
				imagePath += urn.split(":")[4];
		var imgUrl = previewImageUrl1 + imagePath + previewImageUrl2 ;
		return imgUrl;
}

$( document ).ready(function() {

	url = remoteDataUrl;

   Papa.parse(url, {
		download: true,
			delimiter: "",	// auto-detect
			newline: "",	// auto-detect
			quoteChar: '"',
			header: true,
			dynamicTyping: false,
			preview: 0,
			encoding: "",
			worker: true,
			comments: false,
			step: undefined,
			complete: function(results, file) {
				   console.log("downloaded.");
					if ( filterId ){
						var filteredResults = $.grep(results.data, function(e){ return e[idParam] === filterId ; });
						totalResults = results.data.length;
						showingResults = filteredResults.length;
						generateElements(filteredResults);
					} else {
						totalResults = results.data.length;
						showingResults = results.data.length;
						doTabulator(results.data);
					}
			},
			error: undefined,
			download: true,
			skipEmptyLines: false,
			chunk: undefined,
			fastMode: undefined,
			beforeFirstChunk: undefined,
			withCredentials: undefined
	});

});

function showInfo(total, showing){
	var infoDiv = document.createElement("div");
	$(infoDiv).addClass("infoDiv");
	var infoString = "Showing " + showing + " out of " + total + ".";
	if (total > showing){
		infoString += " <a href='" + baseUrl + "'>Show All</a>";
	}
	$(infoDiv).html(infoString);
	$("div#dataDiv").append(infoDiv);
}

function doTabulator(results){

	showInfo(totalResults, showingResults);

	//create Tabulator on DOM element with id "example-table"
	$("#bcdata-table").tabulator({
  		 movableColumns: true, //enable user movable rows
  		 persistentLayout:true, //Enable column layout persistence
	    height:"65%", // set height of table (optional)
	    fitColumns:false, //fit columns to width of table (optional)
			columns:[
				{title:"id", field:"id", variableHeight:true, sorter:"string", align:"left", sortable:true, formatter:function(cell, formatterParams){
					var value = cell.getValue();
					return "<a class='imageLink' href='" + baseUrl + "?" + idParam + "=" + value + "'>" + value + "</a>";
				}},

      	{title:"Side", field:"Side", headerFilter:true, variableHeight:true, sorter:"string", align:"left", sortable:true},
        {title:"Legend", field:"Legend", headerFilter:true, variableHeight:true, sorter:"string", align:"left", sortable:true}

			]

	});

	//load sample data into the table
	$("#bcdata-table").tabulator("setData", results);

	$("div#dataDiv").removeClass("waiting");
}

function imageLinks(urn){
	if (urn){
		var idStr = urn;
		var thumbElement = "<span id='img_" + idStr.replace(/[:.]/g,"") + "' data-urn='" + urn + "' onClick='" + "kwikImg(this)'> [Quick View] </span>";
		var imageUrl = makeImageUrl(urn);
		return "<a class='imageLink' target='_blank' href='" + imageUrl + "' >" + urn + "</a>";
	} else { return "undefined"; }
 }

function  kwikImg(myElement) {
	var imgId = myElement.id;
	//var newImg = document.createElement("img");
	var urn = $("#" + imgId).data("urn");
	var url = makeThumbUrl(urn);
	var imgSrc = "<img src='" + url + "'></img>";
	$("#" + imgId).html(imgSrc);
	$("#" + imgId).parent().css("height", "auto");
	//$("#" + imgId).parent().css("vertical-align", "middle");
}


function generateElements2(results){
	showInfo(totalResults, showingResults);
	var heads = Object.keys(results[0]);
	heads.forEach(function(h){
		var newP = document.createElement("p");
		$(newP).html(h);
		$("div#dataDiv").append(newP);
	});
	results.forEach(function(r){
		var newDiv = document.createElement("div");
		$(newDiv).addClass("recordDiv");
		var keys = Object.keys(r);
		keys.forEach(function(k) {
			var newP = document.createElement("p");
			$(newP).html(r[k]);
			$("div#dataDiv").append(newP);
		});
	});
	console.log("done parsing.");
	$("div#dataDiv").removeClass("waiting");
}

function generateElements(results){

	showInfo(totalResults, showingResults);

	results.forEach(function(r){


		var newDiv = document.createElement("div");
		$(newDiv).addClass("recordDiv");
		var keys = Object.keys(r);
		keys.forEach(function(k) {
			var fieldDiv = document.createElement("div");
			$(fieldDiv).addClass("fieldDiv");
			var fieldLabel = document.createElement("span");
			$(fieldLabel).addClass("fieldLabel");
			var fieldData = document.createElement("span");
			$(fieldData).addClass("fieldData");
			if (k == "ImageURN"){
				var urn = r[k];
				var imagePath = urn.split(":")[2] + "/" +  urn.split(":")[3].split(".")[0] + "/" + urn.split(":")[3].split(".")[1] + "/";
				imagePath += urn.split(":")[4]
				var imageElement = "<a  href='" + ictUrl + urn + "'><img class='thumbView' src='";
				imageElement += previewImageUrl1 + imagePath + previewImageUrl2 + "'/></a>";
				$(fieldLabel).html(imageElement);
			}  else {
				$(fieldLabel).text(k);
			}
         if (k == idParam ){
				var urn = r[k];
				var specLink = "<a class='imageLink' href='" + baseUrl + "?" + idParam + "=" + r[k] + "'>" + r[k] + "</a>";
				$(fieldData).html(specLink);
			} else {
				$(fieldData).text(r[k]);
			}
			$(fieldDiv).append(fieldLabel);
			$(fieldDiv).append(fieldData);
			$(newDiv).append(fieldDiv);
		});
		$("div#dataDiv").append(newDiv);
	});
	console.log("done parsing.");
	$("div#dataDiv").removeClass("waiting");
}
