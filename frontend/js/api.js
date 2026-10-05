export async function getMap() {

    const response = await fetch(
        "/api/map"
    );

    if (!response.ok) {
        throw new Error(
            `Не удалось загрузить карту: ${response.status}`
        );
    }

    return response.json();
}


export async function getScanners() {

    const response = await fetch(
        "/api/scanners"
    );

    if (!response.ok) {
        throw new Error(
            `Не удалось загрузить сканеры: ${response.status}`
        );
    }

    return response.json();
}


export async function getMapSvg(file) {

    const response = await fetch(file);

    if (!response.ok) {
        throw new Error(
            `Не удалось загрузить SVG: ${response.status}`
        );
    }

    return response.text();
}