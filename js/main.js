mapboxgl.accessToken =
	"pk.eyJ1IjoiYmVubWF0aGVzb24iLCJhIjoiY2lmZDhyZXVxNTI5eHNtbHgyOTYwbHJtMyJ9.Ch8JQXvunpUrv6tGpeJMCA";


    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: true
    });


    var alaskaPre = "data/alaska_precinct_gj_2.json";
    var resData = "data/govgenSpread.json";


    var map1 = new mapboxgl.Map({
        container: "map1",
        // style: "mapbox://styles/mapbox/dark-v9",
        // style: "mapbox://styles/mapbox/satellite-v9",
        // style: "mapbox://styles/mapbox/light-v9",
        style:  "mapbox://styles/benmatheson/cjo060m9v05hx2rp2yd4d3yiw",       // style: "mapbox://styles/mapbox/basic-v9",

        pitch: 0,
    
        transition: {
            duration: 100,
            delay: 0
        },
        // style: 'mapbox://styles/benmatheson/cjh2yaf301jjm2sru7r1uz7n7',
    
        center: [-150, 65],
        minzoom: 6,
        zoom: 3.6, 
        maxzoom: 12
    });

    map1.on("load", function() {

        var res = fetch(resData).then(d=>d.json());
       var geo = fetch(alaskaPre).then(d=>d.json());
	

Promise.all([res, geo]).then(function(values){

// console.log('values')
// console.log(values)

var resData = values[0]
var geoData = values[1]

geoData.features.forEach(item=>{

    var results = resData.filter(d=>d.DISTRICT == item.properties.DISTRICT)
    // console.log("results")
    // console.log(results)

    for (var key in results[0]) {
    
            item.properties[key] = results[0][key]

    
    }



    // item.properties.voteResults = results;

})//forEach function

// console.log(geoData)

  map1.addSource("alaskaPre", {
            type: "geojson",
            // data: 'https://rawgit.com/benmatheson/2011_test/master/ras_ak_red.geojson'
            data: geoData,
            buffer:30
        });  //add source


        map1.addLayer({
            id: "ct",
            type: "fill",
            source: "alaskaPre",
            paint: {
       "fill-opacity": .99,
       "fill-color": [
    
      
      
        "interpolate",
        ["linear"],
    ["get", "rMargin"],
    //   0.001, "blue",
          //   

      -.3,  "#2166ac",
      0,   "#f8f6e9",
       .3, "#b2182b"


      ]
            } //paint
        }, "road-primary"); //add layer
    }) //promiseall





    map1.on('mousemove', 'ct', function(e) {
        // Change the cursor style as a UI indicator.
        map1.getCanvas().style.cursor = 'pointer';
console.log('e.features[0]')
        console.log(e.features[0])

        var coordinates = e.features[0].geometry.coordinates[0][0];
        console.log(coordinates)


var preName =  e.features[0].properties["precinctName"];

      var walker =   e.features[0].properties["Walker/Mallott"];
      var dunleavy =   e.features[0].properties["Dunleavy/Meyer"];
      var begich =   e.features[0].properties["Begich/Call"];

      var begichPercent = e.features[0].properties["begichPercent"]
      var dunleavyPercent = e.features[0].properties["dunleavyPercent"]
      var walkerPercent = e.features[0].properties["walkerPercent"]


      console.log(walker)


const popTable =  `




<table width="100%">
<tr class="popPre"><td>${preName}</td></tr>
<tr>
<th class="thead">Candidate</th>
<th class="thead">Votes</th> 
<th class="thead">Pct.</th>
</tr>


<tr>
<td><span class="popName">Mark Begich </span> </td>
<td><span class="popValue"> ${begich.toLocaleString()}  </span></td>
<td><span class="popPercent">${begichPercent.toFixed(1)}%</span> </td>

</tr>

<tr>
<td><span class="popName">Mike Dunleavy </span> </td>
<td><span class="popValue"> ${dunleavy.toLocaleString()}  </span></td>
<td><span class="popPercent">${dunleavyPercent.toFixed(1)}%</span> </td>

</tr>
<tr>
<td><span class="popName">Bill Walker </span> </td>
<td><span class="popValue"> ${walker.toLocaleString()}  </span></td>
<td><span class="popPercent">${walkerPercent.toFixed(1)}%</span> </td>

</tr>


</table>`



      popup.setLngLat(e.lngLat)
      .setHTML(popTable)
      .addTo(map1);


    })


    map1.on('mouseout', 'ct', function(e) {
       popup.remove();

    })












//////for the mobile




map1.on('click', 'ct', function(e) {
    // Change the cursor style as a UI indicator.

    console.log('CLICKING')
    console.log(e.lngLat)

    map1.getCanvas().style.cursor = 'pointer';
console.log('e.features[0]')
    console.log(e.features[0])

    var coordinates = e.features[0].geometry.coordinates[0][0];
    console.log(coordinates)


var preName =  e.features[0].properties["precinctName"];

  var walker =   e.features[0].properties["Walker/Mallott"];
  var dunleavy =   e.features[0].properties["Dunleavy/Meyer"];
  var begich =   e.features[0].properties["Begich/Call"];

  var begichPercent = e.features[0].properties["begichPercent"]
  var dunleavyPercent = e.features[0].properties["dunleavyPercent"]
  var walkerPercent = e.features[0].properties["walkerPercent"]


  console.log(walker)


const popTable =  `




<table width="100%">
<tr class="popPre"><td>${preName}</td></tr>
<tr>
<th class="thead">Candidate</th>
<th class="thead">Votes</th> 
<th class="thead">Pct.</th>
</tr>


<tr>
<td><span class="popName">Mark Begich </span> </td>
<td><span class="popValue"> ${begich.toLocaleString()}  </span></td>
<td><span class="popPercent">${begichPercent.toFixed(1)}%</span> </td>

</tr>

<tr>
<td><span class="popName">Mike Dunleavy </span> </td>
<td><span class="popValue"> ${dunleavy.toLocaleString()}  </span></td>
<td><span class="popPercent">${dunleavyPercent.toFixed(1)}%</span> </td>

</tr>
<tr>
<td><span class="popName">Bill Walker </span> </td>
<td><span class="popValue"> ${walker.toLocaleString()}  </span></td>
<td><span class="popPercent">${walkerPercent.toFixed(1)}%</span> </td>

</tr>


</table>`

console.log('PUPUPS')
console.log(popup)



  popup.setLngLat(e.lngLat)
  .setHTML(popTable)
  .addTo(map1);


})
















    }) //onload







    




    // road-primary


//python -m SimpleHTTPServer 1337

    
        // var expression = ["match", ["get", "DISTRICT"]];

        // // Calculate color for each state based on the unemployment rate
        // data.forEach(function(row) {

        //     var r = row.rMargin;
        //     console.log(r)
        //     // expression.push(row["DISTRICT"], r);
        //     console.log(expression)
        // });



// })