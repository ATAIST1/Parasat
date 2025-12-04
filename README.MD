## Настройка для разработки
используй user-secrets:
   ```bash
   dotnet init
   dotnet user-secrets set "MongoDb:ConnectionString" "mongodb+srv://..."
   dotnet user-secrets set "Jwt:Key" "твой-ключ-минимум-32-символа"
Ключ и URI спрашивать у Ернара
