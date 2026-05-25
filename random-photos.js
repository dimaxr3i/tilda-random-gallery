export default async function handler(req, res) {
  const PUBLIC_KEY = "https://disk.yandex.ru/d/W4zzNyOB6GZy3Q";

  try {
    const response = await fetch(
      `https://cloud-api.yandex.net/v1/disk/public/resources?public_key=${encodeURIComponent(PUBLIC_KEY)}&limit=100`
    );

    const data = await response.json();

    if (!data._embedded || !data._embedded.items) {
      return res.status(500).json({
        error: "Не удалось получить список файлов"
      });
    }

    const images = data._embedded.items
      .filter(item =>
        item.type === "file" &&
        item.mime_type &&
        item.mime_type.startsWith("image/")
      )
      .map(item => item.file);

    // Перемешиваем
    const shuffled = images.sort(() => Math.random() - 0.5);

    // Берем 6 случайных
    const selected = shuffled.slice(0, 6);

    res.setHeader("Access-Control-Allow-Origin", "*");

    return res.status(200).json(selected);

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}
