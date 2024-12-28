function previewImage(event) {
    const imagePreview = document.getElementById("imagePreview");
    const processButton = document.getElementById("processButton");

    // Display the image preview
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            processButton.style.display = 'inline-block';
        };
        reader.readAsDataURL(file);
    }
}

function processImage() {
    const imageUpload = document.getElementById("imageUpload").files[0];
    const formData = new FormData();
    formData.append("image", imageUpload);

    // Show the progress bar and update the status
    document.getElementById("progressContainer").style.display = 'block';
    updateProgress(10, "Uploading Image...");

    // Send the image to the backend for processing
    fetch('/process_image', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log("Processed data:", data);
            updateProgress(50, "Processing Image...");

            // Simulate delay for processing (You can remove this after real processing)
            setTimeout(() => {
                updateProgress(80, "Detecting Books...");

                // Simulate a delay for OCR and Google Books API
                setTimeout(() => {
                    updateProgress(100, "Completed!");
                    displayResults(data); // Display results after processing is complete
                }, 2000); // Simulate API call time
            }, 2000); // Simulate image processing time
        })
        .catch(error => {
            console.error('Error processing image:', error);
            alert('An error occurred while processing the image.');
        });
}

function updateProgress(percentage, text) {
    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");

    // Update the progress bar and text
    progressBar.style.width = `${percentage}%`;
    progressText.textContent = text;
}

function displayResults(data) {
    const output = document.getElementById("output");
    const bookImages = document.getElementById("bookImages");
    const ocrResults = document.getElementById("ocrResults");
    const googleBooksInfo = document.getElementById("googleBooksInfo");

    // Clear any previous results
    bookImages.innerHTML = '';
    ocrResults.innerHTML = '';
    googleBooksInfo.innerHTML = '';

    // Display processed images
    data.books.forEach((book, index) => {
        const img = document.createElement("img");
        img.src = book.image;
        img.alt = `Book ${index + 1}`;
        img.style.width = "30%";
        bookImages.appendChild(img);

        // Display OCR results
        const ocrText = document.createElement("p");
        ocrText.textContent = `Book ${index + 1} OCR: ${book.ocrText}`;
        ocrResults.appendChild(ocrText);

        // Display Google Books info
        if (book.googleBooks) {
            const bookInfoDiv = document.createElement("div");

            const title = document.createElement("h3");
            title.textContent = book.googleBooks.title;
            bookInfoDiv.appendChild(title);

            const authors = document.createElement("p");
            authors.textContent = `Authors: ${book.googleBooks.authors}`;
            bookInfoDiv.appendChild(authors);

            const description = document.createElement("p");
            description.textContent = `Description: ${book.googleBooks.description}`;
            bookInfoDiv.appendChild(description);

            const image = document.createElement("img");
            image.src = book.googleBooks.imageUrl;
            image.alt = book.googleBooks.title;
            image.style.maxWidth = "100px";
            bookInfoDiv.appendChild(image);

            googleBooksInfo.appendChild(bookInfoDiv);
        }
    });

    output.style.display = 'block';
}
