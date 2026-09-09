document.addEventListener("DOMContentLoaded", function () {
  const baseUrl = "https://docs.google.com/document/d/e/2PACX-1vQCF8DI_48EaSel6aMjFzhYjaLE6VL9JaurthImy93K1UREFNzjA7yHHevIi8T4s-8Hoxwfpozs5z3m/pub?embedded=true";

  const iframe = document.createElement("iframe");
  iframe.width = "100%";
  iframe.height = "600";
  iframe.frameBorder = "0";
  iframe.src = baseUrl + "&_t=" + new Date().getTime();

  document.getElementById("doc-container").appendChild(iframe);

  document.addEventListener('click', function(e) {
  // Find if the clicked element (or its parent) is a link
  let anchor = e.target.closest('a');
  
  if (anchor && anchor.href) {
    let urlString = anchor.href;

    // Check if the link contains Google's redirect URL
    if (urlString.includes("://google.com")) {
      try {
        let urlObj = new URL(urlString);
        // Extract the actual destination from the 'q' parameter
        let cleanUrl = urlObj.searchParams.get("q");
        
        if (cleanUrl) {
          anchor.href = cleanUrl; // Replace it with the clean link
        }
      } catch (err) {
        console.error("Failed to parse URL", err);
      }
    }
  }
});


  // Refresh every 30 seconds
  setInterval(function () {
    iframe.src = baseUrl + "&_t=" + new Date().getTime();
  }, 30000);
});