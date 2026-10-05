export let svg = null;


export async function loadMap(
    container,
    svgText
) {

    container.innerHTML = svgText;

    svg = container.querySelector("svg");

    if (!svg) {
        throw new Error(
            "В SVG не найден элемент <svg>"
        );
    }

    return svg;
}