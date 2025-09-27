 
  const apiKey = mapkey;
//   console.log(apiKey)
    const map = new maplibregl.Map({
        container: 'map', // container id
        style:`https://api.maptiler.com/maps/streets/style.json?key=${apiKey}`, // style URL
        center: listing.geometry.coordinates, // starting position [lng, lat]
        zoom: 11, // starting zoom
        maplibreLogo: true
    });
 const marker = new maplibregl.Marker({color:"red"})
        .setLngLat(listing.geometry.coordinates)
        .setPopup(new maplibregl.Popup({offset:25,closeOnClick: false})
        .setHTML(`<h4>${listing.location}</h4><p>Exact location provided after booking</p>`))
        .addTo(map);