// ============================================================
// GOOGLE DOC → GITHUB WEBSITE
// WITH AUTOMATIC RETRY
// ============================================================


// ============================================================
// YOUR GOOGLE APPS SCRIPT WEB APP URL
// ============================================================
//
// IMPORTANT:
// Use the URL ending with /exec
//
// Example:
// https://script.google.com/macros/s/XXXXXXXXXXXX/exec
//
// ============================================================

const API_URL =
  "https://script.google.com/macros/s/AKfycbyqvppHGPtpC_QWqP5HgSzN_mRCwyqZwu_La0_AlXm6-B6mO48v8jATvtWpJ-ETvwU1mw/exec";


// ============================================================
// AUTOMATIC REFRESH
// ============================================================
//
// Check the Google Doc every 30 seconds
//
// ============================================================

const REFRESH_INTERVAL = 30000;


// ============================================================
// RETRY SETTINGS
// ============================================================

const MAX_RETRIES = 3;

// Wait 2 seconds before each retry
const RETRY_DELAY = 2000;


// ============================================================
// START
// ============================================================

document.addEventListener(
  "DOMContentLoaded",
  function () {

    loadDocument();

    setInterval(
      function () {
        loadDocument();
      },
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
  // Hide old error
  // ----------------------------------------------------------

  errorBox.style.display =
    "none";


  // ----------------------------------------------------------
  // Show loading only if document is not already displayed
  // ----------------------------------------------------------

  if (
    !container.innerHTML.trim()
  ) {

    loading.style.display =
      "block";

  }


  // ----------------------------------------------------------
  // Start request with retry number 0
  // ----------------------------------------------------------

  fetchDocumentWithRetry(
    0,
    container,
    loading,
    errorBox,
    updated
  );

}


// ============================================================
// FETCH WITH AUTOMATIC RETRY
// ============================================================

function fetchDocumentWithRetry(
  retryNumber,
  container,
  loading,
  errorBox,
  updated
) {


  // ----------------------------------------------------------
  // Cache-busting URL
  // ----------------------------------------------------------

  const url =
    API_URL +
    "?t=" +
    new Date().getTime();


  console.log(
    "Loading Google Doc. Attempt:",
    retryNumber + 1
  );


  // ----------------------------------------------------------
  // FETCH
  // ----------------------------------------------------------

  fetch(
    url,
    {
      method: "GET",
      cache: "no-store"
    }
  )


    // --------------------------------------------------------
    // Check HTTP response
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // Process successful response
    // --------------------------------------------------------

    .then(
      function (data) {


        loading.style.display =
          "none";


        // ----------------------------------------------------
        // Check Apps Script response
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
        // Insert Google Doc
        // ----------------------------------------------------

        container.innerHTML =
          data.html;


        // ----------------------------------------------------
        // Make document full width
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
        // Show last checked time
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


        console.log(
          "Google Doc loaded successfully."
        );

      }
    )


    // --------------------------------------------------------
    // ERROR → RETRY
    // --------------------------------------------------------

    .catch(
      function (error) {


        console.warn(
          "Document loading attempt " +
          (retryNumber + 1) +
          " failed:",
          error.message
        );


        // ----------------------------------------------------
        // Retry if attempts remain
        // ----------------------------------------------------

        if (
          retryNumber <
          MAX_RETRIES - 1
        ) {


          // Keep the existing document visible
          // if it has already loaded previously.

          if (
            container.innerHTML.trim()
          ) {

            loading.style.display =
              "none";

          } else {

            loading.style.display =
              "block";

            loading.textContent =
              "Loading scheme details...";

          }


          // --------------------------------------------------
          // Wait before retry
          // --------------------------------------------------

          setTimeout(
            function () {

              fetchDocumentWithRetry(
                retryNumber + 1,
                container,
                loading,
                errorBox,
                updated
              );

            },
            RETRY_DELAY
          );


        } else {


          // --------------------------------------------------
          // All retries failed
          // --------------------------------------------------

          loading.style.display =
            "none";


          // Only show error if we don't already have
          // document content displayed.

          if (
            !container.innerHTML.trim()
          ) {

            showError(
              "Unable to load scheme details after " +
              MAX_RETRIES +
              " attempts. Please try again later."
            );

          } else {

            console.warn(
              "Temporary update failed. " +
              "The previously loaded document remains visible."
            );

          }

        }

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
  // Main Google Doc wrapper
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
  // Major document containers
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
  // Images
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
  // Tables
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
// FIX HYPERLINKS
// ============================================================
//
// This does NOT contain any specific website address.
//
// Any new hyperlink added to your Google Doc will be handled
// automatically.
//
// ============================================================

function fixAllLinks() {


  const links =
    document.querySelectorAll(
      "#doc-container a"
    );


  links.forEach(
    function (link) {


      // ------------------------------------------------------
      // Open in new tab
      // ------------------------------------------------------

      link.target =
        "_blank";


      link.rel =
        "noopener noreferrer";


      let href =
        link.getAttribute(
          "href"
        );


      if (!href) {

        return;

      }


      // ------------------------------------------------------
      // Google redirect URL
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

            href =
              destination;

          }

        }

        catch (error) {

          console.warn(
            "Could not convert Google URL:",
            href
          );

        }

      }


      // ------------------------------------------------------
      // Convert Google Drive DOWNLOAD links → VIEW links
      //
      // Example:
      // https://docs.google.com/uc?export=download&id=FILE_ID
      // becomes
      // https://drive.google.com/file/d/FILE_ID/view
      // ------------------------------------------------------

      try {

        // Pattern 1: docs.google.com/uc?export=download&id=...
        if (
          /docs\.google\.com\/uc\?.*export=download/i.test(href) ||
          /drive\.google\.com\/uc\?.*export=download/i.test(href)
        ) {

          const parsed = new URL(href);
          const fileId = parsed.searchParams.get("id");

          if (fileId) {
            href = "https://drive.google.com/file/d/" + fileId + "/view";
          }

        }

        // Pattern 2: already has /uc?id=... (without export)
        else if (
          /(?:docs|drive)\.google\.com\/uc\?/i.test(href)
        ) {

          const parsed = new URL(href);
          const fileId = parsed.searchParams.get("id");

          if (fileId) {
            href = "https://drive.google.com/file/d/" + fileId + "/view";
          }

        }

      } catch (error) {
        // Keep original href if conversion fails
      }


      // ------------------------------------------------------
      // Remove Google editor parameters
      // ------------------------------------------------------

      try {

        if (
          /^https?:\/\//i.test(
            href
          )
        ) {

          const parsed =
            new URL(href);


          parsed.searchParams.delete(
            "sa"
          );

          parsed.searchParams.delete(
            "source"
          );

          parsed.searchParams.delete(
            "ust"
          );

          parsed.searchParams.delete(
            "usg"
          );

          parsed.searchParams.delete(
            "ved"
          );

          parsed.searchParams.delete(
            "ei"
          );


          href =
            parsed.toString();

        }

      }

      catch (error) {

        // Fallback

        href =
          href.replace(
            /&(?:sa|source|ust|usg|ved|ei)=[^&"'<> ]*/gi,
            ""
          );

      }


      // ------------------------------------------------------
      // Remove trailing ?
      // ------------------------------------------------------

      href =
        href.replace(
          /\?$/,
          ""
        );


      // ------------------------------------------------------
      // Set final URL
      // ------------------------------------------------------

      link.href =
        href;

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
    message;


  errorBox.style.display =
    "block";

}
