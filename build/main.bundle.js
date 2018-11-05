"use strict";

// import apiConfig from '../apiKeys.js';
//YOYO903
// mapboxgl.accessToken = process.env.mb;
mapboxgl.accessToken = "pk.eyJ1IjoiYmVubWF0aGVzb24iLCJhIjoiY2lmZDhyZXVxNTI5eHNtbHgyOTYwbHJtMyJ9.Ch8JQXvunpUrv6tGpeJMCA";
var popup = new mapboxgl.Popup({
  closeButton: true,
  closeOnClick: true // className: "popBox",
  // anchor: "bottom",
  // offset: 10

});
var alaskaPre = "data/AKsimplified.geojson";
var resData = "data/govgenSpread.json";
var map1 = new mapboxgl.Map({
  container: "map1",
  // style: "mapbox://styles/mapbox/dark-v9",
  // style: "mapbox://styles/mapbox/satellite-v9",
  // style: "mapbox://styles/mapbox/light-v9",
  style: "mapbox://styles/benmatheson/cjo060m9v05hx2rp2yd4d3yiw",
  // style: "mapbox://styles/mapbox/basic-v9",
  pitch: 0,
  transition: {
    duration: 100,
    delay: 0
  },
  // style: 'mapbox://styles/benmatheson/cjh2yaf301jjm2sru7r1uz7n7',
  center: [-152, 64.4],
  minzoom: 6,
  zoom: 3.2,
  maxzoom: 12
});
map1.scrollZoom.disable(); // map1.touchZoomRotate.disable();

