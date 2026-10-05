from pathlib import Path

# Укажи путь к папке
ROOT_DIR = Path(r"C:\Projects\alpha")

# Куда сохранить результат
OUTPUT_FILE = Path("result.txt")

# Папки, которые нужно пропускать
SKIP_DIRS = {".venv"}

# Расширения файлов, которые читаем
TEXT_EXTENSIONS = {
    ".txt",
    ".py",
    ".js",
    ".ts",
    ".jsx",
    ".tsx",
    ".html",
    ".css",
    ".json",
    ".xml",
    ".md",
    ".yaml",
    ".yml",
    ".csv",
}


def main():
    with OUTPUT_FILE.open("w", encoding="utf-8") as output:

        for file_path in ROOT_DIR.rglob("*"):

            # Пропускаем файлы внутри .venv
            if any(part in SKIP_DIRS for part in file_path.parts):
                continue

            if not file_path.is_file():
                continue

            # Пропускаем неизвестные типы файлов
            if file_path.suffix.lower() not in TEXT_EXTENSIONS:
                continue

            # Путь относительно ROOT_DIR
            relative_path = file_path.relative_to(ROOT_DIR)

            try:
                text = file_path.read_text(encoding="utf-8")

                output.write(f"\n{'=' * 80}\n")
                output.write(f"FILE: {relative_path}\n")
                output.write(f"{'=' * 80}\n\n")
                output.write(text)
                output.write("\n\n")

                print(f"Прочитан: {relative_path}")

            except Exception as e:
                print(f"Ошибка при чтении {relative_path}: {e}")


if __name__ == "__main__":
    main()
