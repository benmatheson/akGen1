mapboxgl.accessToken = 'pk.eyJ1IjoibG9iZW5pY2hvdSIsImEiOiJjajdrb2czcDQwcHR5MnFycmhuZmo4eWwyIn0.nUf9dWGNVRnMApuhQ44VSw';
const map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/light-v9', // stylesheet location
  center: [-97, 39],
  interactive: false,
  zoom: 3
});

map.on('load', () => {

  map.addSource('counties', {
    type: 'vector',
    url: 'mapbox://lobenichou.9dvwt9lw'
  });

  map.addLayer({
    'id': 'counties-join',
    'type': 'fill',
    'source': 'counties',
    'source-layer': 'countiesAndResults',
    'paint': {
      'fill-color': [
        'case', ['>', ['to-number', ['get', 'votes_dem']],
          ['to-number', ['get', 'votes_gop']]
        ],
        [
          'interpolate', ['linear'],
          ['*', ['to-number', ['get', 'per_point_diff']], 100],
          0, '#bad2f0',
          50, '#7697c2',
          100, '#1868d1'
        ],
        [
          'interpolate', ['linear'],
          ['*', ['to-number', ['get', 'per_point_diff']], 100],
          0, '#f2cbcb',
          50, '#dd7e75',
          100, '#be2d1e'
        ]
      ]
    }
  }, 'admin-3-4-boundaries');


  map.addLayer({
    'id': 'counties-highlight',
    'type': 'fill',
    'source': 'counties',
    'source-layer': 'countiesAndResults',
    'paint': {
      'fill-color': [
        'case', ['boolean', ['feature-state', 'highlight'], false],
        'rgb(235, 139, 52)',
        'rgba(246, 246, 246, 0)'
      ]
    }
  }, 'admin-3-4-boundaries');

  map.addLayer({
    'id': 'counties-line',
    'type': 'line',
    'source': 'counties',
    'source-layer': 'countiesAndResults',
    'paint': {
      'line-color': [
        'case', ['boolean', ['feature-state', 'hover'], false],
        'rgb(64, 64, 64)',
        'rgba(71, 71, 71, 0.2)'
      ]
    }
  }, 'waterway-label');

  let hoveredStateId = null;

  map.on('mousemove', 'counties-join', (e) => {
    map.getCanvas().style.cursor = 'pointer';
    if (e.features.length > 0) {
      if (hoveredStateId) {
        map.setFeatureState({
          source: 'counties',
          sourceLayer: 'countiesAndResults',
          id: hoveredStateId
        }, {
          hover: false
        });
      }

      hoveredStateId = e.features[0].id;

      map.setFeatureState({
        source: 'counties',
        sourceLayer: 'countiesAndResults',
        id: hoveredStateId
      }, {
        hover: true
      });
    }
  });

  let highlightedFeatures = null;

  map.on('click', 'counties-highlight', (e) => {
    // if we have highlighted features, change their highlight state to false
    if (highlightedFeatures) {
      highlightedFeatures.forEach(function(f) {
        map.setFeatureState({
          source: 'counties',
          sourceLayer: 'countiesAndResults',
          id: f.id
        }, {
          highlight: false
        });
      });
    }

    const pointDiffPlus = parseFloat(e.features[0].properties.per_point_diff) * 100 + 1;
    const pointDiffMinus = parseFloat(e.features[0].properties.per_point_diff) * 100 - 1;

    highlightedFeatures = map.querySourceFeatures('counties', {
      sourceLayer: 'countiesAndResults',
      filter: [
        'all', ['<', ['*', ['to-number', ['get', 'per_point_diff']], 100], pointDiffPlus],
        ['>', ['*', ['to-number', ['get', 'per_point_diff']], 100], pointDiffMinus]
      ]
    });



    highlightedFeatures.forEach(function(f) {
      // For each feature, update its 'highlight' state
      map.setFeatureState({
        source: 'counties',
        sourceLayer: 'countiesAndResults',
        id: f.id
      }, {
        highlight: true
      });
    });
  })

});
