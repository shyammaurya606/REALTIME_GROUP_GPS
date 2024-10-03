const socket = io();

// Prompt for the device name
const deviceName = prompt("Please enter your device name:");

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            // Send the location and device name to the server
            socket.emit("send-location", { latitude, longitude, deviceName });
        },
        (error) => {
            console.error(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 2000,
            maximumAge: 0
        }
    );
}

var map = L.map("map").setView([0, 0], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: "createdbyShyam"
}).addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
    const { id, latitude, longitude, deviceName } = data;
    map.setView([latitude, longitude]);
    const popupContent = `Location:<b>${deviceName}</b>`;
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude])
            .unbindPopup()  // Remove the old popup
            .bindPopup(popupContent)  // Add the new popup with device name in superscript
            .openPopup();  // Optionally open the popup
    } else {
        markers[id] = L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup(popupContent)  // Bind the popup with device name in superscript
            .openPopup();  // Optionally open the popup
    }
});

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
