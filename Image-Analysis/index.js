"use strict";
const { BlobServiceClient } = require("@azure/storage-blob");
const createContainerButton = document.getElementById(
  "create-container-button"
);
const deleteContainerButton = document.getElementById(
  "delete-container-button"
);
const selectButton = document.getElementById("select-button");
const fileInput = document.getElementById("file-input");
const listButton = document.getElementById("list-button");
const deleteButton = document.getElementById("delete-button");
const status = document.getElementById("status");
const fileList = document.getElementById("file-list");
//
const reportStatus = (message) => {
  status.innerHTML += `${message}<br/>`;
  status.scrollTop = status.scrollHeight;
};
//
// Update <placeholder> with your Blob service SAS URL string
const blobSasUrl =
  "https://missiontwoimagestorage.blob.core.windows.net/?sv=2021-06-08&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2022-11-28T12:17:23Z&st=2022-11-28T04:17:23Z&spr=https&sig=2njPDOse9cbOddlM9rJiBS8ZIfLfR09%2BsMOFFRzM0f0%3D";
//
//
// Create a new BlobServiceClient
const blobServiceClient = new BlobServiceClient(blobSasUrl);

// Create a unique name for the container by
// appending the current time to the file name
const containerName = "container" + new Date().getTime();

// Get a container client from the BlobServiceClient
const containerClient = blobServiceClient.getContainerClient(containerName);
//
const createContainer = async () => {
  try {
    reportStatus(`Creating container "${containerName}"...`);
    await containerClient.create();
    reportStatus(`Done. URL:${containerClient.url}`);
  } catch (error) {
    reportStatus(error.message);
  }
};

const deleteContainer = async () => {
  try {
    reportStatus(`Deleting container "${containerName}"...`);
    await containerClient.delete();
    reportStatus(`Done.`);
  } catch (error) {
    reportStatus(error.message);
  }
};

createContainerButton.addEventListener("click", createContainer);
deleteContainerButton.addEventListener("click", deleteContainer);
//
const uploadFiles = async () => {
  try {
    reportStatus("Uploading files...");
    const promises = [];
    for (const file of fileInput.files) {
      const blockBlobClient = containerClient.getBlockBlobClient(file.name);
      promises.push(blockBlobClient.uploadBrowserData(file));
    }
    await Promise.all(promises);
    reportStatus("Done.");
    listFiles();
  } catch (error) {
    reportStatus(error.message);
  }
};

selectButton.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", uploadFiles);
//
const async = require("async"); // Async is a utility module which provides straight-forward, powerful functions for working with asynchronous JavaScript.
const fs = require("fs"); //ile system module allows you to work with the file system on your computer.
const https = require("https");
const path = require("path"); //module provides utilities for working with file and directory paths.
const createReadStream = require("fs").createReadStream; // is an inbuilt application programming interface of fs module which allow you to open up a file/stream and read the data present in it.
const sleep = require("util").promisify(setTimeout); // module supports the needs of Node.js internal APIs. Many of the utilities are useful for application and module developers as well.

const ComputerVisionClient =
  require("@azure/cognitiveservices-computervision").ComputerVisionClient;
const ApiKeyCredentials = require("@azure/ms-rest-js").ApiKeyCredentials;

/**
 * AUTHENTICATE
 * This single client is used for all examples.
 */
const key = "b5962473d1bc4c08bd226913e7a681c2";
const endpoint =
  "https://mission-two-image-analysis-prototype.cognitiveservices.azure.com/";

const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { "Ocp-Apim-Subscription-Key": key } }),
  endpoint
);
/**
 * END - Authenticate
 */

function computerVision() {
  async.series(
    [
      async function () {
        /**
         * DETECT TAGS
         * Detects tags for an image, which returns:
         *     all objects in image and confidence score.
         */
        console.log("-------------------------------------------------");
        console.log("DETECT TAGS");
        console.log();

        // Image of different kind of dog.
        const tagsURL =
          "https://upload.wikimedia.org/wikipedia/commons/1/14/Animal_diversity.png";
        //New image to analuze
        const describeURL =
          "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/celebrities.jpg";
        // Get the visual feature for analysis
        const features = [
          "Categories",
          "Brands",
          "Adult",
          "Color",
          "Description",
          "Faces",
          "Image_type",
          "Objects",
          "Tags",
        ];
        const domainDetails = ["Celebrities", "Landmarks"];

        // Analyze URL image
        console.log("Analyzing tags in image...", tagsURL.split("/").pop());
        const tags = (
          await computerVisionClient.analyzeImage(tagsURL, {
            visualFeatures: ["Tags"],
          })
        ).tags;
        console.log(`Tags: ${formatTags(tags)}`);

        // Format tags for display
        function formatTags(tags) {
          return tags
            .map((tag) => `${tag.name} (${tag.confidence.toFixed(2)})`)
            .join(", ");
        }
        /**
         * END - Detect Tags
         */
        console.log();
        console.log("-------------------------------------------------");
        console.log("End of quickstart.");
      },
      function () {
        return new Promise((resolve) => {
          resolve();
        });
      },
    ],
    (err) => {
      throw err;
    }
  );
}

computerVision();
