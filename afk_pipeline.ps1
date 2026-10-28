param(
    [string]$SpecPath = "docs/designs/portfolio_redesign.md"
)

$ErrorActionPreference = "Continue"
$projectRoot = $PSScriptRoot
Set-Location $projectRoot

$logFile = "$projectRoot\docs\nightly_pipeline_output.log"
if (-not (Test-Path "$projectRoot\docs")) { New-Item -ItemType Directory -Path "$projectRoot\docs" -Force }

function Log($msg, $color="Cyan") {
    Write-Host $msg -ForegroundColor $color
    Add-Content -Path $logFile -Value $msg
}

"" | Set-Content -Path $logFile
Log "==========================================================" "Cyan"
Log " [AFK Pipeline] Starting Nightly Run at $(Get-Date)" "Cyan"
Log " Specification: $SpecPath" "Cyan"
Log "==========================================================" "Cyan"

# Step 1: Implementation
Log "`n[AFK Pipeline] Step 1: Autonomous Implementation with Elephant..." "Green"
$implementPrompt = "Read the design specification at '$SpecPath' carefully. Implement all necessary changes: create _redirects, full rewrite of style.css with the soft text-led design system, update chrome.js for the responsive side-rail and dark mode, create projects.js manifest, update posts.js with kind/lede fields, update script.js for renderHomeFork/renderWorkPage/renderWritingPage, update index.html landing page fork, create work/index.html and writing/index.html, update about.html, and remove deprecated projects.html and blog.html. Ensure all HTML/CSS/JS syntax is valid and saved."

& agy -p $implementPrompt --dangerously-skip-permissions --mode accept-edits 2>&1 | Tee-Object -FilePath $logFile -Append

Log "`n[AFK Pipeline] Step 2: Context Cleared (Starting Clean Goldfish Session)..." "Yellow"

# Step 3: Goldfish Review Swarm
Log "`n[AFK Pipeline] Step 3: Spawning Goldfish Review Swarm (/egm:egm-review uninterrupted)..." "Magenta"
if (Test-Path $SpecPath) {
    & agy -p "/egm:egm-review $SpecPath uninterrupted" --dangerously-skip-permissions 2>&1 | Tee-Object -FilePath $logFile -Append
} else {
    Log "Warning: Spec file not found at $SpecPath" "Red"
}

# Step 4: Codebase Drift Report
Log "`n[AFK Pipeline] Step 4: Running Codebase Drift Report (/egm:egm-drift-report)..." "Blue"
& agy -p "/egm:egm-drift-report" --dangerously-skip-permissions 2>&1 | Tee-Object -FilePath $logFile -Append

Log "`n==========================================================" "Green"
Log " [AFK Pipeline] Completed at $(Get-Date)! Reports saved in docs/" "Green"
Log "==========================================================" "Green"