map1.addControl(new mapboxgl.NavigationControl());
map1.on("load", function () {
  var res = fetch(resData).then(function (d) {
    return d.json();
  });
  var geo = fetch(alaskaPre).then(function (d) {
    return d.json();
  });
  Promise.all([res, geo]).then(function (values) {
    // console.log('values')
    // console.log(values)
    var resData = values[0];
    var geoData = values[1];
    geoData.features.forEach(function (item) {
      var results = resData.filter(function (d) {
        return d.DISTRICT == item.properties.DISTRICT;
      }); // console.log("results")
      // console.log(results)

      for (var key in results[0]) {
        item.properties[key] = results[0][key];
      } // item.properties.voteResults = results;

    }); //forEach function
    // console.log(geoData)

    map1.addSource("alaskaPre", {
      type: "geojson",
      // data: 'https://rawgit.com/benmatheson/2011_test/master/ras_ak_red.geojson'
      data: geoData,
      buffer: 30,
      'generateId': true // this ensure that all features have unique ids

    }); //add source

    map1.addLayer({
      id: "ct",
      type: "fill",
      source: "alaskaPre",
      paint: {
        "fill-opacity": .99,
        "fill-color": ["case", ["==", ["get", "winner"], "walker"], ["interpolate", ["linear"], ["get", "walkerPercent"], .33, "#fffeb6", 1, "#fcfc1d"], ["case", ["==", ["get", "winner"], "toien"], ["interpolate", ["linear"], ["get", "toienPercent"], .33, "whitesmoke", 1, "purple"], ["case", ["==", ["get", "winner"], "dunleavy"], ["interpolate", ["linear"], ["get", "dunleavyPercent"], .33, "#f0b8b2", 1, "#b2182b"], ["case", ["==", ["get", "winner"], "begich"], ["interpolate", ["linear"], ["get", "begichPercent"], .33, "#bdc9e3", 1, "#2166ac"], "white"]]]] // "fill-outline-color": [
        //             'case', ['boolean', ['feature-state', 'hover'], false],
        //             '#333',
        //             'rgba(0,0,0,.01)'
        //           ]
        //paint

      }
    }, "road-primary"); //add layer
  }); //promiseall

  var hoveredStateId = null;
  map1.on('mousemove', 'ct', function (e) {
    // Change the cursor style as a UI indicator.
    map1.getCanvas().style.cursor = 'pointer';
    console.log("e.features");
    console.log(e.features); // map1.setPaintProperty("ct", 'line-width', 1);

    var preName = e.features[0].properties["precinctName"];
    var walker = e.features[0].properties["Walker/Mallott"];
    var dunleavy = e.features[0].properties["Dunleavy/Meyer"];
    var begich = e.features[0].properties["Begich/Call"];
    var begichPercent = e.features[0].properties["begichPercent"];
    var dunleavyPercent = e.features[0].properties["dunleavyPercent"];
    var walkerPercent = e.features[0].properties["walkerPercent"];
    console.log(walker);
    var popTable = "\n<p class=\"popPre\">" + preName + "</p>\n\n\n\n\n\n<table width=\"100%\">\n<tr>\n<th class=\"thead\">Candidate</th>\n<th class=\"thead\">Votes</th> \n<th class=\"thead\">Pct.</th>\n</tr>\n\n\n<tr>\n<td><span class=\"popName\">Mark Begich</span> </td>\n<td><span class=\"popValue\"> " + begich.toLocaleString() + "  </span></td>\n<td><span class=\"popPercent\">" + (begichPercent ? (begichPercent * 100).toFixed(1) : 0) + "%</span> </td>\n\n</tr>\n\n<tr>\n<td><span class=\"popName\">Mike Dunleavy </span> </td>\n<td><span class=\"popValue\"> " + dunleavy.toLocaleString() + "  </span></td>\n<td><span class=\"popPercent\">" + (dunleavyPercent ? (dunleavyPercent * 100).toFixed(1) : 0) + "%</span> </td>\n\n</tr>\n<tr>\n<td><span class=\"popName\">Bill Walker </span> </td>\n<td><span class=\"popValue\"> " + walker.toLocaleString() + "  </span></td>\n<td><span class=\"popPercent\">" + (walkerPercent ? (walkerPercent * 100).toFixed(1) : 0) + "%</span> </td>\n\n</tr>\n\n\n</table>";
    popup.setLngLat(e.lngLat).setHTML(popTable).addTo(map1);
    map1.getCanvas().style.cursor = 'pointer'; //HOVER  
    //       if (e.features.length > 0) {
    //         if (hoveredStateId) {
    //           // set the hover attribute to false with feature state
    //           map1.setFeatureState({
    //             source: 'alaskaPre',
    //             id: hoveredStateId
    //           }, {
    //             hover: false
    //           });
    //         }
    //         hoveredStateId = e.features[0].id;
    //         console.log("HOVEREDSTEATE ID")
    //         console.log(hoveredStateId)
    // console.log(map1)
    //         // set the hover attribute to true with feature state
    //         map1.setFeatureState({
    //           source: 'alaskaPre',
    //           id: hoveredStateId
    //         }, {
    //           hover: true
    //         });
    //       }
  });
  map1.on('mouseout', 'ct', function (e) {
    popup.remove();
  }); //////for the mobile
  // map1.on('click', 'ct', function(e) {
  //     // Change the cursor style as a UI indicator.
  // e.preventDefault();
  //     console.log('CLICKING')
  //     console.log(e.lngLat)
  //     map1.getCanvas().style.cursor = 'pointer';
  // console.log('e.features[0]')
  //     console.log(e.features[0])
  //     var coordinates = e.features[0].geometry.coordinates[0][0];
  //     console.log(coordinates)
  // var preName =  e.features[0].properties["precinctName"];
  //   var walker =   e.features[0].properties["Walker/Mallott"];
  //   var dunleavy =   e.features[0].properties["Dunleavy/Meyer"];
  //   var begich =   e.features[0].properties["Begich/Call"];
  //   var begichPercent = e.features[0].properties["begichPercent"]
  //   var dunleavyPercent = e.features[0].properties["dunleavyPercent"]
  //   var walkerPercent = e.features[0].properties["walkerPercent"]
  //   console.log(walker)
  // const popTable =  `
  // <table width="100%">
  // <tr class="popPre"><td>${preName}</td></tr>
  // <tr>
  // <th class="thead">Candidate</th>
  // <th class="thead">Votes</th> 
  // <th class="thead">Pct.</th>
  // </tr>
  // <tr>
  // <td><span class="popName">Mark Begich </span> </td>
  // <td><span class="popValue"> ${begich.toLocaleString()}  </span></td>
  // <td><span class="popPercent">${(begichPercent*100).toFixed(1)}%</span> </td>
  // </tr>
  // <tr>
  // <td><span class="popName">Mike Dunleavy </span> </td>
  // <td><span class="popValue"> ${dunleavy.toLocaleString()}  </span></td>
  // <td><span class="popPercent">${(dunleavyPercent*100).toFixed(1)}%</span> </td>
  // </tr>
  // <tr>
  // <td><span class="popName">Bill Walker </span> </td>
  // <td><span class="popValue"> ${walker.toLocaleString()}  </span></td>
  // <td><span class="popPercent">${(walkerPercent*100).toFixed(1)}%</span> </td>
  // </tr>
  // </table>`
  // console.log('PUPUPS')
  // console.log(popup)
  //   popup.setLngLat(e.lngLat)
  //   .setHTML(popTable)
  //   .addTo(map1);
  // })
}); //onload
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
