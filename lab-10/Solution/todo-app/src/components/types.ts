export interface TodoItem {
  id: string; // Используем string для уникального id (можно генерировать через crypto.randomUUID() или Date.now().toString())
  title: string;
  isDone: boolean; // Переименовали completed -> isDone
}
