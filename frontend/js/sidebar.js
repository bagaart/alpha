const sidebar = document.querySelector(".sidebar");

export function clearSidebar() {
    if (!sidebar) {
        return;
    }

    sidebar.innerHTML = "";
}

export function renderScannerSidebar(scanner) {
    if (!sidebar) {
        return;
    }

    sidebar.innerHTML = `
        <div class="sidebar-content">
            <h2>${escapeHtml(scanner.name)}</h2>

            <div class="entity-type">
                Сканер
            </div>

            <div class="info-row">
                <span>ID</span>
                <strong>${escapeHtml(scanner.id)}</strong>
            </div>

            <div class="info-row">
                <span>X</span>
                <strong>${formatNumber(scanner.position.x)}</strong>
            </div>

            <div class="info-row">
                <span>Y</span>
                <strong>${formatNumber(scanner.position.y)}</strong>
            </div>

            <div class="info-row">
                <span>Радиус</span>
                <strong>${formatNumber(scanner.range)}</strong>
            </div>
        </div>
    `;
}

export function renderTagSidebar(tag) {
    if (!sidebar) {
        return;
    }

    sidebar.innerHTML = `
        <div class="sidebar-content">
            <h2>${escapeHtml(tag.id)}</h2>

            <div class="entity-type">
                Метка
            </div>

            <div class="info-row">
                <span>ID</span>
                <strong>${escapeHtml(tag.id)}</strong>
            </div>

            <div class="info-row">
                <span>X</span>
                <strong>${formatNumber(tag.position.x)}</strong>
            </div>

            <div class="info-row">
                <span>Y</span>
                <strong>${formatNumber(tag.position.y)}</strong>
            </div>
        </div>
    `;
}

function formatNumber(value) {
    if (typeof value !== "number") {
        return value;
    }

    return value.toFixed(2);
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}