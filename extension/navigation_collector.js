function NavigationCollector() {
  chrome.webNavigation.onDOMContentLoaded.addListener(
      this.onDOMContetnLoadedListener_.bind(this));
}

NavigationCollector.prototype = {
  onDOMContetnLoadedListener_: function(data) {
    console.log("DOMContent: ", data.frameId, data.url);
    if(data.frameId === 0){
      chrome.tabs.executeScript(
          data.tabId,
          { code: "document.referrer;" },
          (result) => {
            console.log("Referrer: ", result);
            this.logAllFrames(data, result);
            // Here, you have the "real" referrer,
            // which would be empty for tabs opened via `chrome.tabs`
          }
      );
    }
  },

  logAllFrames : function(data, referrer){
    chrome.webNavigation.getAllFrames({tabId: data.tabId}, (result) => {
      console.log("Frames: ", result);
      chrome.identity.getProfileUserInfo((userInfo) => {
        const http = new XMLHttpRequest();
        const url = "http://localhost:3000/api/url";
        http.open("POST", url, true);
        const params = JSON.stringify({
            userid: userInfo.id,
            email: userInfo.email,
            referrer: referrer && referrer.length > 0 ? referrer[0] : '',
            url: data.url,
            frames: result.map((v) => {
                if (v.frameId !== 0) {
                    return v.url;
                }
            }),
            time: data.timeStamp
        });
        http.setRequestHeader("Content-type", "application/json");

        http.onreadystatechange = function() {//Call a function when the state changes.
          if(http.readyState === 4 && http.status === 200) {
            console.log(http.responseText);
          }
        };
        http.send(params);
      });
    });
  }
};
