document.addEventListener('DOMContentLoaded', () => {
    // Retrieve the saved months value from localStorage
    const savedMonths = localStorage.getItem('monthsInput');
    if (savedMonths) {
        document.getElementById('monthsInput').value = savedMonths;
    }

    // Save the months value to localStorage whenever it changes
    document.getElementById('monthsInput').addEventListener('input', (event) => {
        localStorage.setItem('monthsInput', event.target.value);
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab.url.endsWith('/settings/archiving')) {
            chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                function: updateInitialSubtotal
            }, updateSubtotal);
        }
    });

    document.getElementById('help').addEventListener('click', () => {
        chrome.windows.create({
            url: 'https://documentation.n-able.com/covedataprotection/USERGUIDE/documentation/Content/backup-manager/backup-manager-guide/archiving.htm',
            type: 'popup'
        });
    });

    document.getElementById('about').addEventListener('click', () => {
        fetch(chrome.runtime.getURL('about.txt'))
            .then(response => response.text())
            .then(text => alert(text))
            .catch(error => console.error('Error loading about.txt:', error));
    });

    document.getElementById('selectCheckboxes').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            if (activeTab.url.endsWith('/settings/archiving')) {
                chrome.scripting.executeScript({
                    target: { tabId: activeTab.id },
                    function: toggleCheckboxes
                }, updateSubtotal);
            }
        });
    });

    document.getElementById('toggleCompletedCheckboxes').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            if (activeTab.url.endsWith('/settings/archiving')) {
                chrome.scripting.executeScript({
                    target: { tabId: activeTab.id },
                    function: toggleCompletedCheckboxes
                }, updateSubtotal);
            }
        });
    });

    document.getElementById('toggleErrorCheckboxes').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            if (activeTab.url.endsWith('/settings/archiving')) {
                chrome.scripting.executeScript({
                    target: { tabId: activeTab.id },
                    function: toggleErrorCheckboxes
                }, updateSubtotal);
            }
        });
    });

    document.getElementById('toggleFailedCheckboxes').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            if (activeTab.url.endsWith('/settings/archiving')) {
                chrome.scripting.executeScript({
                    target: { tabId: activeTab.id },
                    function: toggleFailedCheckboxes
                }, updateSubtotal);
            }
        });
    });

    document.getElementById('deselectCheckboxes').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            if (activeTab.url.endsWith('/settings/archiving')) {
                chrome.scripting.executeScript({
                    target: { tabId: activeTab.id },
                    function: deselectCheckboxes
                }, updateSubtotal);
            }
        });
    });

    document.getElementById('toggleOldCheckboxes').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            const monthsInput = document.getElementById('monthsInput').value;
            chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                function: toggleOldCheckboxes,
                args: [monthsInput]
            }, updateSubtotal);
        });
    });

    document.getElementById('toggleSearchCheckboxes').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            const searchText = document.getElementById('searchInput').value;
            chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                function: toggleSearchCheckboxes,
                args: [searchText]
            }, updateSubtotal);
        });
    });
});




function toggleCheckboxes() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = !checkbox.checked);
    return { selected: document.querySelectorAll('input[type="checkbox"]:checked').length, total: checkboxes.length };
}

function toggleCompletedCheckboxes() {
    const rows = document.querySelectorAll('tr');
    let count = 0;
    rows.forEach(row => {
        if (row.textContent.toLowerCase().includes('completed')) {
            const checkboxes = row.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = !checkbox.checked;
                count++;
            });
        }
    });
    return { selected: document.querySelectorAll('input[type="checkbox"]:checked').length, total: document.querySelectorAll('input[type="checkbox"]').length };
}

function toggleErrorCheckboxes() {
    const rows = document.querySelectorAll('tr');
    let count = 0;
    rows.forEach(row => {
        if (row.textContent.toLowerCase().includes('errors')) {
            const checkboxes = row.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = !checkbox.checked;
                count++;
            });
        }
    });
    return { selected: document.querySelectorAll('input[type="checkbox"]:checked').length, total: document.querySelectorAll('input[type="checkbox"]').length };
}

function toggleFailedCheckboxes() {
    const rows = document.querySelectorAll('tr');
    let count = 0;
    rows.forEach(row => {
        if (row.textContent.toLowerCase().includes('failed')) {
            const checkboxes = row.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = !checkbox.checked;
                count++;
            });
        }
    });
    return { selected: document.querySelectorAll('input[type="checkbox"]:checked').length, total: document.querySelectorAll('input[type="checkbox"]').length };
}

function deselectCheckboxes() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = false);
    return { selected: 0, total: checkboxes.length };
}

function toggleOldCheckboxes(monthsInput) {
    const monthsAgo = new Date();
    monthsAgo.setMonth(monthsAgo.getMonth() - monthsInput);

    const rows = document.querySelectorAll('tr');
    rows.forEach(row => {
        const dateCell = row.querySelectorAll('td')[1]; // Adjust the selector to match the second column
        if (dateCell) {
            const rowDate = new Date(dateCell.textContent.trim());
            if (rowDate < monthsAgo) {
                const checkboxes = row.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach(checkbox => checkbox.checked = !checkbox.checked);
            }
        }
    });

    return { selected: document.querySelectorAll('input[type="checkbox"]:checked').length, total: document.querySelectorAll('input[type="checkbox"]').length };
}


function toggleSearchCheckboxes(searchText) {
    const rows = document.querySelectorAll('tr');
    rows.forEach(row => {
        if (row.textContent.toLowerCase().includes(searchText.toLowerCase())) {
            const checkboxes = row.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => checkbox.checked = !checkbox.checked);
        }
    });
    return { selected: document.querySelectorAll('input[type="checkbox"]:checked').length, total: document.querySelectorAll('input[type="checkbox"]').length };
}


function updateInitialSubtotal() {
    const selected = document.querySelectorAll('input[type="checkbox"]:checked').length;
    const total = document.querySelectorAll('input[type="checkbox"]').length;
    return { selected, total };
}

function updateSubtotal(results) {
    const { selected, total } = results[0].result;
    document.getElementById('subtotal').textContent = `${selected}/${total}`;
}