const headers = new Headers();
headers.append("Authorization", "Bearer YourAccessToken"); // Replace 'YourAccessToken' with your actual token

// Define the URL of the API
const apiUrl = "/api/v1/downloadPdf";

// Make a fetch request with the headers
fetch(apiUrl, {
  method: "GET", // You can use 'POST', 'PUT', or 'DELETE' if your API requires a different HTTP method
  headers: headers,
})
  .then((response) => {
    if (response.ok) {
      // The request was successful, so initiate the PDF download
      response.blob().then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "downloaded.pdf"; // Change the filename as needed
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      });
    } else {
      // Handle errors here
      console.error("Request failed with status:", response.status);
    }
  })
  .catch((error) => {
    console.error("Request failed:", error);
  });
