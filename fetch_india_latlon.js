const axios = require("axios");
const fs = require("fs");
const xlsx = require("xlsx");

async function fetchIndiaLatLon() {
    const overpassQuery = `
    [out:json];
    area["name"="India"]->.searchArea;
    node(area.searchArea)[place];
    out body;
    `;

    const url = "https://overpass-api.de/api/interpreter";
    try {
        const response = await axios.post(url, `data=${encodeURIComponent(overpassQuery)}`);
        const nodes = response.data.elements;

        const locations = nodes.map(node => ({
            name: node.tags.name || "Unknown",
            latitude: node.lat,
            longitude: node.lon
        }));

        // Convert to Excel format
        const worksheet = xlsx.utils.json_to_sheet(locations);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "India_LatLon");

        // Save the Excel file
        xlsx.writeFile(workbook, "India_LatLon.xlsx");
        console.log("India_LatLon.xlsx has been created successfully!");
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

fetchIndiaLatLon();
