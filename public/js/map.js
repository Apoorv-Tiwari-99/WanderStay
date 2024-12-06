  maptilersdk.config.apiKey = mapToken;
  const map = new maptilersdk.Map({
    container: 'map', // container's id or the HTML element to render the map
    style: maptilersdk.MapStyle.STREETS,
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 14, // starting zoom
  });

// Create a custom wrapper for the circle and the marker
const customIconWrapper = document.createElement('div');
customIconWrapper.style.position = 'relative'; // Positioning for proper centering
customIconWrapper.style.width = '150px'; // Adjust size for the larger circle
customIconWrapper.style.height = '150px'; // Same size as the circle
customIconWrapper.style.borderRadius = '50%'; // Ensure wrapper is circular (optional)

// Create the large transparent light pink circle
const largeCircle = document.createElement('div');
largeCircle.style.position = 'absolute';
largeCircle.style.width = '150px'; // Adjust size of the circle
largeCircle.style.height = '150px'; // Same size as the wrapper
largeCircle.style.borderRadius = '50%'; // Make it circular
largeCircle.style.backgroundColor = 'rgba(255, 182, 193, 0.3)'; // Light pink with transparency
largeCircle.style.zIndex = '1'; // Circle stays in the background
largeCircle.style.top = '0'; // Align to the top of the wrapper
largeCircle.style.left = '0'; // Align to the left of the wrapper

// Create the Font Awesome home icon
const icon = document.createElement('i');
icon.className = 'fa-solid fa-house'; // Font Awesome home icon
icon.style.fontSize = '28px'; // Icon size (adjust as needed)
icon.style.color = '#FF0000'; // Icon color
icon.style.position = 'absolute'; // Absolute position to center inside the wrapper
icon.style.top = '50%'; // Center vertically inside the circle
icon.style.left = '50%'; // Center horizontally inside the circle
icon.style.transform = 'translate(-50%, -50%)'; // Perfect centering using transform

// Append the large circle and icon to the wrapper
customIconWrapper.appendChild(largeCircle);
customIconWrapper.appendChild(icon);

  const marker = new maptilersdk.Marker({color: "red",draggable: true,element: customIconWrapper })
  .setLngLat(listing.geometry.coordinates)  // listing.geometry.coordinates
  .setPopup(new maptilersdk.Popup({offset: 25,className: 'my-class'})
  .setHTML(`<h4>${listing.title}</h4><p>Exact location provided after booking</p>`))
  .addTo(map);
