import {
    getMap,
    getScanners,
    getMapSvg
} from "./api.js";

import {
    loadMap
} from "./map.js";

import {
    renderScanners,
    selectScanner,
    clearScannerSelection
} from "./scanners.js";

import {
    connectTags,
    clearTagSelection
} from "./tags.js";

import {
    clearSidebar,
    renderScannerSidebar,
    renderTagSidebar
} from "./sidebar.js";


async function init() {
    try {
        const mapContainer = document.getElementById("map");

        if (!mapContainer) {
            throw new Error("Элемент #map не найден");
        }

        // Загружаем карту и сканеры одновременно
        const [mapData, scanners] = await Promise.all([
            getMap(),
            getScanners()
        ]);

        // Загружаем SVG карты
        const svgText = await getMapSvg(mapData.file);

        const svg = await loadMap(
            mapContainer,
            svgText
        );

        // Выбранный сканер
        const handleScannerSelected = (scanner) => {
            // Снимаем выбор с тега
            clearTagSelection(svg);

            // Выделяем сканер
            selectScanner(svg, scanner);

            // Показываем данные сканера
            renderScannerSidebar(scanner);
        };

        // Рисуем сканеры
        renderScanners(
            svg,
            scanners,
            handleScannerSelected
        );

        // WebSocket тегов
        connectTags(
            svg,
            (tag) => {
                // При выборе/обновлении тега
                // снимаем выбор со сканера
                clearScannerSelection(svg);

                // Показываем актуальные данные тега
                renderTagSidebar(tag);
            }
        );

        // Клик по свободному месту карты
        svg.addEventListener("click", (event) => {
            // Если кликнули непосредственно по SVG,
            // а не по scanner/tag
            if (event.target === svg) {
                clearScannerSelection(svg);
                clearTagSelection(svg);
                clearSidebar();
            }
        });

    } catch (error) {
        console.error("Ошибка инициализации приложения:", error);

        const mapContainer = document.getElementById("map");

        if (mapContainer) {
            mapContainer.innerHTML = `
                <div style="
                    padding: 20px;
                    color: #c62828;
                    background: #ffebee;
                    border: 1px solid #ef9a9a;
                ">
                    Не удалось загрузить карту
                </div>
            `;
        }
    }
}


document.addEventListener("DOMContentLoaded", init);