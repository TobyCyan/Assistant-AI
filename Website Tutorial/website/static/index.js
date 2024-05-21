function deleteNode(noteId) {
    // Sends a POST request to the delete-note end point
    fetch('/delete-note', {
        method: 'POST',
        body: JSON.stringify({ noteId: noteId})
    }).then((_res) => {
        // Redirects to home page a.k.a refreshes the home page
        window.location.href = "/";
    });
}