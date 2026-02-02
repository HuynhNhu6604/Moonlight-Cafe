$files = @(
    "checkout.html",
    "about.html",
    "news.html",
    "orders.html",
    "login.html",
    "register.html",
    "forgot-password.html"
)

$chatbotCode = @"


    <!-- TuDongChat AI Chatbot -->
    <script src="https://app.tudongchat.com/js/chatbox.js"></script>
    <script>
        const tudong_chatbox = new TuDongChat('XUitpr3VDU2e5vJgSRYO9')
        tudong_chatbox.initial()
    </script>
</body>
"@

foreach ($file in $files) {
    $filepath = "d:\MON_HOC\DO_AN_MOONLIGH\$file"
    if (Test-Path $filepath) {
        $content = Get-Content $filepath -Raw
        
        # Check if chatbot is already added
        if ($content -notmatch 'TuDongChat') {
            # Replace closing </body> tag
            $content = $content -replace '</body>', $chatbotCode
            Set-Content -Path $filepath -Value $content -NoNewline
            Write-Host "✅ Added chatbot to $file" -ForegroundColor Green
        } else {
            Write-Host "⏭️  Chatbot already exists in $file" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ File not found: $file" -ForegroundColor Red
    }
}

Write-Host "`n✨ Done! Added chatbot to all pages" -ForegroundColor Cyan
