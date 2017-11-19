document.addEventListener('DOMContentLoaded', function() {
    var checkPageButton = document.getElementById('showHistory');
    checkPageButton.addEventListener('click', function() {
        var newURL = "http://localhost:4200";
        chrome.tabs.create({ url: newURL });
    }, false);
}, false);