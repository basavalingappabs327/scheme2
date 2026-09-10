// ============================================================
// GOOGLE DOC → GITHUB WEBSITE
// ============================================================


// ------------------------------------------------------------
// PUT YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
// ------------------------------------------------------------

const API_URL =
  "https://script.google.com/macros/s/AKfycby1izgkHu1ifsxxlqM2kH8ARPQSLBreepXZdQZ6Hmjm6JyvwKcU0Gp95T1bmDczdF2G/exec";


// ------------------------------------------------------------
// REFRESH EVERY 30 SECONDS
// ------------------------------------------------------------

const REFRESH_INTERVAL = 30000;


// ============================================================
// START
// ============================================================

document.addEventListener(
  "DOMContentLoaded",
  function () {

    loadDocument();


    setInterval(
      loadDocument,
      REFRESH_INTERVAL
    );

  }
);


// ============================================================
// LOAD GOOGLE DOCUMENT
// ============================================================

function loadDocument() {


  const container =
    document.getElementById(
      "doc-container"
    );


  const loading =
    document.getElementById(
      "loading"
    );


  const errorBox =
    document.getElementById(
      "error"
    );


  const updated =
    document.getElementById(
      "updated"
    );


  // ----------------------------------------------------------
  // Show loading only on first load
  // ----------------------------------------------------------

  if (
    !container.innerHTML.trim()
  ) {

    loading.style.display =
      "block";

  }


  errorBox.style.display =
    "none";


  // ----------------------------------------------------------
  // Prevent browser caching
  // ----------------------------------------------------------

  const url =
    API_URL +
    "?t=" +
    new Date().getTime();


  // ----------------------------------------------------------
  // Fetch Apps Script
  // ----------------------------------------------------------

  fetch(
    url,
    {
      method: "GET",

      cache: "no-store"
    }
  )

    .then(
      function (response) {

        if (!response.ok) {

          throw new Error(
            "Server returned HTTP " +
            response.status
          );

        }


        return response.json();

      }
    )


    .then(
      function (data) {


        loading.style.display =
          "none";


        // ----------------------------------------------------
        // Check API response
        // ----------------------------------------------------

        if (!data.success) {

          throw new Error(
            data.error ||
            "Unable to load Google Doc."
          );

        }


        // ----------------------------------------------------
        // Remember current scroll position
        // ----------------------------------------------------

        const scrollY =
          window.scrollY;


        // ----------------------------------------------------
        // Insert document
        // ----------------------------------------------------

        container.innerHTML =
          data.html;


        // ----------------------------------------------------
        // Normalize document width
        // ----------------------------------------------------

        normalizeDocumentWidth();


        // ----------------------------------------------------
        // Fix hyperlinks
        // ----------------------------------------------------

        fixAllLinks();


        // ----------------------------------------------------
        // Restore scroll position
        // ----------------------------------------------------

        window.scrollTo(
          0,
          scrollY
        );


        // ----------------------------------------------------
        // Display update time
        // ----------------------------------------------------

        if (data.time) {

          const date =
            new Date(
              Number(data.time)
            );


          updated.textContent =
            "Last checked: " +
            date.toLocaleTimeString();

        }

      }
    )


    .catch(
      function (error) {

        loading.style.display =
          "none";


        showError(
          error.message
        );


        console.error(
          "Document loading error:",
          error
        );

      }
    );

}


// ============================================================
// NORMALIZE DOCUMENT WIDTH
// ============================================================

function normalizeDocumentWidth() {


  const container =
    document.getElementById(
      "doc-container"
    );


  if (!container) {

    return;

  }


  // ----------------------------------------------------------
  // Main wrapper
  // ----------------------------------------------------------

  const main =
    container.querySelector(
      ".google-doc-content"
    );


  if (main) {

    main.style.width =
      "100%";

    main.style.maxWidth =
      "none";

    main.style.marginLeft =
      "0";

    main.style.marginRight =
      "0";

    main.style.paddingLeft =
      "0";

    main.style.paddingRight =
      "0";

  }


  // ----------------------------------------------------------
  // Look at major block elements
  // ----------------------------------------------------------

  const blocks =
    container.querySelectorAll(
      ".google-doc-content > div, " +
      ".google-doc-content > section, " +
      ".google-doc-content > article"
    );


  blocks.forEach(
    function (element) {

      element.style.maxWidth =
        "none";

      element.style.boxSizing =
        "border-box";

    }
  );


  // ----------------------------------------------------------
  // Make images responsive
  // ----------------------------------------------------------

  const images =
    container.querySelectorAll(
      "img"
    );


  images.forEach(
    function (image) {

      image.style.maxWidth =
        "100%";

      image.style.height =
        "auto";

    }
  );


  // ----------------------------------------------------------
  // Prevent very wide tables from breaking page
  // ----------------------------------------------------------

  const tables =
    container.querySelectorAll(
      "table"
    );


  tables.forEach(
    function (table) {

      table.style.maxWidth =
        "100%";

      table.style.boxSizing =
        "border-box";

    }
  );

}


// ============================================================
// FIX ALL HYPERLINKS
// ============================================================

function fixAllLinks() {


  const links =
    document.querySelectorAll(
      "#doc-container a"
    );


  links.forEach(
    function (link) {


      // ------------------------------------------------------
      // Open link in new tab
      // ------------------------------------------------------

      link.target =
        "_blank";


      link.rel =
        "noopener noreferrer";


      const href =
        link.getAttribute(
          "href"
        );


      if (!href) {

        return;

      }


      // ------------------------------------------------------
      // Convert Google redirect link
      // ------------------------------------------------------

      if (
        href.includes(
          "google.com/url"
        )
      ) {


        try {

          const googleUrl =
            new URL(href);


          const destination =
            googleUrl.searchParams.get(
              "q"
            );


          if (destination) {

            link.href =
              decodeURIComponent(
                destination
              );

          }

        }

        catch (error) {

          console.log(
            "Could not convert Google URL:",
            href
          );

        }

      }

    }
  );

}


// ============================================================
// SHOW ERROR
// ============================================================

function showError(
  message
) {


  const errorBox =
    document.getElementById(
      "error"
    );


  errorBox.textContent =
    "Unable to load scheme details: " +
    message;


  errorBox.style.display =
    "block";

}