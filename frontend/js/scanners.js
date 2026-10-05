const SVG_NS =
    "http://www.w3.org/2000/svg";


let selectedScanner = null;


export function renderScanners(
    svg,
    scanners,
    onSelect
) {

    scanners.forEach(
        scanner => {

            renderScanner(
                svg,
                scanner,
                onSelect
            );

        }
    );
}


function renderScanner(
    svg,
    scanner,
    onSelect
) {

    const group =
        document.createElementNS(
            SVG_NS,
            "g"
        );

    group.classList.add(
        "scanner"
    );

    group.dataset.id =
        scanner.id;


    // ========================================
    // Range
    // ========================================

    const range =
        document.createElementNS(
            SVG_NS,
            "circle"
        );

    range.classList.add(
        "scanner-range"
    );

    range.setAttribute(
        "cx",
        scanner.position.x
    );

    range.setAttribute(
        "cy",
        scanner.position.y
    );

    range.setAttribute(
        "r",
        scanner.range
    );

    // ВАЖНО:
    // SVG по умолчанию рисует circle чёрным.
    range.setAttribute(
        "fill",
        "#4fc3f7"
    );

    range.setAttribute(
        "fill-opacity",
        "0.2"
    );

    range.setAttribute(
        "stroke",
        "#4fc3f7"
    );

    range.setAttribute(
        "stroke-opacity",
        "0.5"
    );

    range.setAttribute(
        "stroke-width",
        "0.02"
    );

    range.style.display =
        "none";

    range.style.pointerEvents =
        "none";


    // ========================================
    // Marker
    // ========================================

    const marker =
        document.createElementNS(
            SVG_NS,
            "circle"
        );

    marker.classList.add(
        "scanner-marker"
    );

    marker.setAttribute(
        "cx",
        scanner.position.x
    );

    marker.setAttribute(
        "cy",
        scanner.position.y
    );

    marker.setAttribute(
        "r",
        "0.15"
    );

    marker.setAttribute(
        "fill",
        "#e53935"
    );

    marker.style.cursor =
        "pointer";


    marker.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            onSelect(scanner);
        }
    );


    group.appendChild(range);
    group.appendChild(marker);

    svg.appendChild(group);
}


export function selectScanner(
    svg,
    scanner
) {

    clearScannerSelection(svg);

    selectedScanner = scanner;


    const group =
        svg.querySelector(
            `.scanner[data-id="${scanner.id}"]`
        );

    if (!group) {
        return;
    }


    const range =
        group.querySelector(
            ".scanner-range"
        );

    const marker =
        group.querySelector(
            ".scanner-marker"
        );


    if (range) {
        range.style.display =
            "block";
    }


    if (marker) {

        marker.setAttribute(
            "fill",
            "#1976d2"
        );

        marker.setAttribute(
            "r",
            "0.2"
        );
    }
}


export function clearScannerSelection(
    svg
) {

    selectedScanner = null;


    svg.querySelectorAll(
        ".scanner-range"
    ).forEach(
        range => {

            range.style.display =
                "none";
        }
    );


    svg.querySelectorAll(
        ".scanner-marker"
    ).forEach(
        marker => {

            marker.setAttribute(
                "fill",
                "#e53935"
            );

            marker.setAttribute(
                "r",
                "0.15"
            );
        }
    );
}
