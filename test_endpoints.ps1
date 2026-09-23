$endpoints = @(
  @{ name = 'Health Check'; url = 'http://localhost:5000/api/health'; method = 'Get' },
  @{ name = 'Demo SME Loader'; url = 'http://localhost:5000/api/data/demo'; method = 'Post' },
  @{ name = 'Dashboard Summary'; url = 'http://localhost:5000/api/dashboard'; method = 'Get' },
  @{ name = 'Sales Analytics'; url = 'http://localhost:5000/api/analytics/sales'; method = 'Get' },
  @{ name = 'Expense Analytics'; url = 'http://localhost:5000/api/analytics/expenses'; method = 'Get' },
  @{ name = 'Profitability Analytics'; url = 'http://localhost:5000/api/analytics/profitability'; method = 'Get' },
  @{ name = 'Inventory Intelligence'; url = 'http://localhost:5000/api/inventory'; method = 'Get' },
  @{ name = 'Customer Segments'; url = 'http://localhost:5000/api/customers'; method = 'Get' },
  @{ name = 'AI Insights Engine'; url = 'http://localhost:5000/api/insights'; method = 'Get' },
  @{ name = 'What-If Simulator'; url = 'http://localhost:5000/api/simulator'; method = 'Post'; body = '{"scenarioType":"price","product":"Wireless Earbuds","newPrice":1899}' },
  @{ name = 'Decision History'; url = 'http://localhost:5000/api/decisions'; method = 'Get' },
  @{ name = 'Ask Your Business (AI)'; url = 'http://localhost:5000/api/ai/assistant'; method = 'Post'; body = '{"query":"Why did my profit decrease this month?"}' },
  @{ name = 'Smart Alerts'; url = 'http://localhost:5000/api/alerts'; method = 'Get' },
  @{ name = 'Executive Report'; url = 'http://localhost:5000/api/reports/generate'; method = 'Get' },
  @{ name = 'Frontend React App'; url = 'http://localhost:3000'; method = 'Get' }
)

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "   SME SAGE - FULL-STACK INTEGRATION TEST SUITE" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan

$passed = 0
$failed = 0

foreach ($ep in $endpoints) {
  try {
    if ($ep.method -eq 'Post') {
      $body = if ($ep.ContainsKey('body')) { $ep.body } else { '{}' }
      $res = Invoke-RestMethod -Uri $ep.url -Method Post -ContentType 'application/json' -Body $body
    } else {
      $res = Invoke-WebRequest -Uri $ep.url -UseBasicParsing
    }
    Write-Host "[PASS] $($ep.name) -> HTTP OK" -ForegroundColor Green
    $passed++
  } catch {
    Write-Host "[FAIL] $($ep.name) -> $($_.Exception.Message)" -ForegroundColor Red
    $failed++
  }
}

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "Results: $passed Passed, $failed Failed" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan
