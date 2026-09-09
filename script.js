document.addEventListener("DOMContentLoaded", function () {
  const baseUrl = "https://docs.google.com/document/d/e/2PACX-1vQCF8DI_48EaSel6aMjFzhYjaLE6VL9JaurthImy93K1UREFNzjA7yHHevIi8T4s-8Hoxwfpozs5z3m/pub?embedded=true";

  const iframe = document.createElement("iframe");
  iframe.width = "100%";
  iframe.height = "600";
  iframe.frameBorder = "0";
  iframe.src = baseUrl + "&_t=" + new Date().getTime();

  document.getElementById("doc-container").appendChild(iframe);

  // Refresh every 30 seconds
  setInterval(function () {
    iframe.src = baseUrl + "&_t=" + new Date().getTime();
  }, 30000);
});