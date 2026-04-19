// Run when a tab is updated (opened or refreshed)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        groupTabs();
        removeDuplicates();
    }
});


// 🔹 Group tabs by domain
function groupTabs() {
    chrome.tabs.query({}, function (tabs) {

        let groups = {};

        tabs.forEach(tab => {
            try {
                let url = new URL(tab.url);
                let domain = url.hostname;

                if (!groups[domain]) {
                    groups[domain] = [];
                }

                groups[domain].push(tab.id);
            } catch (e) {}
        });

        Object.values(groups).forEach(tabIds => {
            if (tabIds.length > 1) {
                chrome.tabs.group({ tabIds: tabIds });
            }
        });
    });
}


// 🔹 Remove duplicate tabs
function removeDuplicates() {
    chrome.tabs.query({}, function (tabs) {
        let seen = new Set();

        tabs.forEach(tab => {
            if (seen.has(tab.url)) {
                chrome.tabs.remove(tab.id);
            } else {
                seen.add(tab.url);
            }
        });
    });
}