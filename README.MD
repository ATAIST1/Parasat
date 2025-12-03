## Настройка для разработки
используй user-secrets:
   ```bash
   dotnet init
   dotnet user-secrets set "MongoDb:ConnectionString" "mongodb+srv://..."
   dotnet user-secrets set "Jwt:Key" "твой-ключ-минимум-32-символа"
   dotnet user-secrets set "Email:Username" "kasen.ernar06@gmail.com"
   dotnet user-secrets set "Email:Password" ""
   dotnet user-secrets set "Email:From" "no-reply@parasat.kz"
Ключ и URI спрашивать у Ернара
