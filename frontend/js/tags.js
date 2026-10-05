let selectedTag = null;

export function renderTags(svg, tags, onTagSelected) {
    tags.forEach((tag) => {
        updateTagMarker(svg, tag, onTagSelected);
    });
}

function updateTagMarker(svg, tag, onTagSelected) {
    let circle = svg.querySelector(
        `.tag-marker[data-tag-id="${tag.id}"]`
    );

    if (!circle) {
        circle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );

        circle.classList.add("tag-marker");
        circle.setAttribute("data-tag-id", tag.id);
        circle.setAttribute("r", "0.18");

        circle.setAttribute("fill", "#ff9800");
        circle.setAttribute("stroke", "#e65100");
        circle.setAttribute("stroke-width", "0.03");

        circle.addEventListener("click", (event) => {
            event.stopPropagation();

            selectedTag = tag;

            updateTagVisuals(svg);

            if (onTagSelected) {
                onTagSelected(tag);
            }
        });

        svg.appendChild(circle);
    }

    circle.setAttribute("cx", tag.position.x);
    circle.setAttribute("cy", tag.position.y);

    if (selectedTag && selectedTag.id === tag.id) {
        selectedTag = tag;

        updateTagVisuals(svg);

        if (onTagSelected) {
            onTagSelected(tag);
        }
    }
}

function updateTagVisuals(svg) {
    svg.querySelectorAll(".tag-marker").forEach((marker) => {
        const tagId = marker.dataset.tagId;

        if (selectedTag && tagId === selectedTag.id) {
            marker.setAttribute("fill", "#2196f3");
            marker.setAttribute("stroke", "#0d47a1");
            marker.setAttribute("stroke-width", "0.05");
        } else {
            marker.setAttribute("fill", "#ff9800");
            marker.setAttribute("stroke", "#e65100");
            marker.setAttribute("stroke-width", "0.03");
        }
    });
}

export function clearTagSelection(svg) {
    selectedTag = null;
    updateTagVisuals(svg);
}

export function getSelectedTag() {
    return selectedTag;
}

export function connectTags(svg, onTagSelected) {
    const protocol = window.location.protocol === "https:"
        ? "wss:"
        : "ws:";

    const wsUrl = `${protocol}//${window.location.host}/ws/tags`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        console.log("WebSocket tags connected");
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);

            if (!data.tags) {
                return;
            }

            data.tags.forEach((tag) => {
                updateTagMarker(svg, tag, onTagSelected);
            });
        } catch (error) {
            console.error("Ошибка обработки tags:", error);
        }
    };

    ws.onclose = () => {
        console.log("WebSocket tags disconnected");

        setTimeout(() => {
            connectTags(svg, onTagSelected);
        }, 2000);
    };

    ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        ws.close();
    };

    return ws;
}